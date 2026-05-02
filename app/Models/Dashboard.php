<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dashboard extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'title',
        'description',
        'widgets',
        'visibility',
    ];

    protected $casts = [
        'widgets' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
