<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoEmpresasSeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['name' => 'Empresa Demo Providencia SpA', 'email' => 'contacto.empresa.demo@proviemplea.local', 'rut' => '76000000-1', 'industry' => 'Servicios', 'size' => 'mediana'],
            ['name' => 'Tecnologia Demo Limitada', 'email' => 'rrhh.tech.demo@proviemplea.local', 'rut' => '76000000-2', 'industry' => 'Tecnologia', 'size' => 'pequena'],
        ];

        foreach ($companies as $company) {
            $user = User::query()->updateOrCreate(
                ['email' => $company['email']],
                ['name' => $company['name'], 'password' => 'password123'],
            );
            $user->assignRole('empresa');

            $profile = CompanyProfile::query()->updateOrCreate(
                ['rut' => $company['rut']],
                [
                    'company_name' => $company['name'],
                    'status' => 'active',
                    'industry' => $company['industry'],
                    'size' => $company['size'],
                    'commune' => 'Providencia',
                    'contact_email' => $company['email'],
                    'validated_at' => now(),
                ],
            );

            $profile->users()->syncWithoutDetaching([
                $user->id => ['position' => 'Contacto RRHH', 'is_primary_contact' => true],
            ]);
        }
    }
}
