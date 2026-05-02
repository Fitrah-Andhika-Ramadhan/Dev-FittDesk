<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            $table->uuid('phase_id')->index();
            
            $table->string('name');
            $table->string('block_code');
            
            $table->integer('unit_count')->default(0);
            $table->integer('floor_count')->default(0);
            
            $table->double('progress')->default(0);
            $table->string('status')->default('NOT_STARTED')->index();
            
            $table->timestamps();

            $table->unique(['project_id', 'block_code']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('phase_id')->references('id')->on('phases')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocks');
    }
};
