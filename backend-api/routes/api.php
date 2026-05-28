<?php

use App\Http\Controllers\Api\HealthController;
use Illuminate\Support\Facades\Route;

Route::prefix('health')->group(function (): void {
    Route::get('/', [HealthController::class, 'index']);
    Route::get('/db', [HealthController::class, 'database']);
    Route::get('/storage', [HealthController::class, 'storage']);
    Route::get('/queue', [HealthController::class, 'queue']);
    Route::get('/ai', [HealthController::class, 'ai']);
});

Route::prefix('v1')->group(function (): void {
    Route::get('/ping', fn () => response()->json([
        'status' => 'ok',
        'message' => 'ProviEmplea 2026 API v1',
    ]));
});
