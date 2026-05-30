<?php

namespace Tests\Feature\Api\V1;

use App\Models\CvUpload;
use App\Models\PersonProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicStatsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_stats_returns_total_cv_uploads(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();

        $firstProfile = PersonProfile::create([
            'user_id' => $firstUser->id,
            'talent_code' => 'PROV-TEST-001',
        ]);

        $secondProfile = PersonProfile::create([
            'user_id' => $secondUser->id,
            'talent_code' => 'PROV-TEST-002',
        ]);

        CvUpload::create([
            'person_profile_id' => $firstProfile->id,
            'original_filename' => 'cv-1.pdf',
            'storage_path' => 'cv/test/cv-1.pdf',
        ]);

        CvUpload::create([
            'person_profile_id' => $firstProfile->id,
            'original_filename' => 'cv-2.pdf',
            'storage_path' => 'cv/test/cv-2.pdf',
        ]);

        CvUpload::create([
            'person_profile_id' => $secondProfile->id,
            'original_filename' => 'cv-3.pdf',
            'storage_path' => 'cv/test/cv-3.pdf',
        ]);

        $response = $this->getJson('/api/v1/public/stats');

        $response
            ->assertOk()
            ->assertJsonPath('data.cv_uploads_total', 3);
    }
}
