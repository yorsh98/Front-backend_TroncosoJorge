<?php

namespace App\Http\Requests\Persona;

use Illuminate\Foundation\Http\FormRequest;

class StoreExperienceRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('persona') ?? false; }

    public function rules(): array
    {
        return [
            'position' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'currently_working' => ['boolean'],
            'description' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
