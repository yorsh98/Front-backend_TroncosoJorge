<?php

namespace App\Http\Controllers\Api\V1\Persona;

use App\Http\Controllers\Controller;
use App\Http\Requests\Persona\UpdateProfileRequest;
use App\Models\PersonProfile;
use App\Services\Cv\BlindCvBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => $this->payload($this->profile())]);
    }

    public function update(UpdateProfileRequest $request, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $data = $request->validated();

        $profile->update(array_filter([
            'summary' => $data['summary'] ?? null,
            'current_position' => $data['current_position'] ?? null,
            'years_experience' => $data['years_experience'] ?? null,
        ], fn ($value) => $value !== null));

        if (isset($data['contact'])) {
            $profile->contactData()->updateOrCreate([], $data['contact']);
        }
        if (isset($data['desired'])) {
            $profile->desiredConditions()->updateOrCreate([], $data['desired']);
        }
        if (isset($data['disability'])) {
            $profile->disabilityProfile()->updateOrCreate([], $data['disability']);
        }

        $builder->build($profile->refresh());

        return response()->json(['message' => 'Perfil actualizado.', 'data' => $this->payload($profile)]);
    }

    public function completion(): JsonResponse
    {
        $profile = $this->profile()->load(['contactData', 'educations', 'workExperiences', 'skills', 'desiredConditions']);
        $checks = [
            'summary' => filled($profile->summary),
            'current_position' => filled($profile->current_position),
            'contact' => (bool) $profile->contactData,
            'education' => $profile->educations->isNotEmpty(),
            'experience' => $profile->workExperiences->isNotEmpty(),
            'skills' => $profile->skills->isNotEmpty(),
            'desired_conditions' => (bool) $profile->desiredConditions,
        ];
        $completed = count(array_filter($checks));

        return response()->json(['data' => ['percentage' => (int) round(($completed / count($checks)) * 100), 'checks' => $checks]]);
    }

    public function blindCvPreview(BlindCvBuilder $builder): JsonResponse
    {
        $blind = $builder->build($this->profile());

        return response()->json(['data' => $blind]);
    }

    public function requestValidation(BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $completion = $this->completion()->getData(true)['data']['percentage'];

        if ($completion < 60) {
            return response()->json(['message' => 'El perfil debe estar al menos 60% completo para solicitar validacion.', 'completion' => $completion], 422);
        }

        $profile->update(['status' => 'pending_validation', 'is_visible' => false]);
        $builder->build($profile->refresh());

        return response()->json(['message' => 'Solicitud de validacion enviada.', 'data' => $this->payload($profile)]);
    }

    private function profile(): PersonProfile
    {
        $user = request()->user();

        return PersonProfile::query()->firstOrCreate(['user_id' => $user->id], [
            'talent_code' => 'TAL-2026-'.str_pad((string) $user->id, 6, '0', STR_PAD_LEFT).'-'.Str::upper(Str::random(4)),
            'status' => 'draft',
            'is_visible' => false,
        ])->load(['contactData', 'educations', 'workExperiences', 'certifications', 'skills', 'languages', 'desiredConditions', 'disabilityProfile', 'blindCvProfile']);
    }

    private function payload(PersonProfile $profile): array
    {
        return $profile->toArray();
    }
}
