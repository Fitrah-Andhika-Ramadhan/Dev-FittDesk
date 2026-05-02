<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Analytics extends Model
{
    use HasUuids;

    protected $table = 'analytics';

    protected $fillable = [
        'project_id',
        'date',
        'workers_on_site',
        'safety_incidents',
        'equipment_usage',
        'daily_cost',
        'daily_revenue',
        'overall_progress',
        'quality_score',
        'defect_count',
    ];

    protected $casts = [
        'date' => 'datetime',
        'equipment_usage' => 'decimal:2',
        'daily_cost' => 'decimal:2',
        'daily_revenue' => 'decimal:2',
        'overall_progress' => 'decimal:2',
        'quality_score' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
