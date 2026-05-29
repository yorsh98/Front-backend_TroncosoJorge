<?php

namespace App\Http\Requests\Persona;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('persona') ?? false;
    }

    public function rules(): array
    {
        return [
            'summary' => ['nullable', 'string', 'max:3000'],
            'current_position' => ['nullable', 'string', 'max:255'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:60'],
            'contact.commune' => ['nullable', 'string', 'max:120'],
            'contact.phone' => ['nullable', 'string', 'max:50'],
            'contact.alternate_email' => ['nullable', 'email', 'max:255'],
            'desired.desired_position' => ['nullable', 'string', 'max:255'],
            'desired.work_modality' => ['nullable', 'string', 'max:80'],
            'desired.work_schedule' => ['nullable', 'string', 'max:80'],
            'desired.availability' => ['nullable', 'string', 'max:120'],
            'disability.has_disability' => ['nullable', 'boolean'],
            'disability.law_21015_consent' => ['nullable', 'boolean'],
            'disability.workplace_adjustments' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
