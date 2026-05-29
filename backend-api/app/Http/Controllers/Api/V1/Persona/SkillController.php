<?php

namespace App\Http\Controllers\Api\V1\Persona;

use App\Http\Controllers\Controller;
use App\Http\Requests\Persona\StoreSkillRequest;
use App\Models\PersonProfile;
use App\Models\PersonSkill;
use App\Services\Cv\BlindCvBuilder;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => $this->profile()->skills()->orderBy('name')->get()]); }

    public function store(StoreSkillRequest $request, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $skill = $profile->skills()->create($request->validated() + ['type' => $request->input('type', 'technical')]);
        $builder->build($profile);
        return response()->json(['message' => 'Competencia creada.', 'data' => $skill], 201);
    }

    public function destroy(int $id, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $this->owned($id)->delete();
        $builder->build($profile);
        return response()->json(['message' => 'Competencia eliminada.']);
    }

    private function profile(): PersonProfile { return request()->user()->personProfile()->firstOrFail(); }
    private function owned(int $id): PersonSkill { return $this->profile()->skills()->findOrFail($id); }
}
