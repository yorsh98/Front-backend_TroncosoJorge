<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Settings\SystemSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Throwable;

class HealthController extends Controller
{
    public function __construct(private readonly SystemSettingsService $settings)
    {
    }

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
        $settings = $this->settings->aiSettings();
        $mode = $settings['cv_analysis_mode'];
        $provider = $settings['ai_provider'];

        return response()->json([
            'status' => 'ok',
            'mode' => $mode,
            'provider' => $provider,
            'failover_to_regex' => $settings['ai_failover_to_regex'],
            'openai_api_key_configured' => $settings['openai_api_key_configured'],
            'external_connection_required' => $mode !== 'regex',
            'message' => $mode === 'regex'
                ? 'Regex mode does not require external AI services.'
                : 'AI provider must be configured and reachable.',
        ]);
    }
}
