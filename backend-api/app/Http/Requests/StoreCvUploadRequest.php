<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCvUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('persona') ?? false;
    }

    public function rules(): array
    {
        $maxKb = (int) config('services.cv_analysis.max_upload_mb', 15) * 1024;

        return [
            'cv' => ['required', 'file', 'extensions:pdf,docx,doc', 'max:'.$maxKb],
            'consent_accepted' => ['accepted'],
        ];
    }
}
