<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Unit extends Model
{
    use HasUuids;
    
    protected $guarded = [];

    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
