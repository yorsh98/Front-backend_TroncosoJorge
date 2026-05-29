<?php

namespace App\Services\Settings;

use App\Models\SystemSetting;
use Illuminate\Support\Collection;

class SystemSettingsService
{
    public function aiSettings(): array
    {
        $settings = $this->settingsByKey([
            'cv_analysis_mode',
            'ai_provider',
            'ai_failover_to_regex',
            'ollama_base_url',
            'ollama_model',
            'openai_model',
        ]);

        return [
            'cv_analysis_mode' => $settings->get('cv_analysis_mode')?->value ?? config('services.cv_analysis.mode', 'regex'),
            'ai_provider' => $settings->get('ai_provider')?->value ?? config('services.cv_analysis.provider', 'none'),
            'ai_failover_to_regex' => $this->boolValue($settings->get('ai_failover_to_regex')?->value ?? config('services.cv_analysis.failover_to_regex', true)),
            'ollama_base_url' => $settings->get('ollama_base_url')?->value ?? config('services.ollama.base_url'),
            'ollama_model' => $settings->get('ollama_model')?->value ?? config('services.ollama.model'),
            'openai_model' => $settings->get('openai_model')?->value ?? config('services.openai.model'),
            'openai_api_key_configured' => filled(config('services.openai.api_key')),
        ];
    }

    public function updateAiSettings(array $data): array
    {
        $definitions = [
            'cv_analysis_mode' => ['type' => 'string', 'description' => 'Modo de analisis de CV por defecto.'],
            'ai_provider' => ['type' => 'string', 'description' => 'Proveedor IA activo.'],
            'ai_failover_to_regex' => ['type' => 'boolean', 'description' => 'Fallback a regex si IA falla.'],
            'ollama_base_url' => ['type' => 'string', 'description' => 'URL local de Ollama desde Docker.'],
            'ollama_model' => ['type' => 'string', 'description' => 'Modelo local Ollama.'],
            'openai_model' => ['type' => 'string', 'description' => 'Modelo OpenAI configurado.'],
        ];

        foreach ($definitions as $key => $definition) {
            if (! array_key_exists($key, $data)) {
                continue;
            }

            SystemSetting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'value' => $this->stringValue($data[$key]),
                    'type' => $definition['type'],
                    'description' => $definition['description'],
                    'is_public' => false,
                ],
            );
        }

        return $this->aiSettings();
    }

    private function settingsByKey(array $keys): Collection
    {
        return SystemSetting::query()
            ->whereIn('key', $keys)
            ->get()
            ->keyBy('key');
    }

    private function boolValue(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    private function stringValue(mixed $value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return (string) $value;
    }
}
