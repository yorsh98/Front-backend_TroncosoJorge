<?php

namespace Database\Seeders;

use App\Models\PersonProfile;
use Illuminate\Database\Seeder;

class DemoTalentosSeeder extends Seeder
{
    public function run(): void
    {
        PersonProfile::query()->with(['educations', 'workExperiences', 'certifications', 'skills', 'languages', 'desiredConditions', 'disabilityProfile'])->get()->each(function (PersonProfile $profile): void {
            $profile->blindCvProfile()->updateOrCreate(
                ['blind_cv_code' => 'BCV-'.$profile->talent_code],
                [
                    'status' => $profile->is_visible ? 'published' : 'draft',
                    'summary' => $profile->summary,
                    'education' => $profile->educations->map(fn ($item) => $item->only(['level', 'institution', 'career', 'start_year', 'end_year', 'completed']))->values()->all(),
                    'work_experience' => $profile->workExperiences->map(fn ($item) => $item->only(['position', 'company_name', 'start_date', 'end_date', 'description']))->values()->all(),
                    'certifications' => $profile->certifications->map(fn ($item) => $item->only(['name', 'issuer', 'year']))->values()->all(),
                    'technical_skills' => $profile->skills->pluck('name')->values()->all(),
                    'languages' => $profile->languages->map(fn ($item) => $item->only(['language', 'level']))->values()->all(),
                    'desired_conditions' => $profile->desiredConditions?->only(['desired_position', 'work_modality', 'work_schedule', 'availability', 'preferred_communes']) ?? [],
                    'show_law_21015' => (bool) ($profile->disabilityProfile?->has_disability && $profile->disabilityProfile?->law_21015_consent),
                    'published_at' => $profile->is_visible ? now() : null,
                ],
            );
        });
    }
}
