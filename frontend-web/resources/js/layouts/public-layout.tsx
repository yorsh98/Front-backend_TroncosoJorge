import AccessibilityWidget from '@/components/accessibility-widget';
import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
            >
                Saltar al contenido
            </a>
            <header className="border-b border-slate-200 bg-white">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Navegacion publica">
                    <Link href="/" className="text-lg font-bold text-teal-700">
                        ProviEmplea 2026
                    </Link>
                    <div className="flex flex-wrap justify-end gap-3 text-sm font-medium">
                        <Link href="/persona" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Persona
                        </Link>
                        <Link href="/empresa" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Empresa
                        </Link>
                        <Link href="/admin" className="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">
                            Admin
                        </Link>
                        <Link href="/login" className="rounded-full border border-teal-700 px-4 py-2 text-teal-700">
                            Ingresar
                        </Link>
                        <Link href="/register" className="rounded-full bg-teal-700 px-4 py-2 text-white">
                            Registrarse
                        </Link>
                    </div>
                </nav>
            </header>
            <main id="contenido">{children}</main>
            <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-600">
                Plataforma academica demo. Logos oficiales deben ser provistos por la Municipalidad en produccion.
            </footer>
            <AccessibilityWidget />
        </div>
    );
}
