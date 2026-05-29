<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonCertification extends Model
{
    protected $guarded = [];

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }
}
