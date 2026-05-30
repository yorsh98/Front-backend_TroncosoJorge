import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import RoleLayout from '@/layouts/role-layout';
import { apiErrorMessage, tokenStorage, userStorage } from '@/services/apiClient';
import { type AuthUser } from '@/services/authService';
import { companyService } from '@/services/companyService';
import { Head, Link } from '@inertiajs/react';
import { LoaderCircle, RefreshCw, Search } from 'lucide-react';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';

type ApiData<T> = { data: T; message?: string };
type ValidationErrors = Record<string, string>;

type CompanyProfile = {
    id?: number;
    company_name?: string;
    rut?: string | null;
    industry?: string | null;
    size?: string | null;
    commune?: string | null;
    address?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    status?: string;
};

type BlindCv = {
    blind_cv_code: string;
    summary?: string | null;
    education?: unknown;
    work_experience?: unknown;
    certifications?: unknown;
    technical_skills?: unknown;
    languages?: unknown;
    desired_conditions?: unknown;
    show_law_21015?: boolean;
    published_at?: string | null;
};

type PaginatedTalents = {
    data: BlindCv[];
    current_page?: number;
    last_page?: number;
    total?: number;
};

type ContactRequest = {
    id: number;
    status: string;
    position_offered?: string | null;
    message?: string | null;
    created_at?: string;
    blind_cv_profile?: { blind_cv_code?: string; summary?: string | null };
};

const emptyCompany = {
    company_name: '',
    rut: '',
    industry: '',
    size: '',
    commune: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    position: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rutRegex = /^\d{7,8}-[\dkK]$/;
const phoneRegex = /^[+]?[-()\d\s]{8,20}$/;
const textRegex = /^[\p{L}\p{N}.,:;()\-_/"'\s]+$/u;

const requestStatusLabel: Record<string, string> = {
    requested: 'Solicitada',
    under_review: 'En revision',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    contacted: 'Contacto realizado',
    interview: 'Entrevista',
    selected: 'Seleccionado/a',
    not_selected: 'No seleccionado/a',
    closed: 'Cerrada',
};

const fieldLabelEs: Record<string, string> = {
    level: 'Nivel',
    career: 'Carrera',
    institution: 'Institucion',
    completed: 'Completado',
    start_year: 'Año de inicio',
    end_year: 'Año de término',
    start_date: 'Fecha de inicio',
    end_date: 'Fecha de termino',
    position: 'Cargo',
    description: 'Descripcion',
    company_name: 'Empresa',
    work_modality: 'Modalidad',
    work_schedule: 'Jornada',
    availability: 'Disponibilidad',
    desired_position: 'Cargo deseado',
    communes: 'Comunas',
    preferred_communes: 'Comunas preferidas',
    location: 'Ubicacion',
};

const asList = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
    if (typeof value === 'object') return Object.values(value).map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
    return [String(value)];
};

const toSentenceCase = (value: string): string => value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());

const toSpanishLabel = (key: string): string => fieldLabelEs[key] ?? toSentenceCase(key);

const formatPrimitiveValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'boolean') {
        return value ? 'Si' : 'No';
    }

    if (typeof value === 'number') {
        return String(value);
    }

    if (typeof value !== 'string') {
        return String(value);
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
        try {
            const parsed = JSON.parse(trimmed) as unknown;
            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => formatPrimitiveValue(item))
                    .filter(Boolean)
                    .join(', ');
            }
            if (parsed && typeof parsed === 'object') {
                return Object.values(parsed)
                    .map((item) => formatPrimitiveValue(item))
                    .filter(Boolean)
                    .join(', ');
            }
        } catch {
            return trimmed;
        }
    }

    if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
        const parsedDate = new Date(trimmed);
        if (!Number.isNaN(parsedDate.valueOf())) {
            return parsedDate.toLocaleDateString('es-CL');
        }
    }

    return trimmed;
};

const asStructuredItems = (value: unknown): Array<Record<string, unknown>> => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
    }

    if (typeof value === 'object') {
        return [value as Record<string, unknown>];
    }

    return [];
};

const cleanText = (value: string): string => value.replace(/[<>]/g, '').trim();

const validateCompanyForm = (form: typeof emptyCompany): ValidationErrors => {
    const errors: ValidationErrors = {};
    const companyName = cleanText(form.company_name);
    const rut = cleanText(form.rut).toLowerCase();
    const industry = cleanText(form.industry);
    const size = cleanText(form.size);
    const commune = cleanText(form.commune);
    const address = cleanText(form.address);
    const contactEmail = cleanText(form.contact_email).toLowerCase();
    const contactPhone = cleanText(form.contact_phone);

    if (!companyName || companyName.length < 3 || companyName.length > 120 || !textRegex.test(companyName)) {
        errors.company_name = 'Ingresa una razón social válida (3 a 120 caracteres).';
    }
    if (rut && !rutRegex.test(rut)) {
        errors.rut = 'Ingresa un RUT válido. Ejemplo: 12345678-9.';
    }
    if (industry && (industry.length < 2 || industry.length > 80 || !textRegex.test(industry))) {
        errors.industry = 'El rubro debe tener entre 2 y 80 caracteres válidos.';
    }
    if (size && (size.length < 2 || size.length > 40 || !textRegex.test(size))) {
        errors.size = 'El tamaño debe tener entre 2 y 40 caracteres válidos.';
    }
    if (commune && (commune.length < 2 || commune.length > 80 || !textRegex.test(commune))) {
        errors.commune = 'La comuna debe tener entre 2 y 80 caracteres válidos.';
    }
    if (address && (address.length < 5 || address.length > 160 || !textRegex.test(address))) {
        errors.address = 'La dirección debe tener entre 5 y 160 caracteres válidos.';
    }
    if (!contactEmail || !emailRegex.test(contactEmail)) {
        errors.contact_email = 'Ingresa un correo de contacto válido.';
    }
    if (!contactPhone || !phoneRegex.test(contactPhone)) {
        errors.contact_phone = 'Ingresa un teléfono válido (8 a 20 caracteres).';
    }

    return errors;
};

const validateRequestForm = (form: { position_offered: string; message: string }): ValidationErrors => {
    const errors: ValidationErrors = {};
    const position = cleanText(form.position_offered);
    const message = cleanText(form.message);

    if (!position || position.length < 3 || position.length > 80 || !textRegex.test(position)) {
        errors.position_offered = 'Ingresa un cargo ofrecido válido (3 a 80 caracteres).';
    }
    if (!message || message.length < 20 || message.length > 1200 || !textRegex.test(message)) {
        errors.message = 'El mensaje debe tener entre 20 y 1200 caracteres válidos.';
    }

    return errors;
};

const areFiltersValid = (filters: { skill: string; modality: string; schedule: string; availability: string }): boolean => {
    const values = [filters.skill, filters.modality, filters.schedule, filters.availability].map(cleanText);
    return values.every((value) => value.length <= 60 && (!value || textRegex.test(value)));
};

export default function EmpresaDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [form, setForm] = useState(emptyCompany);
    const [talents, setTalents] = useState<BlindCv[]>([]);
    const [talentsPagination, setTalentsPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });
    const [selectedTalent, setSelectedTalent] = useState<BlindCv | null>(null);
    const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
    const [filters, setFilters] = useState({ skill: '', modality: '', schedule: '', availability: '', disability: false });
    const [requestForm, setRequestForm] = useState({ position_offered: '', message: '' });
    const [companyFormErrors, setCompanyFormErrors] = useState<ValidationErrors>({});
    const [requestFormErrors, setRequestFormErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searching, setSearching] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const companyFormReady = Object.keys(validateCompanyForm(form)).length === 0;
    const contactFormReady = Object.keys(validateRequestForm(requestForm)).length === 0;

    const loadCompanyData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const [profileResponse, requestsResponse] = await Promise.all([
                companyService.profile() as Promise<ApiData<CompanyProfile>>,
                companyService.contactRequests() as Promise<ApiData<ContactRequest[]>>,
            ]);

            const nextCompany = profileResponse.data;
            setCompany(nextCompany);
            setContactRequests(requestsResponse.data);
            setForm({
                company_name: nextCompany.company_name ?? '',
                rut: nextCompany.rut ?? '',
                industry: nextCompany.industry ?? '',
                size: nextCompany.size ?? '',
                commune: nextCompany.commune ?? '',
                address: nextCompany.address ?? '',
                contact_email: nextCompany.contact_email ?? '',
                contact_phone: nextCompany.contact_phone ?? '',
                position: 'Contacto empresa',
            });
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el panel empresa.'));
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTalents = useCallback(
        async (page = 1) => {
            if (!areFiltersValid(filters)) {
                setError('Los filtros contienen caracteres no permitidos o exceden el largo máximo.');
                return;
            }

            setSearching(true);
            setError('');

            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (typeof value === 'boolean') {
                        if (value) params.set(key, '1');
                        return;
                    }
                    if (value.trim()) params.set(key, value.trim());
                });
                params.set('page', String(page));

                const query = params.toString() ? `?${params.toString()}` : '';
                const response = (await companyService.talents(query)) as ApiData<PaginatedTalents>;
                const talentsPage = response.data;
                setTalents(talentsPage.data ?? []);
                setTalentsPagination({
                    currentPage: talentsPage.current_page ?? 1,
                    lastPage: talentsPage.last_page ?? 1,
                    total: talentsPage.total ?? 0,
                });
            } catch (caught) {
                setError(apiErrorMessage(caught, 'No fue posible cargar la vitrina de talentos.'));
            } finally {
                setSearching(false);
            }
        },
        [filters],
    );

    useEffect(() => {
        const token = tokenStorage.get();
        if (!token) {
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);
        setUser(userStorage.get<AuthUser>());
        void loadCompanyData();
        void searchTalents();
    }, [loadCompanyData, searchTalents]);

    const updateForm = (field: keyof typeof emptyCompany, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setCompanyFormErrors((current) => ({ ...current, [field]: '' }));
    };

    const updateFilter = (field: keyof typeof filters, value: string | boolean) => {
        setFilters((current) => ({ ...current, [field]: typeof value === 'string' ? value.replace(/[<>]/g, '') : value }));
    };

    const saveCompany: FormEventHandler = async (event) => {
        event.preventDefault();
        const validationErrors = validateCompanyForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setCompanyFormErrors(validationErrors);
            setError('Revisa los campos del perfil empresa antes de guardar.');
            return;
        }

        setSaving(true);
        setError('');
        setMessage('');

        try {
            await companyService.updateProfile(form);
            setMessage('Perfil empresa actualizado.');
            await loadCompanyData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible guardar el perfil empresa.'));
        } finally {
            setSaving(false);
        }
    };

    const loadTalentDetail = async (blindCvCode: string) => {
        setError('');
        try {
            const response = (await companyService.talent(blindCvCode)) as ApiData<BlindCv>;
            setSelectedTalent(response.data);
            setRequestForm({ position_offered: '', message: '' });
            setRequestFormErrors({});
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el CV protegido.'));
        }
    };

    const requestContact: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!selectedTalent) return;

        const validationErrors = validateRequestForm(requestForm);
        if (Object.keys(validationErrors).length > 0) {
            setRequestFormErrors(validationErrors);
            setError('Completa correctamente el formulario de contacto intermediado.');
            return;
        }

        setRequesting(true);
        setError('');
        setMessage('');

        try {
            const response = (await companyService.requestContact(selectedTalent.blind_cv_code, requestForm)) as { message?: string };
            setMessage(response.message ?? 'Solicitud de contacto enviada.');
            await loadCompanyData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible solicitar contacto.'));
        } finally {
            setRequesting(false);
        }
    };

    return (
        <RoleLayout role="empresa" title="Panel Empresa">
            <Head title="Panel Empresa" />

            <div className="provi-card mb-6 flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="provi-chip w-fit">ProviEmplea 2026</p>
                    <h2 className="text-provi-dark mt-3 text-3xl font-black lg:text-4xl">Vitrina de talentos con CV protegido</h2>
                    <p className="text-provi-muted mt-2">{user ? `${user.name} · ${user.email}` : 'Portal empresas municipal'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => void searchTalents()} disabled={searching}>
                        <RefreshCw className="h-4 w-4" /> Talentos
                    </Button>
                </div>
            </div>

            {message && <div className="bg-provi-green/10 text-provi-green mb-4 rounded-2xl p-4 text-sm font-bold">{message}</div>}
            <InputError message={error} className="mb-4 rounded-2xl bg-red-50 p-4" />

            {!isAuthenticated && (
                <div className="provi-card mb-6 p-6">
                    <h3 className="text-provi-dark text-2xl font-black">Acceso para empresas registradas</h3>
                    <p className="text-provi-muted mt-2">
                        Para cargar la informacion de empresa y usar la vitrina, inicia sesion con una cuenta Empresa.
                    </p>
                    <div className="mt-4">
                        <Button asChild>
                            <Link href="/login">Ingresar</Link>
                        </Button>
                    </div>
                </div>
            )}

            {isAuthenticated && loading ? (
                <div className="provi-card text-provi-muted p-10 text-center">Cargando informacion empresa...</div>
            ) : isAuthenticated ? (
                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <aside className="grid gap-6">
                        <section className="provi-card p-6">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-provi-dark text-2xl font-black">Perfil empresa</h3>
                                    <p className="text-provi-muted text-sm">Estado: {company?.status ?? 'pending_validation'}</p>
                                </div>
                                <span className="bg-provi-primary/10 text-provi-secondary rounded-full px-3 py-1 text-xs font-bold">
                                    {company?.status === 'active' ? 'Puede solicitar contacto' : 'Validacion pendiente'}
                                </span>
                            </div>

                            <form className="grid gap-4" onSubmit={saveCompany}>
                                <div className="grid gap-2">
                                    <Label htmlFor="company_name">Razon social o nombre empresa</Label>
                                    <Input
                                        id="company_name"
                                        value={form.company_name}
                                        onChange={(event) => updateForm('company_name', event.target.value)}
                                        required
                                        maxLength={120}
                                    />
                                    <InputError message={companyFormErrors.company_name} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="rut">RUT</Label>
                                        <Input id="rut" value={form.rut} onChange={(event) => updateForm('rut', event.target.value)} maxLength={10} />
                                        <InputError message={companyFormErrors.rut} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="industry">Rubro</Label>
                                        <Input
                                            id="industry"
                                            value={form.industry}
                                            onChange={(event) => updateForm('industry', event.target.value)}
                                            maxLength={80}
                                        />
                                        <InputError message={companyFormErrors.industry} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="size">Tamano</Label>
                                        <Input
                                            id="size"
                                            value={form.size}
                                            onChange={(event) => updateForm('size', event.target.value)}
                                            placeholder="Micro, pequena, mediana"
                                            maxLength={40}
                                        />
                                        <InputError message={companyFormErrors.size} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="commune">Comuna</Label>
                                        <Input
                                            id="commune"
                                            value={form.commune}
                                            onChange={(event) => updateForm('commune', event.target.value)}
                                            maxLength={80}
                                        />
                                        <InputError message={companyFormErrors.commune} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="address">Direccion</Label>
                                        <Input
                                            id="address"
                                            value={form.address}
                                            onChange={(event) => updateForm('address', event.target.value)}
                                            maxLength={160}
                                        />
                                        <InputError message={companyFormErrors.address} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_email">Email contacto</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={form.contact_email}
                                            onChange={(event) => updateForm('contact_email', event.target.value)}
                                            required
                                            maxLength={120}
                                        />
                                        <InputError message={companyFormErrors.contact_email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_phone">Telefono contacto</Label>
                                        <Input
                                            id="contact_phone"
                                            value={form.contact_phone}
                                            onChange={(event) => updateForm('contact_phone', event.target.value)}
                                            required
                                            maxLength={20}
                                        />
                                        <InputError message={companyFormErrors.contact_phone} />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-provi-secondary hover:bg-provi-secondary/90 font-bold"
                                    disabled={saving || !companyFormReady}
                                >
                                    {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Guardar empresa
                                </Button>
                                {!companyFormReady && (
                                    <p className="text-provi-muted text-sm">Completa los campos obligatorios con un formato valido para guardar.</p>
                                )}
                            </form>
                        </section>

                        <section className="provi-card p-6">
                            <h3 className="text-provi-dark text-xl font-black">Solicitudes enviadas</h3>
                            <div className="mt-4 grid gap-3">
                                {contactRequests.length === 0 && <p className="text-provi-muted text-sm">Aun no hay solicitudes de contacto.</p>}
                                {contactRequests.map((request) => (
                                    <div key={request.id} className="bg-provi-light rounded-2xl p-4">
                                        <p className="text-provi-dark font-bold">
                                            {request.blind_cv_profile?.blind_cv_code ?? `Solicitud #${request.id}`}
                                        </p>
                                        <p className="text-provi-muted text-sm">Estado: {requestStatusLabel[request.status] ?? request.status}</p>
                                        {request.position_offered && (
                                            <p className="text-provi-muted mt-1 text-sm">Cargo: {request.position_offered}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    <main className="grid gap-6">
                        <section className="provi-card p-6">
                            <h3 className="text-provi-dark text-2xl font-black">Buscar talentos</h3>
                            <form
                                className="mt-5 grid gap-4 lg:grid-cols-5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void searchTalents(1);
                                }}
                            >
                                <Input
                                    placeholder="Habilidad"
                                    value={filters.skill}
                                    onChange={(event) => updateFilter('skill', event.target.value)}
                                    maxLength={60}
                                />
                                <Input
                                    placeholder="Modalidad"
                                    value={filters.modality}
                                    onChange={(event) => updateFilter('modality', event.target.value)}
                                    maxLength={60}
                                />
                                <Input
                                    placeholder="Jornada"
                                    value={filters.schedule}
                                    onChange={(event) => updateFilter('schedule', event.target.value)}
                                    maxLength={60}
                                />
                                <Input
                                    placeholder="Disponibilidad"
                                    value={filters.availability}
                                    onChange={(event) => updateFilter('availability', event.target.value)}
                                    maxLength={60}
                                />
                                <Button type="submit" className="bg-provi-purple hover:bg-provi-purple/90 font-bold" disabled={searching}>
                                    {searching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    Buscar
                                </Button>
                                <label className="text-provi-muted flex items-center gap-2 text-sm lg:col-span-5">
                                    <input
                                        type="checkbox"
                                        checked={filters.disability}
                                        onChange={(event) => updateFilter('disability', event.target.checked)}
                                    />
                                    Mostrar perfiles que declaran Ley 21.015 cuando corresponda
                                </label>
                            </form>

                            <div className="text-provi-muted mt-4 flex items-center justify-between gap-3 text-sm">
                                <p>Resultados: {talentsPagination.total}</p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={searching || talentsPagination.currentPage <= 1}
                                        onClick={() => void searchTalents(talentsPagination.currentPage - 1)}
                                    >
                                        Anterior
                                    </Button>
                                    <span>
                                        Pagina {talentsPagination.currentPage} de {talentsPagination.lastPage}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={searching || talentsPagination.currentPage >= talentsPagination.lastPage}
                                        onClick={() => void searchTalents(talentsPagination.currentPage + 1)}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {talents.length === 0 && (
                                    <div className="bg-provi-light rounded-2xl p-4 md:col-span-2">
                                        <p className="text-provi-dark text-sm font-bold">No hay talentos para estos filtros.</p>
                                        <p className="text-provi-muted mt-1 text-sm">
                                            Prueba con menos criterios o busca sin filtros para ver todos los perfiles publicados.
                                        </p>
                                    </div>
                                )}
                                {talents.map((talent) => (
                                    <article
                                        key={talent.blind_cv_code}
                                        className="bg-provi-light rounded-[1.75rem] border border-white p-5 shadow-sm"
                                    >
                                        <p className="text-provi-secondary text-xs font-bold tracking-[0.2em] uppercase">{talent.blind_cv_code}</p>
                                        <h4 className="text-provi-dark mt-3 line-clamp-3 font-bold">
                                            {talent.summary ?? 'Perfil laboral publicado'}
                                        </h4>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {asList(talent.technical_skills)
                                                .slice(0, 4)
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="text-provi-muted rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                        </div>
                                        <Button className="mt-4" variant="outline" onClick={() => void loadTalentDetail(talent.blind_cv_code)}>
                                            Ver CV protegido
                                        </Button>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {selectedTalent && (
                            <section className="provi-card p-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="provi-chip w-fit">CV protegido</p>
                                        <h3 className="text-provi-dark mt-3 text-2xl font-black">{selectedTalent.blind_cv_code}</h3>
                                        <p className="text-provi-muted mt-3 max-w-3xl leading-7">{selectedTalent.summary}</p>
                                    </div>
                                    {selectedTalent.show_law_21015 && (
                                        <span
                                            className="bg-provi-purple/10 text-provi-purple rounded-full px-3 py-1 text-sm font-bold"
                                            title="La persona declara informacion vinculada a inclusion laboral."
                                        >
                                            Ley 21.015
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <InfoBlock title="Educacion" value={selectedTalent.education} />
                                    <InfoBlock title="Experiencia" value={selectedTalent.work_experience} />
                                    <InfoBlock title="Habilidades tecnicas" value={selectedTalent.technical_skills} />
                                    <InfoBlock title="Condiciones deseadas" value={selectedTalent.desired_conditions} />
                                </div>

                                <form className="bg-provi-primary/10 mt-6 rounded-[1.75rem] p-5" onSubmit={requestContact}>
                                    <h4 className="text-provi-dark text-lg font-black">Solicitar contacto intermediado</h4>
                                    <p className="text-provi-muted mt-1 text-sm">
                                        La empresa no recibe datos personales directos. El Departamento de Empleo revisa y gestiona el contacto.
                                    </p>
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="position_offered">Cargo ofrecido</Label>
                                            <Input
                                                id="position_offered"
                                                value={requestForm.position_offered}
                                                onChange={(event) => {
                                                    setRequestForm((current) => ({ ...current, position_offered: event.target.value }));
                                                    setRequestFormErrors((current) => ({ ...current, position_offered: '' }));
                                                }}
                                                required
                                                minLength={3}
                                                maxLength={80}
                                            />
                                            <InputError message={requestFormErrors.position_offered} />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="request_message">Mensaje al Departamento de Empleo</Label>
                                            <Textarea
                                                id="request_message"
                                                value={requestForm.message}
                                                onChange={(event) => {
                                                    setRequestForm((current) => ({ ...current, message: event.target.value }));
                                                    setRequestFormErrors((current) => ({ ...current, message: '' }));
                                                }}
                                                required
                                                minLength={20}
                                                maxLength={1200}
                                            />
                                            <InputError message={requestFormErrors.message} />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-provi-secondary hover:bg-provi-secondary/90 mt-4 font-bold"
                                        disabled={requesting || company?.status !== 'active' || !contactFormReady}
                                    >
                                        {requesting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Solicitar contacto
                                    </Button>
                                    {company?.status !== 'active' && (
                                        <p className="text-provi-muted mt-2 text-sm">
                                            Tu empresa debe estar en estado Activa para solicitar contacto. Actual estado:{' '}
                                            {company?.status ?? 'pendiente'}.
                                        </p>
                                    )}
                                    {company?.status === 'active' && !contactFormReady && (
                                        <p className="text-provi-muted mt-2 text-sm">
                                            Completa correctamente cargo ofrecido y mensaje para habilitar el envio.
                                        </p>
                                    )}
                                </form>
                            </section>
                        )}
                    </main>
                </div>
            ) : null}
        </RoleLayout>
    );
}

function InfoBlock({ title, value }: { title: string; value: unknown }) {
    const structuredItems = asStructuredItems(value);
    const items = asList(value);

    return (
        <div className="bg-provi-light rounded-2xl p-4">
            <h4 className="text-provi-dark font-bold">{title}</h4>
            {items.length === 0 ? (
                <p className="text-provi-muted mt-2 text-sm">Sin informacion publicada.</p>
            ) : structuredItems.length > 0 ? (
                <div className="mt-3 grid gap-3">
                    {structuredItems.map((item, index) => {
                        const entries = Object.entries(item)
                            .map(([key, rawValue]) => ({ key, value: formatPrimitiveValue(rawValue) }))
                            .filter((entry) => entry.value);

                        if (entries.length === 0) {
                            return null;
                        }

                        return (
                            <div key={`${title}-${index}`} className="rounded-xl bg-white p-3 text-sm shadow-sm">
                                <div className="grid gap-1.5">
                                    {entries.map((entry) => (
                                        <p key={`${title}-${index}-${entry.key}`} className="text-provi-muted leading-5">
                                            <span className="text-provi-dark font-semibold">{toSpanishLabel(entry.key)}:</span> {entry.value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span key={item} className="text-provi-muted rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
