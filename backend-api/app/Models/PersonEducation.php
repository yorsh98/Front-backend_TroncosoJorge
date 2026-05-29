<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonEducation extends Model
{
    protected $table = 'person_educations';
    protected $guarded = [];

    protected function casts(): array
    {
        return ['completed' => 'boolean'];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }
}
