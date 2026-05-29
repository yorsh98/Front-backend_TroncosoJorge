<?php

namespace App\Services\Ai\DTOs;

class CvAnalysisResult
{
    public function __construct(
        public readonly array $data,
        public readonly string $source,
        public readonly float $confidenceScore = 0.0,
        public readonly array $alerts = [],
    ) {
    }

    public function normalized(): array
    {
        return [
            'resumen_laboral' => (string) ($this->data['resumen_laboral'] ?? ''),
            'educacion' => array_values($this->data['educacion'] ?? []),
            'experiencia_laboral' => array_values($this->data['experiencia_laboral'] ?? []),
            'certificaciones' => array_values($this->data['certificaciones'] ?? []),
            'competencias_tecnicas' => array_values($this->data['competencias_tecnicas'] ?? []),
            'idiomas' => array_values($this->data['idiomas'] ?? []),
            'condiciones_laborales_deseadas' => (array) ($this->data['condiciones_laborales_deseadas'] ?? []),
            'alertas' => array_values(array_unique(array_merge($this->alerts, $this->data['alertas'] ?? []))),
            'confidence_score' => $this->confidenceScore,
            'source' => $this->source,
        ];
    }
}
