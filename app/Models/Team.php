<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'description',
        'department',
        'member_count',
        'leader',
        'status',
    ];

    protected $casts = [
        'member_count' => 'integer',
    ];
}
