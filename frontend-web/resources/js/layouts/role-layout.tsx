import AccessibilityWidget from '@/components/accessibility-widget';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { authService, type AuthUser } from '@/services/authService';
import { tokenStorage, userStorage } from '@/services/apiClient';
import { Link } from '@inertiajs/react';
import { Building2, Home, Menu, ShieldCheck, UserRound } from 'lucide-react';
import { type PropsWithChildren, useEffect, useState } from 'react';

type RoleLayoutProps = PropsWithChildren<{ role: 'persona' | 'empresa' | 'admin' | 'superadmin'; title: string }>;

export default function RoleLayout({ children, role, title }: RoleLayoutProps) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        if (!tokenStorage.get()) {
            setUser(null);
            return;
        }

        setUser(userStorage.get<AuthUser>());
    }, []);

    const panelHref = user?.roles.includes('superadmin') || user?.roles.includes('admin_empleo') ? '/admin' : user?.roles.includes('empresa') ? '/empresa' : '/persona';

    const logout = async () => {
        await authService.logout();
        setUser(null);
        window.location.href = '/';
    };

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
                        <div className="flex w-full items-center justify-between gap-3 lg:block">
                            <Link href="/" className="group flex items-center gap-3 rounded-2xl provi-focus-ring">
                                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-lg shadow-provi-primary/25 transition group-hover:rotate-3">
                                    <img src="/scraping/iconos/favicon.ico" alt="Icono Providencia" className="h-10 w-10 object-contain" />
                                </span>
                                <span>
                                    <span className="block text-lg font-black tracking-tight text-provi-dark">ProviEmplea 2026</span>
                                    <span className="block text-xs font-bold tracking-[0.16em] text-provi-muted uppercase">Municipalidad de Providencia</span>
                                </span>
                            </Link>
                            <Sheet>
                                <SheetTrigger className="provi-focus-ring inline-flex items-center justify-center rounded-xl border border-provi-secondary/30 p-2 text-provi-secondary lg:hidden">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Abrir menu</span>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[88%] max-w-sm">
                                    <div className="mt-8 grid gap-3 text-sm font-bold">
                                        <SheetClose asChild>
                                            <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                                                <Home className="h-4 w-4 text-provi-primary" />
                                                Inicio
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/persona" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                                                <UserRound className="h-4 w-4 text-provi-primary" />
                                                Persona
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/empresa" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                                                <Building2 className="h-4 w-4 text-provi-purple" />
                                                Empresa
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link href="/admin" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                                                <ShieldCheck className="h-4 w-4 text-provi-orange" />
                                                Admin
                                            </Link>
                                        </SheetClose>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-provi-green/10 px-3 py-2 text-provi-green">
                                            <ShieldCheck className="h-4 w-4" /> Acceso seguro
                                        </span>
                                        {user ? (
                                            <>
                                                <SheetClose asChild>
                                                    <Link href={panelHref} className="rounded-full border border-provi-secondary/30 px-4 py-2 text-center text-provi-secondary">
                                                        Mi panel
                                                    </Link>
                                                </SheetClose>
                                                <button
                                                    type="button"
                                                    onClick={() => void logout()}
                                                    className="rounded-full bg-provi-purple px-4 py-2 text-white shadow-lg shadow-provi-purple/20"
                                                >
                                                    Cerrar sesion
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <SheetClose asChild>
                                                    <Link href="/login" className="rounded-full border border-provi-secondary/30 px-4 py-2 text-center text-provi-secondary">
                                                        Ingresar
                                                    </Link>
                                                </SheetClose>
                                                <SheetClose asChild>
                                                    <Link href="/register" className="rounded-full bg-provi-purple px-4 py-2 text-center text-white shadow-lg shadow-provi-purple/20">
                                                        Registrarse
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <span className="rounded-full bg-provi-primary/10 px-3 py-1 text-xs font-extrabold tracking-[0.16em] text-provi-secondary uppercase">
                            {role}
                        </span>
                    </div>
                    <nav className="hidden flex-wrap gap-2 text-sm font-bold lg:flex" aria-label="Navegacion por roles">
                        <Link href="/" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            <Home className="h-4 w-4 text-provi-primary" />
                            Inicio
                        </Link>
                        <Link href="/persona" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            <UserRound className="h-4 w-4 text-provi-primary" />
                            Persona
                        </Link>
                        <Link href="/empresa" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            <Building2 className="h-4 w-4 text-provi-purple" />
                            Empresa
                        </Link>
                        <Link href="/admin" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark hover:bg-provi-light">
                            <ShieldCheck className="h-4 w-4 text-provi-orange" />
                            Admin
                        </Link>
                        <span className="inline-flex items-center gap-2 rounded-full bg-provi-green/10 px-3 py-2 text-provi-green">
                            <ShieldCheck className="h-4 w-4" /> Acceso seguro
                        </span>
                        {user ? (
                            <>
                                <Link
                                    href={panelHref}
                                    className="provi-focus-ring rounded-full border border-provi-secondary/30 px-4 py-2 text-provi-secondary transition hover:bg-provi-secondary/10"
                                >
                                    Mi panel
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => void logout()}
                                    className="provi-focus-ring rounded-full bg-provi-purple px-4 py-2 text-white shadow-lg shadow-provi-purple/20 transition hover:-translate-y-0.5 hover:bg-provi-purple/90"
                                >
                                    Cerrar sesion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="provi-focus-ring rounded-full border border-provi-secondary/30 px-4 py-2 text-provi-secondary transition hover:bg-provi-secondary/10"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    href="/register"
                                    className="provi-focus-ring rounded-full bg-provi-purple px-4 py-2 text-white shadow-lg shadow-provi-purple/20 transition hover:-translate-y-0.5 hover:bg-provi-purple/90"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main id="contenido" className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:py-10">
                <h1 className="mb-6 text-2xl font-black text-provi-dark sm:text-3xl">{title}</h1>
                {children}
            </main>
            <AccessibilityWidget />
        </div>
    );
}
