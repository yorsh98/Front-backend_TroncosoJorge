import AccessibilityWidget from '@/components/accessibility-widget';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type RoleLayoutProps = PropsWithChildren<{ role: 'persona' | 'empresa' | 'admin' | 'superadmin'; title: string }>;

export default function RoleLayout({ children, role, title }: RoleLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
            >
                Saltar al contenido
            </a>
            <header className="border-b bg-white px-6 py-4">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-xs tracking-[0.25em] text-teal-700 uppercase">{role}</p>
                        <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
                    </div>
                    <nav className="flex flex-wrap gap-2 text-sm font-medium" aria-label="Navegacion por roles">
                        <Link href="/" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Inicio
                        </Link>
                        <Link href="/persona" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Persona
                        </Link>
                        <Link href="/empresa" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Empresa
                        </Link>
                        <Link href="/admin" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Admin
                        </Link>
                        <span className="rounded-full bg-teal-50 px-3 py-2 text-teal-800">API Bearer Token</span>
                    </nav>
                </div>
            </header>
            <main id="contenido" className="mx-auto max-w-7xl px-6 py-8">
                {children}
            </main>
            <AccessibilityWidget />
        </div>
    );
}
