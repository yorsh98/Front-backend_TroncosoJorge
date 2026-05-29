<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonContactData extends Model
{
    protected $table = 'person_contact_data';
    protected $guarded = [];

    protected function casts(): array
    {
        return ['birth_date' => 'date'];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }
}
