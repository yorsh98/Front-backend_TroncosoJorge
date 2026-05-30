import AccessibilityWidget from '@/components/accessibility-widget';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { authService, type AuthUser } from '@/services/authService';
import { tokenStorage, userStorage } from '@/services/apiClient';
import { Link } from '@inertiajs/react';
import { Building2, Menu, ShieldCheck, UserRound } from 'lucide-react';
import { type PropsWithChildren, useEffect, useState } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
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
        <div className="provi-shell min-h-screen text-provi-dark">
            <a
                href="#contenido"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-provi-secondary focus:px-4 focus:py-2 focus:text-white"
            >
                Saltar al contenido
            </a>
            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl">
                <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between" aria-label="Navegacion publica">
                    <div className="flex items-center justify-between gap-3 lg:block">
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
                    <div className="hidden flex-wrap items-center gap-2 text-sm font-bold lg:flex">
                        <Link href="/persona" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark transition hover:bg-provi-light">
                            <UserRound className="h-4 w-4 text-provi-primary" />
                            Persona
                        </Link>
                        <Link href="/empresa" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark transition hover:bg-provi-light">
                            <Building2 className="h-4 w-4 text-provi-purple" />
                            Empresa
                        </Link>
                        <Link href="/admin" className="provi-focus-ring inline-flex items-center gap-2 rounded-full px-3 py-2 text-provi-dark transition hover:bg-provi-light">
                            <ShieldCheck className="h-4 w-4 text-provi-orange" />
                            Admin
                        </Link>
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
                    </div>
                </nav>
            </header>
            <main id="contenido">{children}</main>
            <footer className="border-t border-white/70 bg-provi-dark text-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
                    <div>
                        <p className="text-2xl font-black">ProviEmplea 2026</p>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                            Plataforma municipal de intermediacion laboral con enfoque en empleabilidad local, privacidad de datos y acompanamiento
                            institucional.
                        </p>
                        <img src="/scraping/logos/LOGO-129-anos.svg" alt="Logo aniversario Providencia" className="mt-4 h-14 w-auto object-contain opacity-90" />
                    </div>
                    <div>
                        <p className="font-bold text-provi-primary">Accesos</p>
                        <div className="mt-3 grid gap-2 text-sm text-slate-300">
                            <Link href="/persona" className="hover:text-white">Personas</Link>
                            <Link href="/empresa" className="hover:text-white">Empresas</Link>
                            <Link href="/admin" className="hover:text-white">Administracion</Link>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-provi-yellow">Institucional</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">Departamento de Empleo · Municipalidad de Providencia</p>
                    </div>
                </div>
            </footer>
            <AccessibilityWidget />
        </div>
    );
}
