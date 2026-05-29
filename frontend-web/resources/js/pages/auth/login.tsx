import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { apiErrorMessage } from '@/services/apiClient';
import { authService } from '@/services/authService';
import { Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const routeByRole = (roles: string[]) => {
    if (roles.includes('superadmin') || roles.includes('admin_empleo')) return '/admin';
    if (roles.includes('empresa')) return '/empresa';
    return '/persona';
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            const response = await authService.login(email, password);
            window.location.href = routeByRole(response.user.roles);
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible iniciar sesion con la API backend.'));
        } finally {
            setProcessing(false);
            setPassword('');
        }
    };

    return (
        <AuthLayout title="Ingresar a ProviEmplea" description="Usa las credenciales creadas en el backend API">
            <Head title="Ingresar" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
                    Autenticacion conectada a `POST /api/v1/auth/login` mediante Bearer Token Sanctum.
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electronico</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@proviemplea.local"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contrasena</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password"
                        />
                    </div>

                    <InputError message={error} />

                    <Button type="submit" className="mt-2 w-full bg-teal-700 hover:bg-teal-800" tabIndex={3} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Ingresar con API
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    No tienes cuenta?{' '}
                    <TextLink href="/register" tabIndex={4}>
                        Crear registro persona o empresa
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
