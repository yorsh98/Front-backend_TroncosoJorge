<?php

namespace App\Http\Controllers\Api\V1\Persona;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCvUploadRequest;
use App\Jobs\AnalyzeCvJob;
use App\Models\CvAnalysisResult;
use App\Models\CvUpload;
use App\Models\PersonProfile;
use App\Services\Cv\CvProfileMapper;
use App\Services\Cv\CvUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CvController extends Controller
{
    public function upload(StoreCvUploadRequest $request, CvUploadService $uploadService): JsonResponse
    {
        $profile = $this->profileFor($request->user());
        $upload = $uploadService->store($profile, $request->file('cv'));

        AnalyzeCvJob::dispatch($upload->id);

        return response()->json([
            'message' => 'CV cargado correctamente. El analisis fue enviado a cola.',
            'data' => $this->uploadPayload($upload),
        ], 201);
    }

    public function uploads(): JsonResponse
    {
        $profile = $this->profileFor(request()->user());
        $uploads = $profile->cvUploads()->latest()->with('analysisResults')->get();

        return response()->json([
            'data' => $uploads->map(fn (CvUpload $upload) => $this->uploadPayload($upload))->values(),
        ]);
    }

    public function analysis(int $id): JsonResponse
    {
        $profile = $this->profileFor(request()->user());
        $analysis = CvAnalysisResult::query()
            ->whereHas('cvUpload', fn ($query) => $query->where('person_profile_id', $profile->id))
            ->findOrFail($id);

        return response()->json([
            'data' => $this->analysisPayload($analysis),
        ]);
    }

    public function apply(int $id, CvProfileMapper $mapper): JsonResponse
    {
        $profile = $this->profileFor(request()->user());
        $analysis = CvAnalysisResult::query()
            ->whereHas('cvUpload', fn ($query) => $query->where('person_profile_id', $profile->id))
            ->findOrFail($id);

        $mapper->apply($analysis);

        return response()->json([
            'message' => 'Analisis aplicado al perfil laboral. Revisa y corrige antes de solicitar publicacion.',
            'data' => $this->analysisPayload($analysis->refresh()),
        ]);
    }

    private function profileFor($user): PersonProfile
    {
        return PersonProfile::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'talent_code' => 'TAL-2026-'.str_pad((string) $user->id, 6, '0', STR_PAD_LEFT).'-'.Str::upper(Str::random(4)),
                'status' => 'draft',
                'is_visible' => false,
            ],
        );
    }

    private function uploadPayload(CvUpload $upload): array
    {
        $analysis = $upload->analysisResults->sortByDesc('created_at')->first();

        return [
            'id' => $upload->id,
            'original_filename' => $upload->original_filename,
            'mime_type' => $upload->mime_type,
            'size_bytes' => $upload->size_bytes,
            'status' => $upload->status,
            'consented_at' => $upload->consented_at,
            'created_at' => $upload->created_at,
            'latest_analysis_id' => $analysis?->id,
        ];
    }

    private function analysisPayload(CvAnalysisResult $analysis): array
    {
        return [
            'id' => $analysis->id,
            'cv_upload_id' => $analysis->cv_upload_id,
            'source' => $analysis->source,
            'confidence_score' => $analysis->confidence_score,
            'result' => $analysis->result_json,
            'alerts' => $analysis->alerts,
            'applied_at' => $analysis->applied_at,
            'created_at' => $analysis->created_at,
        ];
    }
}
