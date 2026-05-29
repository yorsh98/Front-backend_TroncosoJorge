<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SelectionProcessNote extends Model
{
    protected $guarded = [];

    public function selectionProcess(): BelongsTo
    {
        return $this->belongsTo(SelectionProcess::class);
    }
}
