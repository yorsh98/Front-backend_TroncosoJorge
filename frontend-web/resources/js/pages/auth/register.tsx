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

type AccountType = 'persona' | 'empresa';

export default function Register() {
    const [accountType, setAccountType] = useState<AccountType>('persona');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        const payload = { name, email, password, password_confirmation: passwordConfirmation };

        try {
            if (accountType === 'persona') {
                await authService.registerPersona(payload);
                window.location.href = '/persona';
                return;
            }

            await authService.registerEmpresa(payload);
            window.location.href = '/empresa';
        } catch (caught) {
            setError(apiErrorMessage(caught, 'No fue posible completar el registro.'));
        } finally {
            setProcessing(false);
            setPassword('');
            setPasswordConfirmation('');
        }
    };

    return (
        <AuthLayout title="Crear cuenta ProviEmplea" description="Elige si registras una persona o una empresa">
            <Head title="Registro" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-provi-light p-1">
                    <button
                        type="button"
                        onClick={() => setAccountType('persona')}
                        className={`rounded-xl px-4 py-3 text-sm font-bold ${accountType === 'persona' ? 'bg-white text-provi-secondary shadow-sm' : 'text-provi-muted'}`}
                    >
                        Persona
                    </button>
                    <button
                        type="button"
                        onClick={() => setAccountType('empresa')}
                        className={`rounded-xl px-4 py-3 text-sm font-bold ${accountType === 'empresa' ? 'bg-white text-provi-secondary shadow-sm' : 'text-provi-muted'}`}
                    >
                        Empresa
                    </button>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{accountType === 'persona' ? 'Nombre completo' : 'Nombre de contacto'}</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={processing}
                            placeholder={accountType === 'persona' ? 'Persona Demo' : 'Contacto Empresa Demo'}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electronico</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={processing}
                            placeholder="correo@ejemplo.cl"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contrasena</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={processing}
                            placeholder="Minimo 8 caracteres"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar contrasena</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            disabled={processing}
                            placeholder="Repite la contrasena"
                        />
                    </div>

                    <InputError message={error} />

                    <Button type="submit" className="mt-2 w-full bg-provi-purple font-bold hover:bg-provi-purple/90" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Crear cuenta {accountType}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Ya tienes cuenta?{' '}
                    <TextLink href="/login" tabIndex={6}>
                        Ingresar
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
