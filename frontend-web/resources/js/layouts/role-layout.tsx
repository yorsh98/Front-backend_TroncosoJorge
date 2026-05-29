import AccessibilityWidget from '@/components/accessibility-widget';
import { Link } from '@inertiajs/react';
import { BriefcaseBusiness, Home, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';

type RoleLayoutProps = PropsWithChildren<{ role: 'persona' | 'empresa' | 'admin' | 'superadmin'; title: string }>;

export default function RoleLayout({ children, role, title }: RoleLayoutProps) {
    return (
        <div className="provi-shell min-h-screen">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-provi-secondary focus:px-4 focus:py-2 focus:text-white"
            >
                Saltar al contenido
            </a>
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl sm:px-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-provi-primary text-white shadow-lg shadow-provi-primary/25">
                            <BriefcaseBusiness className="h-6 w-6" />
                        </span>
                        <div>
                            <p className="text-xs font-extrabold tracking-[0.25em] text-provi-secondary uppercase">{role}</p>
                            <h1 className="text-xl font-black text-provi-dark">{title}</h1>
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-2 text-sm font-bold" aria-label="Navegacion por roles">
                        <Link href="/" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            <Home className="h-4 w-4 text-provi-primary" />
                            Inicio
                        </Link>
                        <Link href="/persona" className="provi-focus-ring rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            Persona
                        </Link>
                        <Link href="/empresa" className="provi-focus-ring rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            Empresa
                        </Link>
                        <Link href="/admin" className="provi-focus-ring rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            Admin
                        </Link>
                        <span className="inline-flex items-center gap-2 rounded-full bg-provi-green/10 px-3 py-2 text-provi-green">
                            <ShieldCheck className="h-4 w-4" /> API Bearer Token
                        </span>
                    </nav>
                </div>
            </header>
            <main id="contenido" className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:py-10">
                {children}
            </main>
            <AccessibilityWidget />
        </div>
    );
}
