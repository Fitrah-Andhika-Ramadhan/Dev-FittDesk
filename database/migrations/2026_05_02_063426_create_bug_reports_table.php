<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bug_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('severity')->default('MEDIUM'); // LOW, MEDIUM, HIGH, CRITICAL
            $table->string('status')->default('OPEN'); // OPEN, INVESTIGATING, FIXED, CLOSED
            $table->text('resolution_notes')->nullable();
            $table->foreignUuid('reported_by')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bug_reports');
    }
};
