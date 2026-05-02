<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->uuid('project_id')->index(); // Assuming there's a projects table or just indexing
            $table->string('project_name')->nullable();
            $table->date('report_date');
            $table->string('weather')->nullable();
            $table->integer('workers_count')->default(0);
            $table->text('equipment')->nullable();
            $table->text('material_received')->nullable();
            $table->text('activities')->nullable();
            $table->text('issues')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('status')->default('DRAFT'); // DRAFT, SUBMITTED, APPROVED
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
