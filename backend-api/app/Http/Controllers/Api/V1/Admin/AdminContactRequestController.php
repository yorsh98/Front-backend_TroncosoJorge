<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ContactRequest;
use App\Models\SelectionProcess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminContactRequestController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => ContactRequest::with(['companyProfile', 'blindCvProfile', 'statusHistories'])->latest()->paginate(15)]); }

    public function show(int $id): JsonResponse { return response()->json(['data' => ContactRequest::with(['companyProfile', 'blindCvProfile', 'statusHistories', 'selectionProcess.notes'])->findOrFail($id)]); }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['status' => ['required', Rule::in(['requested', 'under_review', 'approved', 'rejected', 'contacted', 'interview', 'selected', 'not_selected', 'closed'])], 'note' => ['nullable', 'string', 'max:1000']]);
        $contact = ContactRequest::findOrFail($id);
        $from = $contact->status;
        $contact->update(['status' => $data['status'], 'closed_at' => $data['status'] === 'closed' ? now() : $contact->closed_at]);
        $contact->statusHistories()->create(['from_status' => $from, 'to_status' => $data['status'], 'changed_by' => $request->user()->id, 'note' => $data['note'] ?? null]);
        if (in_array($data['status'], ['interview', 'selected', 'not_selected'], true)) {
            SelectionProcess::firstOrCreate(['contact_request_id' => $contact->id], ['status' => 'open']);
        }
        AuditLog::create(['user_id' => $request->user()->id, 'action' => 'contact-request-status-updated', 'auditable_type' => ContactRequest::class, 'auditable_id' => $contact->id, 'metadata' => ['from' => $from, 'to' => $data['status']], 'ip_address' => $request->ip(), 'user_agent' => substr((string) $request->userAgent(), 0, 255)]);

        return response()->json(['message' => 'Estado de solicitud actualizado.', 'data' => $contact->load('statusHistories')]);
    }

    public function addNote(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['note' => ['required', 'string', 'max:2000']]);
        $contact = ContactRequest::findOrFail($id);
        $process = SelectionProcess::firstOrCreate(['contact_request_id' => $contact->id], ['status' => 'open']);
        $note = $process->notes()->create(['created_by' => $request->user()->id, 'note' => $data['note']]);

        return response()->json(['message' => 'Nota interna agregada.', 'data' => $note], 201);
    }
}
