<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LandingMedia extends Model
{
    use HasUuids;

    protected $fillable = [
        'type',
        'title',
        'description',
        'url',
        'thumbnail',
        'position',
        'featured',
    ];
}
