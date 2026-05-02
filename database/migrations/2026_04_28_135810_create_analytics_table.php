<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            
            $table->timestamp('date')->index();
            
            $table->integer('workers_on_site')->default(0);
            $table->integer('safety_incidents')->default(0);
            $table->double('equipment_usage')->default(0);
            
            $table->double('daily_cost')->default(0);
            $table->double('daily_revenue')->default(0);
            
            $table->double('overall_progress')->default(0);
            
            $table->double('quality_score')->default(100);
            $table->integer('defect_count')->default(0);
            
            $table->timestamps();

            $table->unique(['project_id', 'date']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics');
    }
};
