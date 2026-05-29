<?php

namespace App\Services\Cv;

use RuntimeException;
use Symfony\Component\Process\Process;
use ZipArchive;

class CvTextExtractionService
{
    public function __construct(private readonly CvLibreOfficeConverter $converter)
    {
    }

    public function extract(string $path, string $extension): string
    {
        $extension = strtolower($extension);

        return match ($extension) {
            'pdf' => $this->extractPdf($path),
            'docx' => $this->extractDocx($path),
            'doc' => $this->converter->convertToText($path),
            default => throw new RuntimeException('Extension de CV no soportada.'),
        };
    }

    private function extractPdf(string $path): string
    {
        $process = new Process(['pdftotext', '-layout', $path, '-']);
        $process->setTimeout(60);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new RuntimeException('No fue posible extraer texto desde PDF.');
        }

        return trim($process->getOutput());
    }

    private function extractDocx(string $path): string
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            return $this->converter->convertToText($path);
        }

        $xml = $zip->getFromName('word/document.xml');
        $zip->close();

        if (! $xml) {
            return $this->converter->convertToText($path);
        }

        $text = strip_tags(str_replace(['</w:p>', '</w:tr>'], "\n", $xml));

        return trim(html_entity_decode($text));
    }
}
