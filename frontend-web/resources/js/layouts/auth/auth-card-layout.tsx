import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}) {
    return (
        <div className="provi-shell flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-provi-primary text-white shadow-xl shadow-provi-primary/25">
                        <AppLogoIcon className="size-8 fill-current text-white" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="provi-card overflow-hidden border-0">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-2xl font-black text-provi-dark">{title}</CardTitle>
                            <CardDescription className="text-provi-muted">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
