<?php

namespace App\Http\Controllers\Api\V1\Persona;

use App\Http\Controllers\Controller;
use App\Http\Requests\Persona\StoreExperienceRequest;
use App\Models\PersonProfile;
use App\Models\PersonWorkExperience;
use App\Services\Cv\BlindCvBuilder;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => $this->profile()->workExperiences()->latest()->get()]); }

    public function store(StoreExperienceRequest $request, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $experience = $profile->workExperiences()->create($request->validated());
        $builder->build($profile);
        return response()->json(['message' => 'Experiencia creada.', 'data' => $experience], 201);
    }

    public function update(StoreExperienceRequest $request, int $id, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $experience = $this->owned($id);
        $experience->update($request->validated());
        $builder->build($profile);
        return response()->json(['message' => 'Experiencia actualizada.', 'data' => $experience]);
    }

    public function destroy(int $id, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $this->owned($id)->delete();
        $builder->build($profile);
        return response()->json(['message' => 'Experiencia eliminada.']);
    }

    private function profile(): PersonProfile { return request()->user()->personProfile()->firstOrFail(); }
    private function owned(int $id): PersonWorkExperience { return $this->profile()->workExperiences()->findOrFail($id); }
}
