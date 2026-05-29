<?php

namespace App\Services\Ai;

use App\Services\Ai\DTOs\CvAnalysisResult;
use App\Services\Ai\Providers\OllamaCvAnalyzer;
use App\Services\Ai\Providers\OpenAiCvAnalyzer;
use App\Services\Cv\CvRegexParser;
use App\Services\Settings\SystemSettingsService;
use Throwable;

class AiProviderManager
{
    public function __construct(
        private readonly SystemSettingsService $settings,
        private readonly CvRegexParser $regexParser,
        private readonly OllamaCvAnalyzer $ollama,
        private readonly OpenAiCvAnalyzer $openAi,
    ) {
    }

    public function analyze(string $text): CvAnalysisResult
    {
        $settings = $this->settings->aiSettings();
        $mode = $settings['cv_analysis_mode'];
        $provider = $settings['ai_provider'];

        if ($mode === 'regex') {
            return $this->regexParser->parse($text);
        }

        try {
            return match ($provider) {
                'ollama' => $this->ollama->analyze($text),
                'openai' => $this->openAi->analyze($text),
                default => $this->regexParser->parse($text),
            };
        } catch (Throwable $exception) {
            if ($settings['ai_failover_to_regex']) {
                $result = $this->regexParser->parse($text)->normalized();
                $result['alertas'][] = 'IA no disponible; se aplico fallback regex.';

                return new CvAnalysisResult($result, 'regex', (float) $result['confidence_score'], $result['alertas']);
            }

            throw $exception;
        }
    }
}
