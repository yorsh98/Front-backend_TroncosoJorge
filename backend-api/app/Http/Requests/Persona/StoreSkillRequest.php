<?php

namespace App\Http\Requests\Persona;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->hasRole('persona') ?? false; }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'type' => ['nullable', 'string', 'max:60'],
            'level' => ['nullable', 'string', 'max:60'],
        ];
    }
}
