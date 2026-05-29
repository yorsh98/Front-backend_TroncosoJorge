<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'manage-system-settings',
            'manage-users',
            'manage-person-profiles',
            'manage-company-profiles',
            'validate-talents',
            'validate-companies',
            'view-blind-cvs',
            'request-contact',
            'manage-contact-requests',
            'view-reports',
            'export-reports',
            'manage-ai-settings',
        ];

        $permissionModels = collect($permissions)->mapWithKeys(
            fn (string $permission) => [$permission => Permission::findOrCreate($permission, 'web')]
        );

        $superadmin = Role::findOrCreate('superadmin', 'web');
        $adminEmpleo = Role::findOrCreate('admin_empleo', 'web');
        $persona = Role::findOrCreate('persona', 'web');
        $empresa = Role::findOrCreate('empresa', 'web');

        $superadmin->syncPermissions($permissionModels->values());

        $adminEmpleo->syncPermissions($permissionModels->only([
            'manage-person-profiles',
            'manage-company-profiles',
            'validate-talents',
            'validate-companies',
            'view-blind-cvs',
            'manage-contact-requests',
            'view-reports',
            'export-reports',
        ])->values());

        $persona->syncPermissions($permissionModels->only([
            'manage-person-profiles',
        ])->values());

        $empresa->syncPermissions($permissionModels->only([
            'manage-company-profiles',
            'view-blind-cvs',
            'request-contact',
        ])->values());

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
