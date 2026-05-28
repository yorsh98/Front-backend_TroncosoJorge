<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'cv_analysis' => [
        'mode' => env('CV_ANALYSIS_MODE', 'regex'),
        'provider' => env('AI_PROVIDER', 'none'),
        'failover_to_regex' => env('AI_FAILOVER_TO_REGEX', true),
        'allowed_extensions' => env('CV_ALLOWED_EXTENSIONS', 'pdf,docx,doc'),
        'max_upload_mb' => (int) env('CV_MAX_UPLOAD_MB', 15),
        'storage_disk' => env('CV_STORAGE_DISK', 'private'),
        'queue' => env('CV_ANALYSIS_QUEUE', 'cv-analysis'),
        'settings_manageable_from_ui' => env('AI_SETTINGS_MANAGEABLE_FROM_UI', true),
    ],

    'ollama' => [
        'base_url' => env('OLLAMA_BASE_URL', 'http://host.docker.internal:11434'),
        'model' => env('OLLAMA_MODEL', 'gemma4:e4b'),
        'timeout_seconds' => (int) env('OLLAMA_TIMEOUT_SECONDS', 120),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4.1-mini'),
        'timeout_seconds' => (int) env('OPENAI_TIMEOUT_SECONDS', 90),
    ],

];
