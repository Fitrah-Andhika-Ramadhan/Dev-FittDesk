<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->text('description');
            $table->string('priority')->default('MEDIUM'); // LOW, MEDIUM, HIGH, CRITICAL
            $table->string('status')->default('OPEN'); // OPEN, IN_PROGRESS, RESOLVED, CLOSED
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
