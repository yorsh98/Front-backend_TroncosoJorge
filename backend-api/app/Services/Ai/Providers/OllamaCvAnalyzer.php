<?php

namespace App\Services\Ai\Providers;

use App\Services\Ai\Contracts\AiCvAnalyzerInterface;
use App\Services\Ai\DTOs\CvAnalysisResult;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OllamaCvAnalyzer implements AiCvAnalyzerInterface
{
    public function analyze(string $text): CvAnalysisResult
    {
        $response = Http::timeout((int) config('services.ollama.timeout_seconds', 120))
            ->post(rtrim((string) config('services.ollama.base_url'), '/').'/api/generate', [
                'model' => config('services.ollama.model', 'gemma4:e4b'),
                'stream' => false,
                'prompt' => $this->prompt($text),
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Ollama no respondio correctamente.');
        }

        $json = $this->decodeJson((string) $response->json('response', ''));

        return new CvAnalysisResult($json, 'ollama', (float) ($json['confidence_score'] ?? 0.75), $json['alertas'] ?? []);
    }

    private function prompt(string $text): string
    {
        return 'Extrae informacion laboral desde este CV y responde solo JSON valido con las claves: resumen_laboral, educacion, experiencia_laboral, certificaciones, competencias_tecnicas, idiomas, condiciones_laborales_deseadas, alertas, confidence_score. No incluyas nombre, rut, correo, telefono, direccion, edad ni genero. CV: '.mb_substr($text, 0, 12000);
    }

    private function decodeJson(string $content): array
    {
        $content = trim($content);
        if (preg_match('/\{.*\}/s', $content, $matches)) {
            $content = $matches[0];
        }

        $decoded = json_decode($content, true);
        if (! is_array($decoded)) {
            throw new RuntimeException('Ollama no devolvio JSON valido.');
        }

        return $decoded;
    }
}
