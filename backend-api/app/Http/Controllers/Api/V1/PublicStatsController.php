<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CvUpload;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                'cv_uploads_total' => CvUpload::count(),
            ],
        ]);
    }
}
