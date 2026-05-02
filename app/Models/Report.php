<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Report extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'report_type',
        'data',
    ];

    protected $casts = [
        'data' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
