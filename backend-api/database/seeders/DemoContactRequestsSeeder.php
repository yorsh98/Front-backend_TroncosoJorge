<?php

namespace Database\Seeders;

use App\Models\BlindCvProfile;
use App\Models\CompanyProfile;
use App\Models\ContactRequest;
use Illuminate\Database\Seeder;

class DemoContactRequestsSeeder extends Seeder
{
    public function run(): void
    {
        $company = CompanyProfile::query()->where('status', 'active')->first();
        $blindCv = BlindCvProfile::query()->where('status', 'published')->first();
        $requester = $company?->users()->first();

        if (! $company || ! $blindCv || ! $requester) {
            return;
        }

        $request = ContactRequest::query()->firstOrCreate(
            [
                'company_profile_id' => $company->id,
                'blind_cv_profile_id' => $blindCv->id,
                'requested_by' => $requester->id,
            ],
            [
                'status' => 'requested',
                'position_offered' => 'Asistente administrativo',
                'message' => 'Solicitud demo para revisar disponibilidad del talento mediante intermediacion municipal.',
                'requested_at' => now(),
            ],
        );

        $request->statusHistories()->firstOrCreate(
            ['to_status' => 'requested'],
            ['from_status' => null, 'changed_by' => $requester->id, 'note' => 'Solicitud demo creada por seeder.'],
        );
    }
}
