<?php

namespace App\Http\Controllers\Api\V1\Empresa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Empresa\StoreContactRequestRequest;
use App\Models\BlindCvProfile;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TalentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlindCvProfile::query()
            ->where('status', 'published')
            ->whereHas('personProfile', fn ($q) => $q->where('status', 'visible')->where('is_visible', true));

        foreach (['education', 'career', 'skill', 'language', 'modality', 'schedule', 'availability'] as $filter) {
            if ($request->filled($filter)) {
                $value = Str::lower((string) $request->input($filter));
                $query->where(function ($q) use ($value) {
                    $q->whereRaw('LOWER(summary) LIKE ?', ["%{$value}%"])
                        ->orWhereRaw('LOWER(JSON_EXTRACT(education, "$")) LIKE ?', ["%{$value}%"])
                        ->orWhereRaw('LOWER(JSON_EXTRACT(technical_skills, "$")) LIKE ?', ["%{$value}%"])
                        ->orWhereRaw('LOWER(JSON_EXTRACT(languages, "$")) LIKE ?', ["%{$value}%"])
                        ->orWhereRaw('LOWER(JSON_EXTRACT(desired_conditions, "$")) LIKE ?', ["%{$value}%"]);
                });
            }
        }

        if ($request->boolean('disability')) {
            $query->where('show_law_21015', true);
        }

        return response()->json([
            'data' => $query->latest('published_at')->paginate(12)->through(fn (BlindCvProfile $blind) => $this->blindPayload($blind)),
        ]);
    }

    public function show(string $blindCvCode): JsonResponse
    {
        $blind = BlindCvProfile::query()
            ->where('blind_cv_code', $blindCvCode)
            ->where('status', 'published')
            ->whereHas('personProfile', fn ($q) => $q->where('status', 'visible')->where('is_visible', true))
            ->firstOrFail();

        return response()->json(['data' => $this->blindPayload($blind)]);
    }

    public function requestContact(StoreContactRequestRequest $request, string $blindCvCode): JsonResponse
    {
        $company = $this->company();
        if ($company->status !== 'active') {
            return response()->json(['message' => 'La empresa debe estar activa para solicitar contacto.'], 422);
        }

        $blind = BlindCvProfile::query()
            ->where('blind_cv_code', $blindCvCode)
            ->where('status', 'published')
            ->whereHas('personProfile', fn ($q) => $q->where('status', 'visible')->where('is_visible', true))
            ->firstOrFail();

        $contactRequest = $company->contactRequests()->firstOrCreate(
            ['blind_cv_profile_id' => $blind->id, 'requested_by' => $request->user()->id],
            $request->validated() + ['status' => 'requested', 'requested_at' => now()],
        );

        $contactRequest->statusHistories()->firstOrCreate(
            ['to_status' => 'requested'],
            ['from_status' => null, 'changed_by' => $request->user()->id, 'note' => 'Solicitud creada por empresa.'],
        );

        return response()->json(['message' => 'Solicitud de contacto enviada al Departamento de Empleo.', 'data' => $contactRequest], 201);
    }

    public function contactRequests(): JsonResponse
    {
        $requests = $this->company()->contactRequests()
            ->with(['blindCvProfile:id,blind_cv_code,summary,status', 'statusHistories'])
            ->latest()
            ->get();

        return response()->json(['data' => $requests]);
    }

    private function blindPayload(BlindCvProfile $blind): array
    {
        return [
            'blind_cv_code' => $blind->blind_cv_code,
            'summary' => $blind->summary,
            'education' => $blind->education,
            'work_experience' => $blind->work_experience,
            'certifications' => $blind->certifications,
            'technical_skills' => $blind->technical_skills,
            'languages' => $blind->languages,
            'desired_conditions' => $blind->desired_conditions,
            'show_law_21015' => $blind->show_law_21015,
            'published_at' => $blind->published_at,
        ];
    }

    private function company(): CompanyProfile
    {
        return request()->user()->companyProfiles()->firstOrFail();
    }
}
