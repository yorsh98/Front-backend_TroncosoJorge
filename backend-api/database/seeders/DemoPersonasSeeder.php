<?php

namespace Database\Seeders;

use App\Models\PersonProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoPersonasSeeder extends Seeder
{
    public function run(): void
    {
        $people = [
            [
                'name' => 'Talento Demo Administrativo',
                'email' => 'talento.admin.demo@proviemplea.local',
                'code' => 'TAL-2026-0001',
                'summary' => 'Perfil administrativo con experiencia en atencion usuaria, gestion documental y coordinacion de agenda.',
                'position' => 'Asistente Administrativo',
                'years' => 4,
                'education' => ['level' => 'Tecnico nivel superior', 'institution' => 'Instituto Demo', 'career' => 'Administracion de Empresas', 'start_year' => 2019, 'end_year' => 2021, 'completed' => true],
                'experience' => ['position' => 'Asistente Administrativo', 'company_name' => 'Empresa Ficticia Servicios', 'start_date' => '2021-03-01', 'end_date' => '2025-01-31', 'description' => 'Gestion documental, soporte a clientes internos y seguimiento de solicitudes.'],
                'skills' => ['Excel', 'Atencion de publico', 'Gestion documental'],
                'language' => ['language' => 'Ingles', 'level' => 'Basico'],
                'desired' => ['desired_position' => 'Administrativo', 'work_modality' => 'presencial', 'work_schedule' => 'jornada completa', 'availability' => 'inmediata'],
            ],
            [
                'name' => 'Talento Demo Tecnologia',
                'email' => 'talento.tech.demo@proviemplea.local',
                'code' => 'TAL-2026-0002',
                'summary' => 'Perfil de soporte TI con conocimientos en mesa de ayuda, redes basicas y documentacion tecnica.',
                'position' => 'Soporte TI Junior',
                'years' => 2,
                'education' => ['level' => 'Tecnico nivel superior', 'institution' => 'Centro Formacion Demo', 'career' => 'Conectividad y Redes', 'start_year' => 2020, 'end_year' => 2022, 'completed' => true],
                'experience' => ['position' => 'Soporte Mesa de Ayuda', 'company_name' => 'Servicios TI Demo', 'start_date' => '2022-04-01', 'end_date' => null, 'description' => 'Soporte a usuarios, registro de tickets y configuracion basica de equipos.'],
                'skills' => ['Soporte tecnico', 'Windows', 'Redes basicas', 'Tickets'],
                'language' => ['language' => 'Ingles', 'level' => 'Intermedio'],
                'desired' => ['desired_position' => 'Soporte TI', 'work_modality' => 'hibrido', 'work_schedule' => 'jornada completa', 'availability' => '15 dias'],
            ],
        ];

        foreach ($people as $person) {
            $user = User::query()->updateOrCreate(
                ['email' => $person['email']],
                ['name' => $person['name'], 'password' => 'password123'],
            );
            $user->assignRole('persona');

            $profile = PersonProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'talent_code' => $person['code'],
                    'status' => 'visible',
                    'summary' => $person['summary'],
                    'current_position' => $person['position'],
                    'years_experience' => $person['years'],
                    'is_visible' => true,
                    'validated_at' => now(),
                ],
            );

            $profile->contactData()->updateOrCreate([], [
                'commune' => 'Providencia',
                'alternate_email' => $person['email'],
            ]);

            $profile->educations()->updateOrCreate(['career' => $person['education']['career']], $person['education']);
            $profile->workExperiences()->updateOrCreate(['position' => $person['experience']['position']], $person['experience']);

            foreach ($person['skills'] as $skill) {
                $profile->skills()->updateOrCreate(['name' => $skill], ['type' => 'technical', 'level' => 'intermedio']);
            }

            $profile->languages()->updateOrCreate(['language' => $person['language']['language']], $person['language']);
            $profile->desiredConditions()->updateOrCreate([], $person['desired'] + ['preferred_communes' => ['Providencia', 'Santiago']]);
            $profile->disabilityProfile()->updateOrCreate([], ['has_disability' => false, 'law_21015_consent' => false]);
        }
    }
}
