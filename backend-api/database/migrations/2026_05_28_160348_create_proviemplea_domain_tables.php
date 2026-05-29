<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('person_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('talent_code')->unique();
            $table->string('status')->default('draft')->index();
            $table->text('summary')->nullable();
            $table->string('current_position')->nullable();
            $table->unsignedTinyInteger('years_experience')->default(0);
            $table->boolean('is_visible')->default(false)->index();
            $table->timestamp('validated_at')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('person_contact_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('rut')->nullable();
            $table->string('phone')->nullable();
            $table->string('alternate_email')->nullable();
            $table->string('commune')->nullable();
            $table->string('address')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable();
            $table->string('nationality')->nullable();
            $table->timestamps();
        });

        Schema::create('person_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('level');
            $table->string('institution')->nullable();
            $table->string('career')->nullable();
            $table->unsignedSmallInteger('start_year')->nullable();
            $table->unsignedSmallInteger('end_year')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });

        Schema::create('person_work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('position');
            $table->string('company_name')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('currently_working')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('person_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->timestamps();
        });

        Schema::create('person_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('technical');
            $table->string('level')->nullable();
            $table->timestamps();
        });

        Schema::create('person_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('language');
            $table->string('level')->nullable();
            $table->timestamps();
        });

        Schema::create('person_desired_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('desired_position')->nullable();
            $table->string('work_modality')->nullable();
            $table->string('work_schedule')->nullable();
            $table->unsignedInteger('expected_salary')->nullable();
            $table->string('availability')->nullable();
            $table->json('preferred_communes')->nullable();
            $table->timestamps();
        });

        Schema::create('person_disability_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('has_disability')->default(false);
            $table->boolean('law_21015_consent')->default(false);
            $table->string('disability_context')->nullable();
            $table->text('workplace_adjustments')->nullable();
            $table->timestamps();
        });

        Schema::create('company_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('rut')->nullable()->unique();
            $table->string('status')->default('pending_validation')->index();
            $table->string('industry')->nullable();
            $table->string('size')->nullable();
            $table->string('commune')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('company_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('position')->nullable();
            $table->boolean('is_primary_contact')->default(false);
            $table->timestamps();
            $table->unique(['company_profile_id', 'user_id']);
        });

        Schema::create('cv_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->constrained()->cascadeOnDelete();
            $table->string('original_filename');
            $table->string('storage_disk')->default('private');
            $table->string('storage_path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('status')->default('uploaded')->index();
            $table->timestamp('consented_at')->nullable();
            $table->timestamps();
        });

        Schema::create('cv_analysis_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cv_upload_id')->constrained()->cascadeOnDelete();
            $table->string('source')->default('regex');
            $table->json('result_json');
            $table->decimal('confidence_score', 4, 3)->default(0);
            $table->json('alerts')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();
        });

        Schema::create('blind_cv_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('person_profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('blind_cv_code')->unique();
            $table->string('status')->default('draft')->index();
            $table->text('summary')->nullable();
            $table->json('education')->nullable();
            $table->json('work_experience')->nullable();
            $table->json('certifications')->nullable();
            $table->json('technical_skills')->nullable();
            $table->json('languages')->nullable();
            $table->json('desired_conditions')->nullable();
            $table->boolean('show_law_21015')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('blind_cv_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('requested')->index();
            $table->string('position_offered')->nullable();
            $table->text('message')->nullable();
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_request_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_request_id')->constrained()->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('selection_processes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_request_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('open')->index();
            $table->date('interview_date')->nullable();
            $table->text('result')->nullable();
            $table->timestamps();
        });

        Schema::create('selection_process_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('selection_process_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note');
            $table->timestamps();
        });

        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action')->index();
            $table->string('auditable_type')->nullable();
            $table->unsignedBigInteger('auditable_id')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->index(['auditable_type', 'auditable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('selection_process_notes');
        Schema::dropIfExists('selection_processes');
        Schema::dropIfExists('contact_request_status_histories');
        Schema::dropIfExists('contact_requests');
        Schema::dropIfExists('blind_cv_profiles');
        Schema::dropIfExists('cv_analysis_results');
        Schema::dropIfExists('cv_uploads');
        Schema::dropIfExists('company_users');
        Schema::dropIfExists('company_profiles');
        Schema::dropIfExists('person_disability_profiles');
        Schema::dropIfExists('person_desired_conditions');
        Schema::dropIfExists('person_languages');
        Schema::dropIfExists('person_skills');
        Schema::dropIfExists('person_certifications');
        Schema::dropIfExists('person_work_experiences');
        Schema::dropIfExists('person_educations');
        Schema::dropIfExists('person_contact_data');
        Schema::dropIfExists('person_profiles');
    }
};
