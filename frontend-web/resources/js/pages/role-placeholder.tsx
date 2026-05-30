import RoleLayout from '@/layouts/role-layout';
import { userStorage } from '@/services/apiClient';
import type { AuthUser } from '@/services/authService';
import { Head, Link } from '@inertiajs/react';

type RolePlaceholderProps = {
    role: 'persona' | 'empresa' | 'admin' | 'superadmin';
    title: string;
};

export default function RolePlaceholder({ role, title }: RolePlaceholderProps) {
    const user = userStorage.get<AuthUser>();

    return (
        <RoleLayout role={role} title={title}>
            <Head title={title} />
            <section className="rounded-3xl border border-teal-100 bg-white p-8 shadow-sm">
                <p className="text-sm font-bold tracking-[0.25em] text-teal-700 uppercase">Municipalidad de Providencia</p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">Portal institucional</h2>
                <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                    Este espacio reune accesos y funcionalidades para la gestion coordinada entre personas, empresas y administracion del
                    Departamento de Empleo.
                </p>
                {user && (
                    <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
                        <p>
                            <strong>Usuario:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Roles:</strong> {user.roles.join(', ')}
                        </p>
                    </div>
                )}
                <Link href="/" className="mt-6 inline-flex rounded-full bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800">
                    Volver a la landing
                </Link>
            </section>
        </RoleLayout>
    );
}
