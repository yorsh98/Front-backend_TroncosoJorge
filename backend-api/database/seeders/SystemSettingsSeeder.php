<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'cv_analysis_mode', 'value' => 'regex', 'type' => 'string', 'description' => 'Modo de analisis de CV por defecto.', 'is_public' => false],
            ['key' => 'ai_provider', 'value' => 'none', 'type' => 'string', 'description' => 'Proveedor IA activo.', 'is_public' => false],
            ['key' => 'ai_failover_to_regex', 'value' => 'true', 'type' => 'boolean', 'description' => 'Fallback a regex si IA falla.', 'is_public' => false],
            ['key' => 'ollama_base_url', 'value' => 'http://host.docker.internal:11434', 'type' => 'string', 'description' => 'URL local de Ollama desde Docker.', 'is_public' => false],
            ['key' => 'ollama_model', 'value' => 'gemma4:e4b', 'type' => 'string', 'description' => 'Modelo local Ollama.', 'is_public' => false],
            ['key' => 'openai_model', 'value' => 'gpt-4.1-mini', 'type' => 'string', 'description' => 'Modelo OpenAI configurado.', 'is_public' => false],
        ];

        foreach ($settings as $setting) {
            SystemSetting::query()->updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
