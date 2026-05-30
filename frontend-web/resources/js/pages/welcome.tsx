import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Building2, FileText, LockKeyhole, Search, Sparkles, UserRound } from 'lucide-react';

const steps = [
    'Personas crean su perfil y cargan CV con consentimiento.',
    'La plataforma genera un CV ciego sin datos personales visibles.',
    'Empresas validadas buscan talentos y solicitan contacto intermediado.',
    'El Departamento de Empleo revisa, valida y acompana el proceso.',
];

const benefits = [
    { icon: LockKeyhole, title: 'Privacidad primero', text: 'Las empresas ven experiencia, habilidades y disponibilidad, no datos de contacto directos.' },
    { icon: Search, title: 'Busqueda inversa', text: 'El talento local queda disponible para oportunidades sin depender solo de postulaciones manuales.' },
    { icon: BadgeCheck, title: 'Gestion trazable', text: 'Administradores revisan perfiles, solicitudes, estados, notas internas y reportes.' },
];

const quickAccess = [
    {
        href: '/persona',
        icon: UserRound,
        title: 'Soy persona',
        text: 'Completar perfil, cargar CV y solicitar validacion.',
        color: 'bg-provi-primary',
        image: '/scraping/menu/img_menu_vive.jpg',
    },
    {
        href: '/empresa',
        icon: Building2,
        title: 'Soy empresa',
        text: 'Buscar talentos publicados y solicitar contacto.',
        color: 'bg-provi-purple',
        image: '/scraping/menu/img_menu_explora.jpg',
    },
    {
        href: '/admin',
        icon: FileText,
        title: 'Gestion municipal',
        text: 'Validar perfiles, empresas, solicitudes y reportes.',
        color: 'bg-provi-orange',
        image: '/scraping/menu/img_menu_muni.jpg',
    },
];

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="ProviEmplea 2026" />
            <section className="relative overflow-hidden bg-provi-dark text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(32,199,189,0.42)_0,transparent_32%),radial-gradient(circle_at_88%_16%,rgba(99,48,212,0.38)_0,transparent_28%),linear-gradient(135deg,rgba(47,159,179,0.18),transparent_50%)]" />
                <div className="absolute right-8 bottom-8 hidden h-28 w-28 rounded-full bg-provi-yellow/90 blur-3xl lg:block" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
                    <div className="flex flex-col justify-center">
                        <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-provi-primary backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            Municipalidad de Providencia · Departamento de Empleo
                        </p>
                        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Talento local visible, datos personales protegidos.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                            ProviEmplea 2026 moderniza la intermediacion laboral municipal con perfiles laborales, CV ciego, empresas validadas y
                            solicitudes de contacto gestionadas por el equipo de empleo.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="provi-focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-provi-yellow px-6 py-3 text-center font-black text-provi-dark shadow-xl shadow-black/20 transition hover:-translate-y-0.5"
                            >
                                Crear cuenta <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="provi-focus-ring rounded-full border border-white/30 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10"
                            >
                                Ingresar
                            </Link>
                        </div>
                        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-center">
                            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                                <p className="text-2xl font-black text-provi-primary">CV</p>
                                <p className="mt-1 text-xs text-slate-300">ciego</p>
                            </div>
                            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                                <p className="text-2xl font-black text-provi-yellow">Red</p>
                                <p className="mt-1 text-xs text-slate-300">empresas</p>
                            </div>
                            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                                <p className="text-2xl font-black text-provi-green">IA</p>
                                <p className="mt-1 text-xs text-slate-300">regex</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl lg:p-6">
                        <div className="rounded-[2rem] bg-white p-6 text-provi-dark shadow-2xl">
                            <p className="provi-chip w-fit">CV ciego municipal</p>
                            <h2 className="mt-4 text-3xl font-black">Talento PROV-2026-014</h2>
                            <img
                                src="/scraping/fotos/Palacio_Falabella.jpg"
                                alt="Providencia referencia visual"
                                className="mt-5 h-40 w-full rounded-2xl object-cover"
                            />
                            <div className="mt-6 grid gap-3 text-sm">
                                <span className="rounded-2xl bg-provi-light p-4">Area: Administracion y atencion ciudadana</span>
                                <span className="rounded-2xl bg-provi-light p-4">Experiencia: 4 anos en soporte administrativo</span>
                                <span className="rounded-2xl bg-provi-light p-4">Habilidades: Excel, agenda, atencion de publico</span>
                                <span className="rounded-2xl bg-provi-primary/10 p-4 font-bold text-provi-secondary">
                                    Contacto personal: protegido por intermediacion municipal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 lg:-mt-10 lg:py-14">
                <div className="grid gap-4 md:grid-cols-3">
                    {quickAccess.map((item) => (
                        <Link key={item.title} href={item.href} className="provi-card group block overflow-hidden p-0 transition hover:-translate-y-1">
                            <div className="h-28 w-full overflow-hidden">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                            </div>
                            <div className="p-6">
                            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} text-white shadow-lg`}>
                                <item.icon className="h-6 w-6" />
                            </span>
                            <h2 className="mt-5 text-xl font-black text-provi-dark">{item.title}</h2>
                            <p className="mt-2 leading-7 text-provi-muted">{item.text}</p>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-provi-secondary">
                                Acceder <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-4 md:grid-cols-3">
                    {benefits.map((benefit) => (
                        <article key={benefit.title} className="provi-card p-6">
                            <benefit.icon className="h-8 w-8 text-provi-primary" />
                            <h2 className="mt-4 text-xl font-black text-provi-dark">{benefit.title}</h2>
                            <p className="mt-3 leading-7 text-provi-muted">{benefit.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <p className="provi-chip w-fit">Flujo de uso</p>
                    <h2 className="mt-4 max-w-3xl text-3xl font-black text-provi-dark lg:text-5xl">Del perfil laboral a una solicitud intermediada</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step} className="rounded-[1.75rem] border border-slate-100 bg-provi-light p-5">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-provi-secondary font-black text-white shadow-lg shadow-provi-secondary/20">
                                    {index + 1}
                                </span>
                                <p className="mt-4 leading-7 text-provi-muted">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-provi-dark p-8 text-white shadow-2xl lg:p-12">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-provi-primary/30 blur-3xl" />
                    <h2 className="relative text-3xl font-black lg:text-5xl">Accesible, confiable y centrado en las personas</h2>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-200">
                        ProviEmplea fortalece la intermediacion laboral local con procesos claros, acompanamiento institucional y resguardo de datos
                        personales durante todo el ciclo de vinculacion laboral.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
