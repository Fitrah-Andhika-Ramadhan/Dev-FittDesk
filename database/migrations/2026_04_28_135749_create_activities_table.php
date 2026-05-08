<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            $table->uuid('phase_id')->nullable();
            $table->uuid('block_id')->nullable();
            $table->uuid('user_id')->index(); // Changed from string to uuid to fix Postgres foreign key constraints
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('activity_type')->index();
            
            $table->timestamps(); // Using timestamps instead of just created_at for standard laravel models.

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            // Assuming users table id is uuid
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // phases and blocks might be deleted, so we just set null
            $table->foreign('phase_id')->references('id')->on('phases')->onDelete('set null');
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
