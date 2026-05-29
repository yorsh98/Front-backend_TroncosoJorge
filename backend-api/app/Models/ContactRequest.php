<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContactRequest extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'requested_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function companyProfile(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }

    public function blindCvProfile(): BelongsTo
    {
        return $this->belongsTo(BlindCvProfile::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ContactRequestStatusHistory::class);
    }

    public function selectionProcess(): HasOne
    {
        return $this->hasOne(SelectionProcess::class);
    }
}
