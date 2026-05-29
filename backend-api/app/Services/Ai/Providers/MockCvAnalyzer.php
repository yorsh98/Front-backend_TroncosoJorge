<?php

namespace App\Services\Ai\Providers;

use App\Services\Ai\Contracts\AiCvAnalyzerInterface;
use App\Services\Ai\DTOs\CvAnalysisResult;
use App\Services\Cv\CvRegexParser;

class MockCvAnalyzer implements AiCvAnalyzerInterface
{
    public function __construct(private readonly CvRegexParser $parser)
    {
    }

    public function analyze(string $text): CvAnalysisResult
    {
        $result = $this->parser->parse($text)->normalized();

        return new CvAnalysisResult($result, 'mock', 0.5, ['Analisis mock usado para pruebas.']);
    }
}
