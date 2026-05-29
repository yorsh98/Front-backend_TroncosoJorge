<?php

namespace App\Services\Cv;

use RuntimeException;
use Symfony\Component\Process\Process;

class CvLibreOfficeConverter
{
    public function convertToText(string $sourcePath): string
    {
        $outputDir = storage_path('app/private/cv-converted/'.uniqid('lo_', true));

        if (! is_dir($outputDir) && ! mkdir($outputDir, 0775, true) && ! is_dir($outputDir)) {
            throw new RuntimeException('No fue posible crear directorio temporal de conversion.');
        }

        $process = new Process([
            'soffice',
            '--headless',
            '--convert-to',
            'txt:Text',
            '--outdir',
            $outputDir,
            $sourcePath,
        ]);
        $process->setTimeout(120);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new RuntimeException('LibreOffice no pudo convertir el documento.');
        }

        $files = glob($outputDir.'/*.txt') ?: [];
        if ($files === []) {
            throw new RuntimeException('LibreOffice no genero archivo de texto.');
        }

        return trim((string) file_get_contents($files[0]));
    }
}
