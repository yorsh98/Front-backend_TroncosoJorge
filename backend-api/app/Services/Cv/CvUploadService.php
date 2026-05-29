<?php

namespace App\Services\Cv;

use App\Models\CvUpload;
use App\Models\PersonProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CvUploadService
{
    public function store(PersonProfile $profile, UploadedFile $file): CvUpload
    {
        $disk = config('services.cv_analysis.storage_disk', 'private');
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = $profile->talent_code.'-'.Str::uuid().'.'.$extension;
        $path = $file->storeAs('cv/'.$profile->talent_code, $filename, $disk);

        return CvUpload::query()->create([
            'person_profile_id' => $profile->id,
            'original_filename' => $file->getClientOriginalName(),
            'storage_disk' => $disk,
            'storage_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size_bytes' => $file->getSize() ?: 0,
            'status' => 'queued',
            'consented_at' => now(),
        ]);
    }
}
