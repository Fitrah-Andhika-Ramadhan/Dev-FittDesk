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
        Schema::create('landing_media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type'); // image or video
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('url');
            $table->string('thumbnail')->nullable();
            $table->integer('position')->default(0);
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_media');
    }
};
