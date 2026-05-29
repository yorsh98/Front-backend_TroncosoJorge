<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use App\Models\ContactRequest;
use App\Models\PersonProfile;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['data' => [
            'talentos_registrados' => PersonProfile::count(),
            'talentos_pendientes' => PersonProfile::where('status', 'pending_validation')->count(),
            'talentos_visibles' => PersonProfile::where('status', 'visible')->where('is_visible', true)->count(),
            'empresas_pendientes' => CompanyProfile::where('status', 'pending_validation')->count(),
            'empresas_activas' => CompanyProfile::where('status', 'active')->count(),
            'solicitudes_pendientes' => ContactRequest::whereIn('status', ['requested', 'under_review'])->count(),
            'solicitudes_totales' => ContactRequest::count(),
        ]]);
    }
}
