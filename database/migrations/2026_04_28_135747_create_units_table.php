<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('block_id')->index();
            $table->uuid('project_id');
            
            $table->string('unit_code');
            $table->string('unit_type');
            $table->integer('floor')->default(1);
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('land_area', 10, 2)->default(0);
            $table->decimal('building_area', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            
            $table->string('sale_status')->default('AVAILABLE')->index();
            $table->string('buyer_name')->nullable();
            $table->string('buyer_email')->nullable();
            $table->string('buyer_phone')->nullable();
            
            $table->double('progress')->default(0);
            $table->string('status')->default('NOT_STARTED');
            
            $table->timestamps();

            $table->unique(['block_id', 'unit_code']);
            $table->foreign('block_id')->references('id')->on('blocks')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
