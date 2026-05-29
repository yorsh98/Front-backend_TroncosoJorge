<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PersonProfile;
use App\Services\Cv\BlindCvBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminPersonController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => PersonProfile::query()->with('user:id,name,email')->latest()->paginate(15)]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => PersonProfile::query()->with(['user:id,name,email', 'contactData', 'educations', 'workExperiences', 'skills', 'languages', 'desiredConditions', 'blindCvProfile'])->findOrFail($id)]);
    }

    public function updateStatus(Request $request, int $id, BlindCvBuilder $builder): JsonResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['draft', 'pending_validation', 'validated', 'rejected', 'visible', 'hidden'])], 'note' => ['nullable', 'string', 'max:1000']]);
        $profile = PersonProfile::query()->findOrFail($id);
        $profile->update([
            'status' => $data['status'],
            'is_visible' => $data['status'] === 'visible',
            'validated_at' => in_array($data['status'], ['validated', 'visible'], true) ? now() : $profile->validated_at,
            'validated_by' => in_array($data['status'], ['validated', 'visible'], true) ? $request->user()->id : $profile->validated_by,
        ]);
        $builder->build($profile->refresh());
        $this->audit($request, 'talent-status-updated', $profile, ['status' => $data['status'], 'note' => $data['note'] ?? null]);

        return response()->json(['message' => 'Estado de talento actualizado.', 'data' => $profile]);
    }

    private function audit(Request $request, string $action, mixed $model, array $metadata = []): void
    {
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'auditable_type' => $model::class, 'auditable_id' => $model->id, 'metadata' => $metadata, 'ip_address' => $request->ip(), 'user_agent' => substr((string) $request->userAgent(), 0, 255)]);
    }
}
