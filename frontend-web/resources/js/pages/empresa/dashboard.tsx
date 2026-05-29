import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleLayout from '@/layouts/role-layout';
import { apiErrorMessage, tokenStorage, userStorage } from '@/services/apiClient';
import { authService, type AuthUser } from '@/services/authService';
import { companyService } from '@/services/companyService';
import { Head } from '@inertiajs/react';
import { LoaderCircle, RefreshCw, Search } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ApiData<T> = { data: T; message?: string };

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

const asList = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
    if (typeof value === 'object') return Object.values(value).map((item) => (typeof item === 'string' ? item : JSON.stringify(item)));
    return [String(value)];
};

export default function EmpresaDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [company, setCompany] = useState<CompanyProfile | null>(null);
    const [form, setForm] = useState(emptyCompany);
    const [talents, setTalents] = useState<BlindCv[]>([]);
    const [selectedTalent, setSelectedTalent] = useState<BlindCv | null>(null);
    const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
    const [filters, setFilters] = useState({ skill: '', modality: '', schedule: '', availability: '', disability: false });
    const [requestForm, setRequestForm] = useState({ position_offered: '', message: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searching, setSearching] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadCompanyData = async () => {
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
    };

    const searchTalents = async () => {
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

            const query = params.toString() ? `?${params.toString()}` : '';
            const response = (await companyService.talents(query)) as ApiData<PaginatedTalents>;
            setTalents(response.data.data ?? []);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar la vitrina de talentos.'));
        } finally {
            setSearching(false);
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
        void loadCompanyData();
        void searchTalents();
    }, []);

    const updateForm = (field: keyof typeof emptyCompany, value: string) => setForm((current) => ({ ...current, [field]: value }));
    const updateFilter = (field: keyof typeof filters, value: string | boolean) => setFilters((current) => ({ ...current, [field]: value }));

    const saveCompany: FormEventHandler = async (event) => {
        event.preventDefault();
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
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el CV ciego.'));
        }
    };

    const requestContact: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!selectedTalent) return;

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

    const logout = async () => {
        await authService.logout();
        window.location.href = '/';
    };

    return (
        <RoleLayout role="empresa" title="Panel Empresa">
            <Head title="Panel Empresa" />

            <div className="provi-card mb-6 flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="provi-chip w-fit">ProviEmplea 2026</p>
                    <h2 className="mt-3 text-3xl font-black text-provi-dark lg:text-4xl">Vitrina de talentos con CV ciego</h2>
                    <p className="mt-2 text-provi-muted">{user ? `${user.name} · ${user.email}` : 'Sesion empresa con Bearer Token'}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => void searchTalents()} disabled={searching}>
                        <RefreshCw className="h-4 w-4" /> Talentos
                    </Button>
                    <Button variant="outline" onClick={() => void logout()}>
                        Salir
                    </Button>
                </div>
            </div>

            {message && <div className="mb-4 rounded-2xl bg-provi-green/10 p-4 text-sm font-bold text-provi-green">{message}</div>}
            <InputError message={error} className="mb-4 rounded-2xl bg-red-50 p-4" />

            {!isAuthenticated && (
                <div className="provi-card mb-6 p-6">
                    <h3 className="text-2xl font-black text-provi-dark">Vista de demostracion</h3>
                    <p className="mt-2 text-provi-muted">Para cargar la informacion de empresa y usar la vitrina, inicia sesion con una cuenta Empresa.</p>
                    <div className="mt-4">
                        <Button onClick={() => (window.location.href = '/login')}>Ingresar</Button>
                    </div>
                </div>
            )}

            {isAuthenticated && loading ? (
                <div className="provi-card p-10 text-center text-provi-muted">Cargando informacion empresa...</div>
            ) : isAuthenticated ? (
                <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                    <aside className="grid gap-6">
                        <section className="provi-card p-6">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-black text-provi-dark">Perfil empresa</h3>
                                    <p className="text-sm text-provi-muted">Estado: {company?.status ?? 'pending_validation'}</p>
                                </div>
                                <span className="rounded-full bg-provi-primary/10 px-3 py-1 text-xs font-bold text-provi-secondary">
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
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="rut">RUT</Label>
                                        <Input id="rut" value={form.rut} onChange={(event) => updateForm('rut', event.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="industry">Rubro</Label>
                                        <Input id="industry" value={form.industry} onChange={(event) => updateForm('industry', event.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="size">Tamano</Label>
                                        <Input
                                            id="size"
                                            value={form.size}
                                            onChange={(event) => updateForm('size', event.target.value)}
                                            placeholder="Micro, pequena, mediana"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="commune">Comuna</Label>
                                        <Input id="commune" value={form.commune} onChange={(event) => updateForm('commune', event.target.value)} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="address">Direccion</Label>
                                        <Input id="address" value={form.address} onChange={(event) => updateForm('address', event.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_email">Email contacto</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={form.contact_email}
                                            onChange={(event) => updateForm('contact_email', event.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_phone">Telefono contacto</Label>
                                        <Input
                                            id="contact_phone"
                                            value={form.contact_phone}
                                            onChange={(event) => updateForm('contact_phone', event.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="bg-provi-secondary font-bold hover:bg-provi-secondary/90" disabled={saving}>
                                    {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Guardar empresa
                                </Button>
                            </form>
                        </section>

                        <section className="provi-card p-6">
                            <h3 className="text-xl font-black text-provi-dark">Solicitudes enviadas</h3>
                            <div className="mt-4 grid gap-3">
                                {contactRequests.length === 0 && <p className="text-sm text-provi-muted">Aun no hay solicitudes de contacto.</p>}
                                {contactRequests.map((request) => (
                                    <div key={request.id} className="rounded-2xl bg-provi-light p-4">
                                        <p className="font-bold text-provi-dark">
                                            {request.blind_cv_profile?.blind_cv_code ?? `Solicitud #${request.id}`}
                                        </p>
                                        <p className="text-sm text-provi-muted">Estado: {request.status}</p>
                                        {request.position_offered && <p className="mt-1 text-sm text-provi-muted">Cargo: {request.position_offered}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    <main className="grid gap-6">
                        <section className="provi-card p-6">
                            <h3 className="text-2xl font-black text-provi-dark">Buscar talentos</h3>
                            <form
                                className="mt-5 grid gap-4 lg:grid-cols-5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void searchTalents();
                                }}
                            >
                                <Input
                                    placeholder="Habilidad"
                                    value={filters.skill}
                                    onChange={(event) => updateFilter('skill', event.target.value)}
                                />
                                <Input
                                    placeholder="Modalidad"
                                    value={filters.modality}
                                    onChange={(event) => updateFilter('modality', event.target.value)}
                                />
                                <Input
                                    placeholder="Jornada"
                                    value={filters.schedule}
                                    onChange={(event) => updateFilter('schedule', event.target.value)}
                                />
                                <Input
                                    placeholder="Disponibilidad"
                                    value={filters.availability}
                                    onChange={(event) => updateFilter('availability', event.target.value)}
                                />
                                <Button type="submit" className="bg-provi-purple font-bold hover:bg-provi-purple/90" disabled={searching}>
                                    {searching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    Buscar
                                </Button>
                                <label className="flex items-center gap-2 text-sm text-provi-muted lg:col-span-5">
                                    <input
                                        type="checkbox"
                                        checked={filters.disability}
                                        onChange={(event) => updateFilter('disability', event.target.checked)}
                                    />
                                    Mostrar perfiles que declaran Ley 21.015 cuando corresponda
                                </label>
                            </form>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                {talents.length === 0 && (
                                    <p className="text-sm text-provi-muted md:col-span-2">No hay talentos publicados para los filtros actuales.</p>
                                )}
                                {talents.map((talent) => (
                                    <article key={talent.blind_cv_code} className="rounded-[1.75rem] border border-white bg-provi-light p-5 shadow-sm">
                                        <p className="text-xs font-bold tracking-[0.2em] text-provi-secondary uppercase">{talent.blind_cv_code}</p>
                                        <h4 className="mt-3 line-clamp-3 font-bold text-provi-dark">{talent.summary ?? 'Perfil laboral publicado'}</h4>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {asList(talent.technical_skills)
                                                .slice(0, 4)
                                                .map((skill) => (
                                                    <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-provi-muted shadow-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                        </div>
                                        <Button className="mt-4" variant="outline" onClick={() => void loadTalentDetail(talent.blind_cv_code)}>
                                            Ver CV ciego
                                        </Button>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {selectedTalent && (
                            <section className="provi-card p-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="provi-chip w-fit">CV ciego</p>
                                        <h3 className="mt-3 text-2xl font-black text-provi-dark">{selectedTalent.blind_cv_code}</h3>
                                        <p className="mt-3 max-w-3xl leading-7 text-provi-muted">{selectedTalent.summary}</p>
                                    </div>
                                    {selectedTalent.show_law_21015 && (
                                         <span className="rounded-full bg-provi-purple/10 px-3 py-1 text-sm font-bold text-provi-purple">Ley 21.015</span>
                                    )}
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <InfoBlock title="Educacion" value={selectedTalent.education} />
                                    <InfoBlock title="Experiencia" value={selectedTalent.work_experience} />
                                    <InfoBlock title="Habilidades tecnicas" value={selectedTalent.technical_skills} />
                                    <InfoBlock title="Condiciones deseadas" value={selectedTalent.desired_conditions} />
                                </div>

                                <form className="mt-6 rounded-[1.75rem] bg-provi-primary/10 p-5" onSubmit={requestContact}>
                                    <h4 className="text-lg font-black text-provi-dark">Solicitar contacto intermediado</h4>
                                    <p className="mt-1 text-sm text-provi-muted">
                                        La empresa no recibe datos personales directos. El Departamento de Empleo revisa y gestiona el contacto.
                                    </p>
                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="position_offered">Cargo ofrecido</Label>
                                            <Input
                                                id="position_offered"
                                                value={requestForm.position_offered}
                                                onChange={(event) =>
                                                    setRequestForm((current) => ({ ...current, position_offered: event.target.value }))
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="request_message">Mensaje al Departamento de Empleo</Label>
                                            <textarea
                                                id="request_message"
                                                value={requestForm.message}
                                                onChange={(event) => setRequestForm((current) => ({ ...current, message: event.target.value }))}
                                                className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="mt-4 bg-provi-secondary font-bold hover:bg-provi-secondary/90" disabled={requesting}>
                                        {requesting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Solicitar contacto
                                    </Button>
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
    const items = asList(value);

    return (
        <div className="rounded-2xl bg-provi-light p-4">
            <h4 className="font-bold text-provi-dark">{title}</h4>
            {items.length === 0 ? (
                <p className="mt-2 text-sm text-provi-muted">Sin informacion publicada.</p>
            ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-provi-muted shadow-sm">
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
