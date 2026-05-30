import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleLayout from '@/layouts/role-layout';
import { apiErrorMessage, tokenStorage, userStorage } from '@/services/apiClient';
import { type AuthUser } from '@/services/authService';
import { cvService } from '@/services/cvService';
import { personService } from '@/services/personService';
import { Head } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type Completion = {
    percentage: number;
    checks: Record<string, boolean>;
};

type PersonProfile = {
    id?: number;
    talent_code?: string;
    status?: string;
    is_visible?: boolean;
    summary?: string | null;
    current_position?: string | null;
    years_experience?: number | null;
    contact_data?: { commune?: string | null; phone?: string | null; alternate_email?: string | null } | null;
    desired_conditions?: {
        desired_position?: string | null;
        work_modality?: string | null;
        work_schedule?: string | null;
        availability?: string | null;
    } | null;
    skills?: Array<{ id: number; name: string; type?: string; level?: string | null }>;
};

type CvUpload = {
    id: number;
    original_filename: string;
    status: string;
    created_at: string;
    latest_analysis_id?: number | null;
};

type CvAnalysis = {
    id: number;
    source: string;
    confidence_score?: number | null;
    result?: unknown;
    alerts?: string[] | null;
    applied_at?: string | null;
};

type ApiData<T> = { data: T; message?: string };

const uploadStatusStyles: Record<string, string> = {
    analyzed: 'bg-provi-green/10 text-provi-green',
    queued: 'bg-provi-secondary/10 text-provi-secondary',
    processing: 'bg-provi-yellow/20 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
};

const emptyProfile = {
    summary: '',
    current_position: '',
    years_experience: '',
    commune: '',
    phone: '',
    desired_position: '',
    work_modality: '',
    work_schedule: '',
    availability: '',
};

export default function PersonaDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [profile, setProfile] = useState<PersonProfile | null>(null);
    const [completion, setCompletion] = useState<Completion | null>(null);
    const [uploads, setUploads] = useState<CvUpload[]>([]);
    const [analysis, setAnalysis] = useState<CvAnalysis | null>(null);
    const [blindCv, setBlindCv] = useState<unknown>(null);
    const [form, setForm] = useState(emptyProfile);
    const [skillName, setSkillName] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadPersonaData = async () => {
        setLoading(true);
        setError('');

        try {
            const [profileResponse, completionResponse, uploadsResponse, blindCvResponse] = await Promise.all([
                personService.profile() as Promise<ApiData<PersonProfile>>,
                personService.completion() as Promise<ApiData<Completion>>,
                cvService.uploads() as Promise<ApiData<CvUpload[]>>,
                personService.blindCvPreview() as Promise<ApiData<unknown>>,
            ]);

            const nextProfile = profileResponse.data;
            setProfile(nextProfile);
            setCompletion(completionResponse.data);
            setUploads(uploadsResponse.data);
            setBlindCv(blindCvResponse.data);
            setForm({
                summary: nextProfile.summary ?? '',
                current_position: nextProfile.current_position ?? '',
                years_experience: nextProfile.years_experience?.toString() ?? '',
                commune: nextProfile.contact_data?.commune ?? '',
                phone: nextProfile.contact_data?.phone ?? '',
                desired_position: nextProfile.desired_conditions?.desired_position ?? '',
                work_modality: nextProfile.desired_conditions?.work_modality ?? '',
                work_schedule: nextProfile.desired_conditions?.work_schedule ?? '',
                availability: nextProfile.desired_conditions?.availability ?? '',
            });
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el panel persona.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = tokenStorage.get();
        if (!token) {
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);
        setUser(userStorage.get<AuthUser>());
        void loadPersonaData();
    }, []);

    const updateField = (field: keyof typeof emptyProfile, value: string) => setForm((current) => ({ ...current, [field]: value }));

    const saveProfile: FormEventHandler = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');

        try {
            await personService.updateProfile({
                summary: form.summary,
                current_position: form.current_position,
                years_experience: form.years_experience ? Number(form.years_experience) : null,
                contact: { commune: form.commune, phone: form.phone },
                desired: {
                    desired_position: form.desired_position,
                    work_modality: form.work_modality,
                    work_schedule: form.work_schedule,
                    availability: form.availability,
                },
            });
            setMessage('Perfil actualizado correctamente.');
            await loadPersonaData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible guardar el perfil.'));
        } finally {
            setSaving(false);
        }
    };

    const addSkill: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!skillName.trim()) return;

        setError('');
        setMessage('');

        try {
            await personService.createSkill({ name: skillName, type: 'technical' });
            setSkillName('');
            setMessage('Competencia agregada.');
            await loadPersonaData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible agregar la competencia.'));
        }
    };

    const uploadCv: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!cvFile) {
            setError('Selecciona un archivo PDF, DOCX o DOC.');
            return;
        }

        setUploading(true);
        setError('');
        setMessage('');

        try {
            await cvService.upload(cvFile, consentAccepted);
            setCvFile(null);
            setConsentAccepted(false);
            setMessage('CV cargado. El analisis queda en cola; refresca en unos segundos.');
            await loadPersonaData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el CV.'));
        } finally {
            setUploading(false);
        }
    };

    const loadAnalysis = async (analysisId?: number | null) => {
        if (!analysisId) return;

        setError('');
        try {
            const response = (await cvService.analysis(analysisId)) as ApiData<CvAnalysis>;
            setAnalysis(response.data);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el analisis.'));
        }
    };

    const applyAnalysis = async () => {
        if (!analysis) return;

        setError('');
        setMessage('');
        try {
            await cvService.applyToProfile(analysis.id);
            setMessage('Analisis aplicado al perfil. Revisa los datos antes de solicitar validacion.');
            await loadPersonaData();
            await loadAnalysis(analysis.id);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible aplicar el analisis.'));
        }
    };

    const requestValidation = async () => {
        setError('');
        setMessage('');
        try {
            const response = (await personService.requestValidation()) as { message?: string };
            setMessage(response.message ?? 'Solicitud de validacion enviada.');
            await loadPersonaData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible solicitar validacion.'));
        }
    };

    const hasProtectedCv = Boolean(blindCv);

    return (
        <RoleLayout role="persona" title="Panel Persona">
            <Head title="Panel Persona" />

            <div className="provi-card mb-6 flex min-w-0 flex-col gap-4 overflow-hidden p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <p className="provi-chip w-fit">ProviEmplea 2026</p>
                    <h2 className="mt-3 text-3xl font-black text-provi-dark lg:text-4xl">Completa tu perfil laboral</h2>
                    <p className="mt-2 break-words text-provi-muted">{user ? `${user.name} · ${user.email}` : 'Portal persona municipal'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => void loadPersonaData()} disabled={loading}>
                        <RefreshCw className="h-4 w-4" /> Refrescar
                    </Button>
                </div>
            </div>

            {message && <div className="mb-4 rounded-2xl bg-provi-green/10 p-4 text-sm font-bold text-provi-green">{message}</div>}
            <InputError message={error} className="mb-4 rounded-2xl bg-red-50 p-4" />

            {!isAuthenticated && (
                <div className="provi-card mb-6 p-6">
                    <h3 className="text-2xl font-black text-provi-dark">Acceso para personas registradas</h3>
                    <p className="mt-2 text-provi-muted">Para cargar tu informacion personal debes iniciar sesion con una cuenta Persona.</p>
                    <div className="mt-4">
                        <Button onClick={() => (window.location.href = '/login')}>Ingresar</Button>
                    </div>
                </div>
            )}

            {isAuthenticated && loading ? (
                <div className="provi-card p-10 text-center text-provi-muted">Cargando informacion persona...</div>
            ) : isAuthenticated ? (
                <div className="grid gap-6 lg:grid-cols-1 2xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.25fr)]">
                    <section className="provi-card min-w-0 p-6">
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-2xl font-black text-provi-dark">Perfil laboral</h3>
                                <p className="break-words text-sm text-provi-muted">
                                    Estado: {profile?.status ?? 'draft'} · Codigo: {profile?.talent_code ?? 'pendiente'}
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-4xl font-black text-provi-primary">{completion?.percentage ?? 0}%</p>
                                <p className="text-xs font-bold tracking-[0.16em] text-provi-muted uppercase">completitud</p>
                            </div>
                        </div>

                        <form className="grid gap-4" onSubmit={saveProfile}>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Resumen laboral</Label>
                                <textarea
                                    id="summary"
                                    value={form.summary}
                                    onChange={(event) => updateField('summary', event.target.value)}
                                    className="border-input bg-background min-h-28 rounded-md border px-3 py-2 text-sm"
                                    placeholder="Describe tu experiencia, fortalezas y objetivo laboral."
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_position">Cargo actual o ultimo cargo</Label>
                                    <Input
                                        id="current_position"
                                        value={form.current_position}
                                        onChange={(event) => updateField('current_position', event.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="years_experience">Anos de experiencia</Label>
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        min="0"
                                        max="60"
                                        value={form.years_experience}
                                        onChange={(event) => updateField('years_experience', event.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="commune">Comuna</Label>
                                    <Input id="commune" value={form.commune} onChange={(event) => updateField('commune', event.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Telefono privado</Label>
                                    <Input id="phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desired_position">Cargo buscado</Label>
                                    <Input
                                        id="desired_position"
                                        value={form.desired_position}
                                        onChange={(event) => updateField('desired_position', event.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="work_modality">Modalidad</Label>
                                    <Input
                                        id="work_modality"
                                        value={form.work_modality}
                                        onChange={(event) => updateField('work_modality', event.target.value)}
                                        placeholder="Presencial, remoto, hibrido"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="work_schedule">Jornada</Label>
                                    <Input
                                        id="work_schedule"
                                        value={form.work_schedule}
                                        onChange={(event) => updateField('work_schedule', event.target.value)}
                                        placeholder="Completa, parcial, turnos"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="availability">Disponibilidad</Label>
                                    <Input
                                        id="availability"
                                        value={form.availability}
                                        onChange={(event) => updateField('availability', event.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="bg-provi-secondary font-bold hover:bg-provi-secondary/90" disabled={saving}>
                                {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Guardar perfil
                            </Button>
                        </form>

                        <form className="mt-8 rounded-[1.5rem] bg-provi-light p-4" onSubmit={addSkill}>
                            <Label htmlFor="skill">Agregar competencia</Label>
                            <div className="mt-2 flex gap-2">
                                <Input
                                    id="skill"
                                    value={skillName}
                                    onChange={(event) => setSkillName(event.target.value)}
                                    placeholder="Excel, atencion de publico, bodega..."
                                />
                                <Button type="submit" variant="outline">
                                    Agregar
                                </Button>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {profile?.skills?.map((skill) => (
                                    <span key={skill.id} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-provi-muted shadow-sm">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </form>
                    </section>

                    <aside className="grid min-w-0 gap-6 overflow-x-hidden">
                        <section className="provi-card min-w-0 p-6">
                            <h3 className="text-2xl font-black text-provi-dark">Carga de CV</h3>
                            <p className="mt-2 text-sm text-provi-muted">
                                Formatos aceptados: PDF, DOCX o DOC. Maximo 15 MB. El archivo real queda privado.
                            </p>
                            <form className="mt-5 grid gap-5" onSubmit={uploadCv}>
                                <div className="rounded-2xl border border-dashed border-provi-secondary/40 bg-provi-light/60 p-4">
                                    <Label htmlFor="persona-cv-file" className="mb-2 block text-sm font-bold text-provi-dark">
                                        Archivo CV
                                    </Label>
                                    <Input
                                        id="persona-cv-file"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
                                        className="sr-only"
                                    />
                                    <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-xl border border-provi-secondary/25 bg-white p-3">
                                        <label
                                            htmlFor="persona-cv-file"
                                            className="cursor-pointer rounded-full bg-provi-secondary/10 px-4 py-2 text-xs font-bold tracking-[0.06em] text-provi-secondary transition-colors hover:bg-provi-secondary/20"
                                        >
                                            Seleccionar archivo
                                        </label>
                                        <p className="min-w-0 flex-1 wrap-anywhere text-sm text-provi-dark">
                                            {cvFile ? cvFile.name : 'Ningun archivo seleccionado'}
                                        </p>
                                    </div>
                                    {!cvFile && <p className="mt-2 text-xs text-provi-muted">Selecciona un archivo para continuar.</p>}
                                </div>

                                <label className="flex items-start gap-3 rounded-2xl border border-provi-primary/25 bg-provi-primary/10 p-4 text-sm font-medium leading-6 text-provi-dark">
                                    <input
                                        type="checkbox"
                                        checked={consentAccepted}
                                        onChange={(event) => setConsentAccepted(event.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-provi-secondary text-provi-secondary focus-visible:ring-2 focus-visible:ring-provi-secondary/40"
                                    />
                                    <span>
                                        Acepto que mi CV sea procesado para generar perfil laboral y CV protegido. Mis datos personales no seran
                                        visibles para empresas.
                                    </span>
                                </label>

                                <Button
                                    type="submit"
                                    className="h-11 w-fit px-6 text-base font-bold bg-provi-purple text-white hover:bg-provi-purple/90"
                                    disabled={uploading || !consentAccepted}
                                >
                                    {uploading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {uploading ? 'Subiendo CV...' : 'Subir CV'}
                                </Button>
                            </form>

                            <div className="mt-6 grid gap-3">
                                {uploads.length === 0 && (
                                    <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-provi-muted">
                                        Aun no tienes cargas de CV. Sube un archivo para iniciar el analisis.
                                    </p>
                                )}

                                {uploads.map((upload) => (
                                    <div key={upload.id} className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="min-w-0 flex-1 wrap-anywhere font-bold text-provi-dark">{upload.original_filename}</p>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase ${uploadStatusStyles[upload.status] ?? 'bg-slate-100 text-slate-700'}`}
                                            >
                                                {upload.status}
                                            </span>
                                        </div>
                                        <Button
                                            className="mt-3"
                                            size="sm"
                                            variant="outline"
                                            disabled={!upload.latest_analysis_id}
                                            onClick={() => void loadAnalysis(upload.latest_analysis_id)}
                                        >
                                            Ver analisis
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {analysis && (
                            <section className="provi-card min-w-0 overflow-hidden p-6">
                                <h3 className="text-xl font-black text-provi-dark">Analisis CV #{analysis.id}</h3>
                                <p className="mt-2 text-sm text-provi-muted">
                                    Fuente: {analysis.source} · Confianza: {analysis.confidence_score ?? 'N/A'}
                                </p>
                                <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100 whitespace-pre-wrap wrap-anywhere">
                                    {JSON.stringify(analysis.result, null, 2)}
                                </pre>
                                <Button
                                    className="mt-4 bg-provi-secondary font-bold hover:bg-provi-secondary/90"
                                    onClick={() => void applyAnalysis()}
                                    disabled={Boolean(analysis.applied_at)}
                                >
                                    {analysis.applied_at ? 'Analisis aplicado' : 'Aplicar al perfil'}
                                </Button>
                            </section>
                        )}

                        <section className="provi-card min-w-0 overflow-hidden p-6">
                            <h3 className="text-xl font-black text-provi-dark">CV protegido</h3>
                            <p className="mt-1 text-sm text-provi-muted">Estado de cumplimiento sobre proteccion de datos personales.</p>

                            <div
                                className={`mt-4 rounded-2xl border p-5 ${hasProtectedCv ? 'border-provi-green/30 bg-provi-green/10' : 'border-provi-yellow/40 bg-provi-yellow/10'}`}
                            >
                                <div className="flex items-start gap-3">
                                    {hasProtectedCv ? (
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-provi-green" />
                                    ) : (
                                        <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-700" />
                                    )}
                                    <div>
                                        <p className={`text-sm font-black tracking-[0.08em] uppercase ${hasProtectedCv ? 'text-provi-green' : 'text-amber-700'}`}>
                                            {hasProtectedCv ? 'Aprobado' : 'Pendiente'}
                                        </p>
                                        <p className="mt-1 text-sm text-provi-dark">
                                            {hasProtectedCv
                                                ? 'Tu CV se encuentra protegido bajo la normativa de proteccion de datos y no expone datos personales directos.'
                                                : 'Aun no se detecta un CV protegido. Sube y procesa tu CV para habilitar este estado.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!hasProtectedCv && (
                                <Button className="mt-4 w-full sm:w-fit" variant="outline" onClick={() => void requestValidation()}>
                                    Solicitar validacion
                                </Button>
                            )}
                        </section>
                    </aside>
                </div>
            ) : null}
        </RoleLayout>
    );
}
