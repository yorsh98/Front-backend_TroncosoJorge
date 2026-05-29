<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlindCvProfile extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'education' => 'array',
            'work_experience' => 'array',
            'certifications' => 'array',
            'technical_skills' => 'array',
            'languages' => 'array',
            'desired_conditions' => 'array',
            'show_law_21015' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }

    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class);
    }
}
