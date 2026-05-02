<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id')->index();
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->string('file_type');
            $table->string('file_url');
            $table->double('file_size');
            
            $table->string('doc_type')->index();
            
            $table->string('uploaded_by')->nullable();
            $table->timestamp('uploaded_at')->useCurrent();
            $table->integer('version')->default(1);
            
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
