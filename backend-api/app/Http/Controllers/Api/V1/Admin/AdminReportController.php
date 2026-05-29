<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use App\Models\ContactRequest;
use App\Models\PersonProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    public function summary(): JsonResponse
    {
        return response()->json(['data' => [
            'talentos_registrados' => PersonProfile::count(),
            'talentos_validados' => PersonProfile::whereIn('status', ['validated', 'visible'])->count(),
            'empresas_activas' => CompanyProfile::where('status', 'active')->count(),
            'solicitudes_pendientes' => ContactRequest::whereIn('status', ['requested', 'under_review'])->count(),
            'solicitudes_aprobadas' => ContactRequest::where('status', 'approved')->count(),
            'solicitudes_cerradas' => ContactRequest::where('status', 'closed')->count(),
        ]]);
    }

    public function export(Request $request): StreamedResponse
    {
        $type = $request->query('type', 'talentos');
        $rows = match ($type) {
            'empresas' => CompanyProfile::select(['id', 'company_name', 'status', 'industry', 'commune'])->get()->toArray(),
            'solicitudes' => ContactRequest::select(['id', 'company_profile_id', 'blind_cv_profile_id', 'status', 'position_offered', 'requested_at'])->get()->toArray(),
            default => PersonProfile::select(['id', 'talent_code', 'status', 'current_position', 'years_experience', 'is_visible'])->get()->toArray(),
        };

        return response()->streamDownload(function () use ($rows): void {
            $out = fopen('php://output', 'w');
            if (($rows[0] ?? null) !== null) { fputcsv($out, array_keys($rows[0])); }
            foreach ($rows as $row) { fputcsv($out, $row); }
            fclose($out);
        }, "proviemplea-{$type}.csv", ['Content-Type' => 'text/csv']);
    }
}
