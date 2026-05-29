import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleLayout from '@/layouts/role-layout';
import { adminService } from '@/services/adminService';
import { apiErrorMessage, tokenStorage, userStorage } from '@/services/apiClient';
import { authService, type AuthUser } from '@/services/authService';
import { settingsService } from '@/services/settingsService';
import { Head } from '@inertiajs/react';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

type ApiData<T> = { data: T; message?: string };
type Page<T> = { data: T[]; total?: number };
type Metrics = Record<string, number>;

type Person = {
    id: number;
    talent_code?: string;
    status?: string;
    current_position?: string | null;
    is_visible?: boolean;
    user?: { name?: string; email?: string };
};
type Company = {
    id: number;
    company_name?: string;
    status?: string;
    industry?: string | null;
    commune?: string | null;
    users?: Array<{ name?: string; email?: string }>;
};
type ContactRequest = {
    id: number;
    status?: string;
    position_offered?: string | null;
    company_profile?: { company_name?: string };
    blind_cv_profile?: { blind_cv_code?: string; summary?: string | null };
};
type AiSettings = {
    cv_analysis_mode: string;
    ai_provider: string;
    ai_failover_to_regex: boolean;
    ollama_base_url?: string;
    ollama_model?: string;
    openai_model?: string;
};

const personStatuses = ['draft', 'pending_validation', 'validated', 'rejected', 'visible', 'hidden'];
const companyStatuses = ['pending_validation', 'active', 'rejected', 'suspended'];
const requestStatuses = ['requested', 'under_review', 'approved', 'rejected', 'contacted', 'interview', 'selected', 'not_selected', 'closed'];

export default function AdminDashboard() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [metrics, setMetrics] = useState<Metrics>({});
    const [reports, setReports] = useState<Metrics>({});
    const [persons, setPersons] = useState<Person[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [requests, setRequests] = useState<ContactRequest[]>([]);
    const [aiSettings, setAiSettings] = useState<AiSettings | null>(null);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [statusNote, setStatusNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadAdminData = async () => {
        setLoading(true);
        setError('');

        try {
            const [dashboardResponse, personsResponse, companiesResponse, requestsResponse, reportsResponse, aiResponse] = await Promise.all([
                adminService.dashboard() as Promise<ApiData<Metrics>>,
                adminService.personas() as Promise<ApiData<Page<Person>>>,
                adminService.empresas() as Promise<ApiData<Page<Company>>>,
                adminService.contactRequests() as Promise<ApiData<Page<ContactRequest>>>,
                adminService.reportsSummary() as Promise<ApiData<Metrics>>,
                settingsService.ai() as Promise<ApiData<AiSettings>>,
            ]);

            setMetrics(dashboardResponse.data);
            setPersons(personsResponse.data.data ?? []);
            setCompanies(companiesResponse.data.data ?? []);
            setRequests(requestsResponse.data.data ?? []);
            setReports(reportsResponse.data);
            setAiSettings(aiResponse.data);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible cargar el panel admin.'));
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
        void loadAdminData();
    }, []);

    const updatePersonStatus = async (id: number, status: string) => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await adminService.updatePersonaStatus(id, { status, note: statusNote })) as { message?: string };
            setMessage(response.message ?? 'Estado de talento actualizado.');
            await loadAdminData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible actualizar el talento.'));
        } finally {
            setSaving(false);
        }
    };

    const updateCompanyStatus = async (id: number, status: string) => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await adminService.updateEmpresaStatus(id, { status, note: statusNote })) as { message?: string };
            setMessage(response.message ?? 'Estado de empresa actualizado.');
            await loadAdminData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible actualizar la empresa.'));
        } finally {
            setSaving(false);
        }
    };

    const updateRequestStatus = async (id: number, status: string) => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await adminService.updateContactRequestStatus(id, { status, note: statusNote })) as { message?: string };
            setMessage(response.message ?? 'Estado de solicitud actualizado.');
            await loadAdminData();
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible actualizar la solicitud.'));
        } finally {
            setSaving(false);
        }
    };

    const addNote: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!selectedRequestId || !note.trim()) return;

        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await adminService.addContactRequestNote(selectedRequestId, { note })) as { message?: string };
            setNote('');
            setMessage(response.message ?? 'Nota interna agregada.');
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible agregar la nota.'));
        } finally {
            setSaving(false);
        }
    };

    const saveAiSettings: FormEventHandler = async (event) => {
        event.preventDefault();
        if (!aiSettings) return;

        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await settingsService.updateAi(aiSettings)) as { message?: string; data?: AiSettings };
            setMessage(response.message ?? 'Configuracion IA actualizada.');
            if (response.data) setAiSettings(response.data);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible actualizar IA.'));
        } finally {
            setSaving(false);
        }
    };

    const testAi = async () => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            const response = (await settingsService.testAiConnection()) as { message?: string; status?: string };
            setMessage(`${response.status ?? 'ok'}: ${response.message ?? 'Prueba IA completada.'}`);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible probar IA.'));
        } finally {
            setSaving(false);
        }
    };

    const downloadExport = (type: 'talentos' | 'empresas' | 'solicitudes') => {
        const token = tokenStorage.get();
        window.open(`${adminService.exportUrl(type)}&token_hint=${token ? 'bearer-required' : 'missing'}`, '_blank');
    };

    const logout = async () => {
        await authService.logout();
        window.location.href = '/';
    };

    return (
        <RoleLayout role="admin" title="Panel Administracion">
            <Head title="Panel Admin" />

            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-teal-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-bold tracking-[0.25em] text-teal-700 uppercase">ProviEmplea 2026</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950">Gestion operacional</h2>
                    <p className="mt-2 text-slate-600">
                        {user ? `${user.name} · ${user.email} · ${user.roles.join(', ')}` : 'Sesion admin con Bearer Token'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => void loadAdminData()} disabled={loading}>
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
                <div className="rounded-3xl bg-white p-10 text-center text-slate-600">Cargando panel admin...</div>
            ) : (
                <div className="grid gap-6">
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {Object.entries(metrics).map(([key, value]) => (
                            <MetricCard key={key} label={key} value={value} />
                        ))}
                    </section>

                    <section className="grid gap-6 xl:grid-cols-3">
                        <AdminCard title="Talentos">
                            <div className="mb-3 grid gap-2">
                                <Label htmlFor="status_note">Nota auditoria</Label>
                                <Input
                                    id="status_note"
                                    value={statusNote}
                                    onChange={(event) => setStatusNote(event.target.value)}
                                    placeholder="Motivo del cambio de estado"
                                />
                            </div>
                            <div className="grid gap-3">
                                {persons.map((person) => (
                                    <EntityRow
                                        key={person.id}
                                        title={person.user?.name ?? person.talent_code ?? `Talento #${person.id}`}
                                        subtitle={`${person.user?.email ?? ''} · ${person.current_position ?? 'Sin cargo'} · ${person.status}`}
                                    >
                                        <select
                                            className="rounded-md border px-2 py-2 text-sm"
                                            defaultValue={person.status}
                                            disabled={saving}
                                            onChange={(event) => void updatePersonStatus(person.id, event.target.value)}
                                        >
                                            {personStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </EntityRow>
                                ))}
                            </div>
                        </AdminCard>

                        <AdminCard title="Empresas">
                            <div className="grid gap-3">
                                {companies.map((company) => (
                                    <EntityRow
                                        key={company.id}
                                        title={company.company_name ?? `Empresa #${company.id}`}
                                        subtitle={`${company.industry ?? 'Sin rubro'} · ${company.commune ?? 'Sin comuna'} · ${company.status}`}
                                    >
                                        <select
                                            className="rounded-md border px-2 py-2 text-sm"
                                            defaultValue={company.status}
                                            disabled={saving}
                                            onChange={(event) => void updateCompanyStatus(company.id, event.target.value)}
                                        >
                                            {companyStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </EntityRow>
                                ))}
                            </div>
                        </AdminCard>

                        <AdminCard title="Solicitudes">
                            <div className="grid gap-3">
                                {requests.map((request) => (
                                    <EntityRow
                                        key={request.id}
                                        title={request.company_profile?.company_name ?? `Solicitud #${request.id}`}
                                        subtitle={`${request.blind_cv_profile?.blind_cv_code ?? 'CV ciego'} · ${request.position_offered ?? 'Sin cargo'} · ${request.status}`}
                                    >
                                        <select
                                            className="rounded-md border px-2 py-2 text-sm"
                                            defaultValue={request.status}
                                            disabled={saving}
                                            onChange={(event) => void updateRequestStatus(request.id, event.target.value)}
                                        >
                                            {requestStatuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        <Button size="sm" variant="outline" onClick={() => setSelectedRequestId(request.id)}>
                                            Nota
                                        </Button>
                                    </EntityRow>
                                ))}
                            </div>
                        </AdminCard>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <AdminCard title="Notas internas">
                            <form className="grid gap-4" onSubmit={addNote}>
                                <div className="grid gap-2">
                                    <Label htmlFor="request_id">Solicitud seleccionada</Label>
                                    <Input
                                        id="request_id"
                                        value={selectedRequestId ?? ''}
                                        onChange={(event) => setSelectedRequestId(event.target.value ? Number(event.target.value) : null)}
                                        placeholder="ID solicitud"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="note">Nota interna</Label>
                                    <textarea
                                        id="note"
                                        value={note}
                                        onChange={(event) => setNote(event.target.value)}
                                        className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-teal-700 hover:bg-teal-800"
                                    disabled={saving || !selectedRequestId || !note.trim()}
                                >
                                    {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Agregar nota
                                </Button>
                            </form>
                        </AdminCard>

                        <AdminCard title="Reportes y exportacion">
                            <div className="grid gap-3 md:grid-cols-3">
                                {Object.entries(reports).map(([key, value]) => (
                                    <MetricCard key={key} label={key} value={value} compact />
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                                Los CSV usan autenticacion Bearer en backend; para descarga real desde navegador se recomienda endpoint proxy o signed
                                URL. La API de exportacion queda documentada y probada en backend.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button variant="outline" onClick={() => downloadExport('talentos')}>
                                    CSV talentos
                                </Button>
                                <Button variant="outline" onClick={() => downloadExport('empresas')}>
                                    CSV empresas
                                </Button>
                                <Button variant="outline" onClick={() => downloadExport('solicitudes')}>
                                    CSV solicitudes
                                </Button>
                            </div>
                        </AdminCard>
                    </section>

                    {aiSettings && (
                        <AdminCard title="Configuracion IA">
                            <form className="grid gap-4 md:grid-cols-3" onSubmit={saveAiSettings}>
                                <div className="grid gap-2">
                                    <Label>Modo</Label>
                                    <select
                                        className="rounded-md border px-3 py-2 text-sm"
                                        value={aiSettings.cv_analysis_mode}
                                        onChange={(event) => setAiSettings({ ...aiSettings, cv_analysis_mode: event.target.value })}
                                    >
                                        {['regex', 'local', 'cloud', 'hybrid'].map((mode) => (
                                            <option key={mode} value={mode}>
                                                {mode}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Proveedor</Label>
                                    <select
                                        className="rounded-md border px-3 py-2 text-sm"
                                        value={aiSettings.ai_provider}
                                        onChange={(event) => setAiSettings({ ...aiSettings, ai_provider: event.target.value })}
                                    >
                                        {['none', 'ollama', 'openai'].map((provider) => (
                                            <option key={provider} value={provider}>
                                                {provider}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={aiSettings.ai_failover_to_regex}
                                        onChange={(event) => setAiSettings({ ...aiSettings, ai_failover_to_regex: event.target.checked })}
                                    />
                                    Fallback regex
                                </label>
                                <Input
                                    value={aiSettings.ollama_base_url ?? ''}
                                    onChange={(event) => setAiSettings({ ...aiSettings, ollama_base_url: event.target.value })}
                                    placeholder="Ollama base URL"
                                />
                                <Input
                                    value={aiSettings.ollama_model ?? ''}
                                    onChange={(event) => setAiSettings({ ...aiSettings, ollama_model: event.target.value })}
                                    placeholder="Modelo Ollama"
                                />
                                <Input
                                    value={aiSettings.openai_model ?? ''}
                                    onChange={(event) => setAiSettings({ ...aiSettings, openai_model: event.target.value })}
                                    placeholder="Modelo OpenAI"
                                />
                                <div className="flex gap-2 md:col-span-3">
                                    <Button type="submit" className="bg-teal-700 hover:bg-teal-800" disabled={saving}>
                                        Guardar IA
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => void testAi()} disabled={saving}>
                                        Probar conexion
                                    </Button>
                                </div>
                            </form>
                        </AdminCard>
                    )}
                </div>
            )}
        </RoleLayout>
    );
}

function MetricCard({ label, value, compact = false }: { label: string; value: number; compact?: boolean }) {
    return (
        <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${compact ? 'text-center' : ''}`}>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-500 uppercase">{label.replaceAll('_', ' ')}</p>
            <p className="mt-2 text-3xl font-black text-teal-700">{value}</p>
        </div>
    );
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-2xl font-black text-slate-950">{title}</h3>
            {children}
        </section>
    );
}

function EntityRow({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold text-slate-950">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">{children}</div>
        </div>
    );
}
