<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CvAnalysisResult extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'result_json' => 'array',
            'alerts' => 'array',
            'confidence_score' => 'decimal:3',
            'applied_at' => 'datetime',
        ];
    }

    public function cvUpload(): BelongsTo
    {
        return $this->belongsTo(CvUpload::class);
    }
}
