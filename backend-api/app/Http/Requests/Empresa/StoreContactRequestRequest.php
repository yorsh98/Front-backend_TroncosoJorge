<?php

namespace App\Http\Requests\Empresa;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('empresa') ?? false;
    }

    public function rules(): array
    {
        return [
            'position_offered' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
