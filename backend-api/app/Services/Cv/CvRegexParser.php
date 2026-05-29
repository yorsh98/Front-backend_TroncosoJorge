<?php

namespace App\Services\Cv;

use App\Services\Ai\DTOs\CvAnalysisResult;
use Illuminate\Support\Str;

class CvRegexParser
{
    public function parse(string $text): CvAnalysisResult
    {
        $cleanText = $this->normalizeText($text);

        $email = $this->firstMatch('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $cleanText);
        $phone = $this->firstMatch('/(?:\+?56\s?)?(?:9\s?)?\d{4}\s?\d{4}/', $cleanText);

        $data = [
            'resumen_laboral' => $this->summary($cleanText),
            'educacion' => $this->sectionItems($cleanText, ['educacion', 'formacion academica', 'estudios']),
            'experiencia_laboral' => $this->sectionItems($cleanText, ['experiencia', 'experiencia laboral', 'antecedentes laborales']),
            'certificaciones' => $this->sectionItems($cleanText, ['certificaciones', 'certificados', 'cursos']),
            'competencias_tecnicas' => $this->skills($cleanText),
            'idiomas' => $this->languages($cleanText),
            'condiciones_laborales_deseadas' => $this->desiredConditions($cleanText),
            'alertas' => array_values(array_filter([
                $email ? 'Se detecto correo en el CV real; no se incluye en CV ciego.' : null,
                $phone ? 'Se detecto telefono en el CV real; no se incluye en CV ciego.' : null,
            ])),
        ];

        return new CvAnalysisResult($data, 'regex', $this->confidence($data));
    }

    private function normalizeText(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[\t ]+/', ' ', $text) ?? $text;

        return trim($text);
    }

    private function firstMatch(string $pattern, string $text): ?string
    {
        preg_match($pattern, $text, $matches);

        return $matches[0] ?? null;
    }

    private function summary(string $text): string
    {
        $section = $this->section($text, ['perfil', 'resumen', 'resumen laboral', 'objetivo']);

        if ($section !== '') {
            return Str::limit($section, 700, '');
        }

        $lines = array_values(array_filter(array_map('trim', explode("\n", $text))));

        return Str::limit(implode(' ', array_slice($lines, 0, 4)), 700, '');
    }

    private function sectionItems(string $text, array $headings): array
    {
        $section = $this->section($text, $headings);
        $lines = array_values(array_filter(array_map('trim', preg_split('/\n+|•|- /', $section) ?: [])));

        return array_values(array_filter(array_map(fn (string $line) => Str::limit($line, 250, ''), array_slice($lines, 0, 8))));
    }

    private function section(string $text, array $headings): string
    {
        $quoted = implode('|', array_map(fn (string $heading) => preg_quote($heading, '/'), $headings));
        $stop = 'experiencia|educacion|formacion|certificaciones|cursos|habilidades|competencias|idiomas|referencias|datos personales|contacto';
        preg_match('/(?:^|\n)\s*(?:'.$quoted.')\s*:?\s*\n?(.*?)(?=\n\s*(?:'.$stop.')\s*:?\s*\n|\z)/isu', $text, $matches);

        return trim($matches[1] ?? '');
    }

    private function skills(string $text): array
    {
        $known = ['excel', 'word', 'power bi', 'sql', 'php', 'laravel', 'react', 'typescript', 'javascript', 'soporte tecnico', 'redes', 'atencion de publico', 'gestion documental', 'administracion', 'ventas'];
        $found = [];

        foreach ($known as $skill) {
            if (Str::contains(Str::lower($text), $skill)) {
                $found[] = Str::headline($skill);
            }
        }

        return array_values(array_unique(array_merge($found, $this->sectionItems($text, ['habilidades', 'competencias', 'competencias tecnicas']))));
    }

    private function languages(string $text): array
    {
        $languages = [];
        foreach (['ingles', 'portugues', 'frances', 'aleman', 'espanol'] as $language) {
            if (preg_match('/'.$language.'\s*(?:-|:)?\s*(basico|intermedio|avanzado|nativo)?/iu', $text, $matches)) {
                $languages[] = trim(Str::headline($language).' '.($matches[1] ?? ''));
            }
        }

        return array_values(array_unique($languages));
    }

    private function desiredConditions(string $text): array
    {
        $lower = Str::lower($text);

        return array_filter([
            'work_modality' => Str::contains($lower, 'hibrido') ? 'hibrido' : (Str::contains($lower, 'remoto') ? 'remoto' : null),
            'work_schedule' => Str::contains($lower, 'jornada completa') ? 'jornada completa' : (Str::contains($lower, 'part time') ? 'part time' : null),
            'availability' => Str::contains($lower, 'inmediata') ? 'inmediata' : null,
        ]);
    }

    private function confidence(array $data): float
    {
        $score = 0.25;
        foreach (['resumen_laboral', 'educacion', 'experiencia_laboral', 'competencias_tecnicas', 'idiomas'] as $key) {
            $score += empty($data[$key]) ? 0 : 0.12;
        }

        return min(0.85, round($score, 3));
    }
}
