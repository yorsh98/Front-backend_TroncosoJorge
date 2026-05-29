<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CvUpload extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['consented_at' => 'datetime'];
    }

    public function personProfile(): BelongsTo
    {
        return $this->belongsTo(PersonProfile::class);
    }

    public function analysisResults(): HasMany
    {
        return $this->hasMany(CvAnalysisResult::class);
    }
}
