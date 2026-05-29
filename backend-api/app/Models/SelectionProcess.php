<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SelectionProcess extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['interview_date' => 'date'];
    }

    public function contactRequest(): BelongsTo
    {
        return $this->belongsTo(ContactRequest::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(SelectionProcessNote::class);
    }
}
