<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonDisabilityProfile extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'has_disability' => 'boolean',
            'law_21015_consent' => 'boolean',
        ];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }
}
