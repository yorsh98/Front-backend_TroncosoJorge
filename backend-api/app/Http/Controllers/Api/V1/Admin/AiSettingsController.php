<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\Settings\SystemSettingsService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AiSettingsController extends Controller
{
    public function __construct(private readonly SystemSettingsService $settings)
    {
    }

    public function show(): JsonResponse
    {
        return response()->json([
            'data' => $this->settings->aiSettings(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cv_analysis_mode' => ['required', Rule::in(['regex', 'local', 'cloud', 'hybrid'])],
            'ai_provider' => ['required', Rule::in(['none', 'ollama', 'openai'])],
            'ai_failover_to_regex' => ['required', 'boolean'],
            'ollama_base_url' => ['nullable', 'url', 'max:255'],
            'ollama_model' => ['nullable', 'string', 'max:100'],
            'openai_model' => ['nullable', 'string', 'max:100'],
        ]);

        $this->validateModeProvider($data['cv_analysis_mode'], $data['ai_provider'], (bool) $data['ai_failover_to_regex']);

        $updated = $this->settings->updateAiSettings([
            'cv_analysis_mode' => $data['cv_analysis_mode'],
            'ai_provider' => $data['ai_provider'],
            'ai_failover_to_regex' => (bool) $data['ai_failover_to_regex'],
            'ollama_base_url' => $data['ollama_base_url'] ?? config('services.ollama.base_url'),
            'ollama_model' => $data['ollama_model'] ?? config('services.ollama.model'),
            'openai_model' => $data['openai_model'] ?? config('services.openai.model'),
        ]);

        return response()->json([
            'message' => 'Configuracion IA actualizada correctamente.',
            'data' => $updated,
        ]);
    }

    public function testConnection(): JsonResponse
    {
        $settings = $this->settings->aiSettings();
        $mode = $settings['cv_analysis_mode'];
        $provider = $settings['ai_provider'];

        if ($mode === 'regex') {
            return response()->json([
                'status' => 'ok',
                'mode' => $mode,
                'provider' => $provider,
                'message' => 'Regex no requiere conexion externa.',
            ]);
        }

        if ($provider === 'ollama') {
            return $this->testOllama($settings['ollama_base_url']);
        }

        if ($provider === 'openai') {
            return $this->testOpenAi();
        }

        return response()->json([
            'status' => 'error',
            'message' => 'No hay proveedor IA configurado para probar.',
        ], 422);
    }

    private function validateModeProvider(string $mode, string $provider, bool $failover): void
    {
        $valid = match ($mode) {
            'regex' => $provider === 'none',
            'local' => $provider === 'ollama',
            'cloud' => $provider === 'openai',
            'hybrid' => in_array($provider, ['ollama', 'openai'], true) && $failover,
            default => false,
        };

        if (! $valid) {
            throw ValidationException::withMessages([
                'ai_provider' => ['La combinacion de modo, proveedor y fallback no es valida.'],
            ]);
        }
    }

    private function testOllama(string $baseUrl): JsonResponse
    {
        try {
            $response = Http::timeout(5)->get(rtrim($baseUrl, '/').'/api/tags');

            return response()->json([
                'status' => $response->successful() ? 'ok' : 'error',
                'provider' => 'ollama',
                'base_url' => $baseUrl,
                'http_status' => $response->status(),
                'message' => $response->successful()
                    ? 'Ollama responde correctamente.'
                    : 'Ollama no respondio correctamente.',
            ], $response->successful() ? 200 : 503);
        } catch (ConnectionException) {
            return response()->json([
                'status' => 'error',
                'provider' => 'ollama',
                'base_url' => $baseUrl,
                'message' => 'No fue posible conectar con Ollama. En el entorno del profesor se recomienda usar regex.',
            ], 503);
        }
    }

    private function testOpenAi(): JsonResponse
    {
        if (blank(config('services.openai.api_key'))) {
            return response()->json([
                'status' => 'error',
                'provider' => 'openai',
                'message' => 'OPENAI_API_KEY no esta configurada en el entorno.',
            ], 422);
        }

        return response()->json([
            'status' => 'ok',
            'provider' => 'openai',
            'model' => config('services.openai.model'),
            'message' => 'OPENAI_API_KEY esta configurada. La llamada real se realiza durante el analisis de CV.',
        ]);
    }
}
