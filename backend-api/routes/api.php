<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\V1\Admin\AiSettingsController;
use App\Http\Controllers\Api\V1\Admin\AdminCompanyController;
use App\Http\Controllers\Api\V1\Admin\AdminContactRequestController;
use App\Http\Controllers\Api\V1\Admin\AdminPersonController;
use App\Http\Controllers\Api\V1\Admin\AdminReportController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Empresa\CompanyProfileController;
use App\Http\Controllers\Api\V1\Empresa\TalentController;
use App\Http\Controllers\Api\V1\Persona\CvController;
use App\Http\Controllers\Api\V1\Persona\EducationController;
use App\Http\Controllers\Api\V1\Persona\ExperienceController;
use App\Http\Controllers\Api\V1\Persona\ProfileController;
use App\Http\Controllers\Api\V1\Persona\SkillController;
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

    Route::prefix('auth')->group(function (): void {
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth.login');
        Route::post('/register/persona', [AuthController::class, 'registerPersona'])->middleware('throttle:auth.register');
        Route::post('/register/empresa', [AuthController::class, 'registerEmpresa'])->middleware('throttle:auth.register');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::middleware(['auth:sanctum', 'role:superadmin', 'permission:manage-ai-settings'])
        ->prefix('admin/settings/ai')
        ->group(function (): void {
            Route::get('/', [AiSettingsController::class, 'show']);
            Route::put('/', [AiSettingsController::class, 'update']);
            Route::post('/test-connection', [AiSettingsController::class, 'testConnection']);
        });

    Route::middleware(['auth:sanctum', 'role:persona'])
        ->prefix('persona/cv')
        ->group(function (): void {
            Route::post('/upload', [CvController::class, 'upload']);
            Route::get('/uploads', [CvController::class, 'uploads']);
            Route::get('/analysis/{id}', [CvController::class, 'analysis']);
            Route::post('/analysis/{id}/apply-to-profile', [CvController::class, 'apply']);
        });

    Route::middleware(['auth:sanctum', 'role:persona'])->prefix('persona')->group(function (): void {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::get('/profile/completion', [ProfileController::class, 'completion']);
        Route::get('/blind-cv/preview', [ProfileController::class, 'blindCvPreview']);
        Route::post('/request-validation', [ProfileController::class, 'requestValidation']);

        Route::get('/educations', [EducationController::class, 'index']);
        Route::post('/educations', [EducationController::class, 'store']);
        Route::put('/educations/{id}', [EducationController::class, 'update']);
        Route::delete('/educations/{id}', [EducationController::class, 'destroy']);

        Route::get('/experiences', [ExperienceController::class, 'index']);
        Route::post('/experiences', [ExperienceController::class, 'store']);
        Route::put('/experiences/{id}', [ExperienceController::class, 'update']);
        Route::delete('/experiences/{id}', [ExperienceController::class, 'destroy']);

        Route::get('/skills', [SkillController::class, 'index']);
        Route::post('/skills', [SkillController::class, 'store']);
        Route::delete('/skills/{id}', [SkillController::class, 'destroy']);
    });

    Route::middleware(['auth:sanctum', 'role:empresa'])->prefix('empresa')->group(function (): void {
        Route::get('/profile', [CompanyProfileController::class, 'show']);
        Route::put('/profile', [CompanyProfileController::class, 'update']);
        Route::get('/talentos', [TalentController::class, 'index']);
        Route::get('/talentos/{blindCvCode}', [TalentController::class, 'show']);
        Route::post('/talentos/{blindCvCode}/request-contact', [TalentController::class, 'requestContact']);
        Route::get('/contact-requests', [TalentController::class, 'contactRequests']);
    });

    Route::middleware(['auth:sanctum', 'role:superadmin|admin_empleo'])->prefix('admin')->group(function (): void {
        Route::get('/dashboard', DashboardController::class);
        Route::get('/personas', [AdminPersonController::class, 'index'])->middleware('permission:manage-person-profiles');
        Route::get('/personas/{id}', [AdminPersonController::class, 'show'])->middleware('permission:manage-person-profiles');
        Route::put('/personas/{id}/status', [AdminPersonController::class, 'updateStatus'])->middleware('permission:validate-talents');
        Route::get('/empresas', [AdminCompanyController::class, 'index'])->middleware('permission:manage-company-profiles');
        Route::get('/empresas/{id}', [AdminCompanyController::class, 'show'])->middleware('permission:manage-company-profiles');
        Route::put('/empresas/{id}/status', [AdminCompanyController::class, 'updateStatus'])->middleware('permission:validate-companies');
        Route::get('/contact-requests', [AdminContactRequestController::class, 'index'])->middleware('permission:manage-contact-requests');
        Route::get('/contact-requests/{id}', [AdminContactRequestController::class, 'show'])->middleware('permission:manage-contact-requests');
        Route::put('/contact-requests/{id}/status', [AdminContactRequestController::class, 'updateStatus'])->middleware('permission:manage-contact-requests');
        Route::post('/contact-requests/{id}/notes', [AdminContactRequestController::class, 'addNote'])->middleware('permission:manage-contact-requests');
        Route::get('/reports/summary', [AdminReportController::class, 'summary'])->middleware('permission:view-reports');
        Route::get('/reports/export', [AdminReportController::class, 'export'])->middleware('permission:export-reports');
    });
});
