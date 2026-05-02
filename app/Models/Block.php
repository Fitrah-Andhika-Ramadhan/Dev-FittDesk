<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Block extends Model
{
    use HasUuids;
    
    protected $guarded = [];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function phase()
    {
        return $this->belongsTo(Phase::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
