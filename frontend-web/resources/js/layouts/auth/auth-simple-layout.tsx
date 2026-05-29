import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <span className="rounded-2xl border border-black bg-black p-3 shadow-sm">
                                <img
                                    src="/scraping/logos/LOGO-129-anos.svg"
                                    alt="Logo 129 anos Municipalidad de Providencia"
                                    className="h-16 w-auto"
                                />
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            {description && <p className="text-muted-foreground text-center text-sm">{description}</p>}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
