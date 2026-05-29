<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminCompanyController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => CompanyProfile::with('users:id,name,email')->latest()->paginate(15)]); }

    public function show(int $id): JsonResponse { return response()->json(['data' => CompanyProfile::with(['users:id,name,email', 'contactRequests'])->findOrFail($id)]); }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['pending_validation', 'active', 'rejected', 'suspended'])], 'note' => ['nullable', 'string', 'max:1000']]);
        $company = CompanyProfile::findOrFail($id);
        $company->update(['status' => $data['status'], 'validated_at' => $data['status'] === 'active' ? now() : $company->validated_at, 'validated_by' => $data['status'] === 'active' ? $request->user()->id : $company->validated_by]);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => 'company-status-updated', 'auditable_type' => CompanyProfile::class, 'auditable_id' => $company->id, 'metadata' => ['status' => $data['status'], 'note' => $data['note'] ?? null], 'ip_address' => $request->ip(), 'user_agent' => substr((string) $request->userAgent(), 0, 255)]);

        return response()->json(['message' => 'Estado de empresa actualizado.', 'data' => $company]);
    }
}
