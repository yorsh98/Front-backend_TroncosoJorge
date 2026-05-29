<?php

namespace App\Services\Ai\Contracts;

use App\Services\Ai\DTOs\CvAnalysisResult;

interface AiCvAnalyzerInterface
{
    public function analyze(string $text): CvAnalysisResult;
}
