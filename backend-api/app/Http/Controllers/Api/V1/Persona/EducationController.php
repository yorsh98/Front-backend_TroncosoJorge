<?php

namespace App\Http\Controllers\Api\V1\Persona;

use App\Http\Controllers\Controller;
use App\Http\Requests\Persona\StoreEducationRequest;
use App\Models\PersonEducation;
use App\Models\PersonProfile;
use App\Services\Cv\BlindCvBuilder;
use Illuminate\Http\JsonResponse;

class EducationController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => $this->profile()->educations()->latest()->get()]); }

    public function store(StoreEducationRequest $request, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $education = $profile->educations()->create($request->validated());
        $builder->build($profile);
        return response()->json(['message' => 'Educacion creada.', 'data' => $education], 201);
    }

    public function update(StoreEducationRequest $request, int $id, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $education = $this->owned($id);
        $education->update($request->validated());
        $builder->build($profile);
        return response()->json(['message' => 'Educacion actualizada.', 'data' => $education]);
    }

    public function destroy(int $id, BlindCvBuilder $builder): JsonResponse
    {
        $profile = $this->profile();
        $this->owned($id)->delete();
        $builder->build($profile);
        return response()->json(['message' => 'Educacion eliminada.']);
    }

    private function profile(): PersonProfile { return request()->user()->personProfile()->firstOrFail(); }
    private function owned(int $id): PersonEducation { return $this->profile()->educations()->findOrFail($id); }
}
