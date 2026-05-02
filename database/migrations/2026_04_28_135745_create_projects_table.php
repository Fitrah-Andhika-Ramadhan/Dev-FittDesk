<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('location');
            $table->text('description')->nullable();
            
            $table->string('status')->default('PLANNING')->index();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->timestamp('completion_date')->nullable();
            
            $table->double('budget_amount');
            $table->double('spent_amount')->default(0);
            
            $table->string('project_manager')->nullable();
            $table->string('contractor')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
