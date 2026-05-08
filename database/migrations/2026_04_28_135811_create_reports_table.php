<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            
            $table->string('title');
            $table->text('description')->nullable();
            
            $table->string('report_type')->index();
            
            if (config('database.default') === 'sqlite') {
                $table->text('data'); // sqlite json fallback
            } else {
                $table->json('data');
            }
            
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
