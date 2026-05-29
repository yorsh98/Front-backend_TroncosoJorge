<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonDesiredCondition extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['preferred_communes' => 'array'];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }
}
