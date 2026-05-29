import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';

const steps = [
    'Personas crean su perfil y cargan CV con consentimiento.',
    'La plataforma genera un CV ciego sin datos personales visibles.',
    'Empresas validadas buscan talentos y solicitan contacto intermediado.',
    'El Departamento de Empleo revisa, valida y acompana el proceso.',
];

const benefits = [
    { title: 'Privacidad primero', text: 'Las empresas ven experiencia, habilidades y disponibilidad, no datos de contacto directos.' },
    { title: 'Busqueda inversa', text: 'El talento local queda disponible para oportunidades sin depender solo de postulaciones manuales.' },
    { title: 'Gestion trazable', text: 'Administradores revisan perfiles, solicitudes, estados, notas internas y reportes.' },
];

export default function Welcome() {
    return (
        <PublicLayout>
            <Head title="ProviEmplea 2026" />
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e_0,#0f766e55_26%,transparent_48%)]" />
                <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
                    <div className="flex flex-col justify-center">
                        <p className="mb-4 w-fit rounded-full border border-teal-300/40 px-4 py-2 text-sm text-teal-100">
                            Municipalidad de Providencia · Departamento de Empleo
                        </p>
                        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Talento local visible, datos personales protegidos.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                            ProviEmplea 2026 moderniza la intermediacion laboral municipal con perfiles laborales, CV ciego, empresas validadas y
                            solicitudes de contacto gestionadas por el equipo de empleo.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/register"
                                className="rounded-full bg-teal-400 px-6 py-3 text-center font-bold text-slate-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-300"
                            >
                                Crear cuenta
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-full border border-white/30 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10"
                            >
                                Ingresar
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                        <div className="rounded-[1.5rem] bg-white p-6 text-slate-950">
                            <p className="text-sm font-bold tracking-[0.25em] text-teal-700 uppercase">CV ciego demo</p>
                            <h2 className="mt-4 text-2xl font-black">Talento PROV-2026-014</h2>
                            <div className="mt-6 grid gap-3 text-sm">
                                <span className="rounded-xl bg-slate-100 p-3">Area: Administracion y atencion ciudadana</span>
                                <span className="rounded-xl bg-slate-100 p-3">Experiencia: 4 anos en soporte administrativo</span>
                                <span className="rounded-xl bg-slate-100 p-3">Habilidades: Excel, agenda, atencion de publico</span>
                                <span className="rounded-xl bg-teal-50 p-3 text-teal-900">
                                    Contacto personal: protegido por intermediacion municipal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid gap-4 md:grid-cols-3">
                    {benefits.map((benefit) => (
                        <article key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-black text-slate-950">{benefit.title}</h2>
                            <p className="mt-3 leading-7 text-slate-600">{benefit.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-teal-50">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <p className="text-sm font-bold tracking-[0.25em] text-teal-700 uppercase">Flujo de uso</p>
                    <h2 className="mt-3 text-3xl font-black text-slate-950">Del perfil laboral a una solicitud intermediada</h2>
                    <div className="mt-8 grid gap-4 md:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step} className="rounded-3xl bg-white p-5 shadow-sm">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
                                    {index + 1}
                                </span>
                                <p className="mt-4 leading-7 text-slate-700">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-[2rem] bg-slate-950 p-8 text-white lg:p-10">
                    <h2 className="text-3xl font-black">Accesible, documentado y listo para evaluacion</h2>
                    <p className="mt-4 max-w-3xl leading-8 text-slate-200">
                        La entrega separa backend dockerizado y frontend local, consume API versionada con Bearer Token y mantiene el modo de analisis
                        regex activo por defecto para facilitar la revision docente.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
