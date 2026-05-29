<?php

namespace App\Http\Controllers\Api\V1\Empresa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Empresa\UpdateCompanyProfileRequest;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class CompanyProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => $this->company()]);
    }

    public function update(UpdateCompanyProfileRequest $request): JsonResponse
    {
        $data = $request->validated();
        $company = $this->company();

        $company->update([
            'company_name' => $data['company_name'],
            'rut' => $data['rut'] ?? $company->rut,
            'industry' => $data['industry'] ?? null,
            'size' => $data['size'] ?? null,
            'commune' => $data['commune'] ?? null,
            'address' => $data['address'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'] ?? null,
        ]);

        $company->users()->syncWithoutDetaching([
            $request->user()->id => [
                'position' => $data['position'] ?? 'Contacto empresa',
                'is_primary_contact' => true,
            ],
        ]);

        return response()->json(['message' => 'Perfil empresa actualizado.', 'data' => $company->refresh()]);
    }

    private function company(): CompanyProfile
    {
        $user = request()->user();
        $company = $user->companyProfiles()->first();

        if ($company) {
            return $company->load('users:id,name,email');
        }

        $company = CompanyProfile::query()->create([
            'company_name' => $user->name,
            'status' => 'pending_validation',
            'contact_email' => $user->email,
        ]);
        $company->users()->attach($user->id, ['position' => 'Contacto empresa', 'is_primary_contact' => true]);

        return $company->load('users:id,name,email');
    }
}
