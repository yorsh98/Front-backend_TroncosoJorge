<?php

namespace App\Http\Requests\Persona;

use Illuminate\Foundation\Http\FormRequest;

class StoreEducationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('persona') ?? false; }

    public function rules(): array
    {
        return [
            'level' => ['required', 'string', 'max:120'],
            'institution' => ['nullable', 'string', 'max:255'],
            'career' => ['nullable', 'string', 'max:255'],
            'start_year' => ['nullable', 'integer', 'min:1950', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1950', 'max:2100'],
            'completed' => ['boolean'],
        ];
    }
}
