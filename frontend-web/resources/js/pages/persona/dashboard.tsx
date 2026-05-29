import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleLayout from '@/layouts/role-layout';
import { apiErrorMessage, tokenStorage, userStorage } from '@/services/apiClient';
import { authService, type AuthUser } from '@/services/authService';
import { cvService } from '@/services/cvService';
import { personService } from '@/services/personService';
import { Head } from '@inertiajs/react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
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
        if (!tokenStorage.get()) {
            window.location.href = '/login';
            return;
        }

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

    const logout = async () => {
        await authService.logout();
        window.location.href = '/';
    };

    return (
        <RoleLayout role="persona" title="Panel Persona">
            <Head title="Panel Persona" />

            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-bold tracking-[0.25em] text-teal-700 uppercase">ProviEmplea 2026</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">Completa tu perfil laboral</h2>
                    <p className="mt-2 text-slate-600">{user ? `${user.name} · ${user.email}` : 'Sesion persona con Bearer Token'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => void loadPersonaData()} disabled={loading}>
                        <RefreshCw className="h-4 w-4" /> Refrescar
                    </Button>
                    <Button variant="outline" onClick={() => void logout()}>
                        Salir
                    </Button>
                </div>
            </div>

            {message && <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{message}</div>}
            <InputError message={error} className="mb-4 rounded-2xl bg-red-50 p-4" />

            {loading ? (
                <div className="rounded-3xl bg-white p-10 text-center text-slate-600">Cargando informacion persona...</div>
            ) : (
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-950">Perfil laboral</h3>
                                <p className="text-sm text-slate-600">
                                    Estado: {profile?.status ?? 'draft'} · Codigo: {profile?.talent_code ?? 'pendiente'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-teal-700">{completion?.percentage ?? 0}%</p>
                                <p className="text-xs text-slate-500">completitud</p>
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
                            <Button type="submit" className="bg-teal-700 hover:bg-teal-800" disabled={saving}>
                                {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Guardar perfil
                            </Button>
                        </form>

                        <form className="mt-8 rounded-2xl bg-slate-50 p-4" onSubmit={addSkill}>
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
                                    <span key={skill.id} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </form>
                    </section>

                    <aside className="grid gap-6">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-950">Carga de CV</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Formatos aceptados: PDF, DOCX o DOC. Maximo 15 MB. El archivo real queda privado.
                            </p>
                            <form className="mt-5 grid gap-4" onSubmit={uploadCv}>
                                <Input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setCvFile(event.target.files?.[0] ?? null)} />
                                <label className="flex gap-3 rounded-2xl bg-teal-50 p-4 text-sm text-teal-950">
                                    <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} />
                                    Acepto que mi CV sea procesado para generar perfil laboral y CV ciego. Mis datos personales no seran visibles para
                                    empresas.
                                </label>
                                <Button type="submit" className="bg-teal-700 hover:bg-teal-800" disabled={uploading || !consentAccepted}>
                                    {uploading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Subir CV
                                </Button>
                            </form>

                            <div className="mt-6 grid gap-3">
                                {uploads.map((upload) => (
                                    <div key={upload.id} className="rounded-2xl border border-slate-100 p-4">
                                        <p className="font-bold text-slate-900">{upload.original_filename}</p>
                                        <p className="text-sm text-slate-600">Estado: {upload.status}</p>
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
                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-xl font-black text-slate-950">Analisis CV #{analysis.id}</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Fuente: {analysis.source} · Confianza: {analysis.confidence_score ?? 'N/A'}
                                </p>
                                <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                                    {JSON.stringify(analysis.result, null, 2)}
                                </pre>
                                <Button
                                    className="mt-4 bg-teal-700 hover:bg-teal-800"
                                    onClick={() => void applyAnalysis()}
                                    disabled={Boolean(analysis.applied_at)}
                                >
                                    {analysis.applied_at ? 'Analisis aplicado' : 'Aplicar al perfil'}
                                </Button>
                            </section>
                        )}

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-950">CV ciego</h3>
                                    <p className="text-sm text-slate-600">Preview sin datos personales directos.</p>
                                </div>
                                <Button variant="outline" onClick={() => void requestValidation()}>
                                    Solicitar validacion
                                </Button>
                            </div>
                            <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                                {JSON.stringify(blindCv, null, 2)}
                            </pre>
                        </section>
                    </aside>
                </div>
            )}
        </RoleLayout>
    );
}
