<?php

namespace App\Services\Ai\Providers;

use App\Services\Ai\Contracts\AiCvAnalyzerInterface;
use App\Services\Ai\DTOs\CvAnalysisResult;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiCvAnalyzer implements AiCvAnalyzerInterface
{
    public function analyze(string $text): CvAnalysisResult
    {
        $apiKey = config('services.openai.api_key');
        if (blank($apiKey)) {
            throw new RuntimeException('OPENAI_API_KEY no esta configurada.');
        }

        $response = Http::withToken($apiKey)
            ->timeout((int) config('services.openai.timeout_seconds', 90))
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('services.openai.model', 'gpt-4.1-mini'),
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => 'Eres un analizador de CV. Responde solo JSON valido. No expongas datos personales identificatorios.'],
                    ['role' => 'user', 'content' => $this->prompt($text)],
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('OpenAI no respondio correctamente.');
        }

        $content = (string) data_get($response->json(), 'choices.0.message.content', '');
        $decoded = json_decode($content, true);
        if (! is_array($decoded)) {
            throw new RuntimeException('OpenAI no devolvio JSON valido.');
        }

        return new CvAnalysisResult($decoded, 'openai', (float) ($decoded['confidence_score'] ?? 0.8), $decoded['alertas'] ?? []);
    }

    private function prompt(string $text): string
    {
        return 'Extrae informacion laboral desde este CV y responde JSON con: resumen_laboral, educacion, experiencia_laboral, certificaciones, competencias_tecnicas, idiomas, condiciones_laborales_deseadas, alertas, confidence_score. Excluye nombre, rut, correo, telefono, direccion, edad, genero, fotografia, estado civil y nacionalidad. CV: '.mb_substr($text, 0, 12000);
    }
}
