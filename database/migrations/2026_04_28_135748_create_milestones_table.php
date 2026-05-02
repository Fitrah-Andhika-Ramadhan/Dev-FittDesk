<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->string('status')->default('PENDING')->index();
            $table->string('priority')->default('MEDIUM');
            
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('milestones');
    }
};
