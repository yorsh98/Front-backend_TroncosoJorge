<?php

namespace App\Jobs;

use App\Models\CvUpload;
use App\Services\Ai\AiProviderManager;
use App\Services\Cv\CvTextExtractionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class AnalyzeCvJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 180;

    public function __construct(public readonly int $cvUploadId)
    {
        $this->onQueue(config('services.cv_analysis.queue', 'cv-analysis'));
    }

    public function handle(CvTextExtractionService $extractor, AiProviderManager $manager): void
    {
        $upload = CvUpload::query()->findOrFail($this->cvUploadId);
        $upload->update(['status' => 'processing']);

        try {
            $path = Storage::disk($upload->storage_disk)->path($upload->storage_path);
            $extension = strtolower(pathinfo($upload->original_filename, PATHINFO_EXTENSION));
            $text = $extractor->extract($path, $extension);
            $analysis = $manager->analyze($text)->normalized();

            $upload->analysisResults()->create([
                'source' => $analysis['source'],
                'result_json' => $analysis,
                'confidence_score' => $analysis['confidence_score'],
                'alerts' => $analysis['alertas'],
            ]);

            $upload->update(['status' => 'analyzed']);
        } catch (Throwable $exception) {
            $upload->update(['status' => 'failed']);
            Log::warning('CV analysis failed', [
                'cv_upload_id' => $upload->id,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}
