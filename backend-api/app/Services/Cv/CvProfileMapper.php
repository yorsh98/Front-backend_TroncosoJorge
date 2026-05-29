<?php

namespace App\Services\Cv;

use App\Models\CvAnalysisResult;
use App\Models\PersonProfile;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CvProfileMapper
{
    public function __construct(private readonly BlindCvBuilder $blindCvBuilder)
    {
    }

    public function apply(CvAnalysisResult $analysis): PersonProfile
    {
        $analysis->load('cvUpload.personProfile');
        $profile = $analysis->cvUpload->personProfile;
        $result = $analysis->result_json;

        $profile->update([
            'summary' => $result['resumen_laboral'] ?: $profile->summary,
            'current_position' => $this->firstPosition($result) ?: $profile->current_position,
        ]);

        foreach (array_slice($result['educacion'] ?? [], 0, 8) as $item) {
            $text = is_array($item) ? implode(' ', Arr::flatten($item)) : (string) $item;
            if ($text !== '') {
                $profile->educations()->firstOrCreate(['career' => Str::limit($text, 240, '')], ['level' => 'No especificado', 'completed' => false]);
            }
        }

        foreach (array_slice($result['experiencia_laboral'] ?? [], 0, 8) as $item) {
            $text = is_array($item) ? implode(' ', Arr::flatten($item)) : (string) $item;
            if ($text !== '') {
                $profile->workExperiences()->firstOrCreate(['position' => Str::limit($text, 240, '')], ['description' => $text]);
            }
        }

        foreach (array_slice($result['certificaciones'] ?? [], 0, 8) as $item) {
            $text = is_array($item) ? implode(' ', Arr::flatten($item)) : (string) $item;
            if ($text !== '') {
                $profile->certifications()->firstOrCreate(['name' => Str::limit($text, 240, '')]);
            }
        }

        foreach (array_slice($result['competencias_tecnicas'] ?? [], 0, 20) as $skill) {
            $text = trim(is_array($skill) ? implode(' ', Arr::flatten($skill)) : (string) $skill);
            if ($text !== '') {
                $profile->skills()->firstOrCreate(['name' => Str::limit($text, 100, '')], ['type' => 'technical']);
            }
        }

        foreach (array_slice($result['idiomas'] ?? [], 0, 8) as $language) {
            $text = trim(is_array($language) ? implode(' ', Arr::flatten($language)) : (string) $language);
            if ($text !== '') {
                $profile->languages()->firstOrCreate(['language' => Str::limit($text, 100, '')]);
            }
        }

        $desired = $result['condiciones_laborales_deseadas'] ?? [];
        if (is_array($desired) && $desired !== []) {
            $profile->desiredConditions()->updateOrCreate([], array_intersect_key($desired, array_flip(['desired_position', 'work_modality', 'work_schedule', 'availability', 'preferred_communes'])));
        }

        $analysis->update(['applied_at' => now()]);
        $this->blindCvBuilder->build($profile->refresh());

        return $profile;
    }

    private function firstPosition(array $result): ?string
    {
        $experience = $result['experiencia_laboral'][0] ?? null;
        if (is_array($experience)) {
            return $experience['position'] ?? $experience['cargo'] ?? null;
        }

        return is_string($experience) ? Str::limit($experience, 120, '') : null;
    }
}
