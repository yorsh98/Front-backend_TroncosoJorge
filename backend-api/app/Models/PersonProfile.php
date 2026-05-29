<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PersonProfile extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'validated_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contactData(): HasOne
    {
        return $this->hasOne(PersonContactData::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(PersonEducation::class);
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(PersonWorkExperience::class);
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(PersonCertification::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(PersonSkill::class);
    }

    public function languages(): HasMany
    {
        return $this->hasMany(PersonLanguage::class);
    }

    public function desiredConditions(): HasOne
    {
        return $this->hasOne(PersonDesiredCondition::class);
    }

    public function disabilityProfile(): HasOne
    {
        return $this->hasOne(PersonDisabilityProfile::class);
    }

    public function cvUploads(): HasMany
    {
        return $this->hasMany(CvUpload::class);
    }

    public function blindCvProfile(): HasOne
    {
        return $this->hasOne(BlindCvProfile::class);
    }
}
