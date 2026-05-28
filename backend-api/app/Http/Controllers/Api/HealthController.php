<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Throwable;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'app' => config('app.name', 'ProviEmplea 2026 API'),
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
        ]);
    }

    public function database(): JsonResponse
    {
        try {
            DB::connection()->getPdo();

            return response()->json([
                'status' => 'ok',
                'connection' => config('database.default'),
            ]);
        } catch (Throwable) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed.',
            ], 503);
        }
    }

    public function storage(): JsonResponse
    {
        try {
            $disk = config('filesystems.default', 'private');
            $probe = 'health/.probe';

            Storage::disk($disk)->put($probe, now()->toISOString());
            Storage::disk($disk)->delete($probe);

            return response()->json([
                'status' => 'ok',
                'disk' => $disk,
            ]);
        } catch (Throwable) {
            return response()->json([
                'status' => 'error',
                'message' => 'Storage is not writable.',
            ], 503);
        }
    }

    public function queue(): JsonResponse
    {
        try {
            $hasJobsTable = Schema::hasTable('jobs');

            return response()->json([
                'status' => $hasJobsTable ? 'ok' : 'warning',
                'connection' => config('queue.default'),
                'jobs_table' => $hasJobsTable,
            ], $hasJobsTable ? 200 : 503);
        } catch (Throwable) {
            return response()->json([
                'status' => 'error',
                'message' => 'Queue health check failed.',
            ], 503);
        }
    }

    public function ai(): JsonResponse
    {
        $mode = config('services.cv_analysis.mode', 'regex');
        $provider = config('services.cv_analysis.provider', 'none');

        return response()->json([
            'status' => 'ok',
            'mode' => $mode,
            'provider' => $provider,
            'external_connection_required' => $mode !== 'regex',
            'message' => $mode === 'regex'
                ? 'Regex mode does not require external AI services.'
                : 'AI provider must be configured and reachable.',
        ]);
    }
}
