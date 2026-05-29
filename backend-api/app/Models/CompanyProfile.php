<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyProfile extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['validated_at' => 'datetime'];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_users')
            ->withPivot(['position', 'is_primary_contact'])
            ->withTimestamps();
    }

    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class);
    }
}
