<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order');
            
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            
            $table->double('progress')->default(0); 
            $table->string('status')->default('NOT_STARTED')->index();
            
            $table->timestamps();

            $table->unique(['project_id', 'order']);
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phases');
    }
};
