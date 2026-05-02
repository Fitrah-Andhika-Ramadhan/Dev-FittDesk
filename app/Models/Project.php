<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'location',
        'description',
        'status',
        'start_date',
        'end_date',
        'completion_date',
        'budget_amount',
        'spent_amount',
        'project_manager',
        'contractor',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'completion_date' => 'datetime',
        'budget_amount' => 'decimal:2',
        'spent_amount' => 'decimal:2',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(Analytics::class);
    }

    public function sprs(): HasMany
    {
        return $this->hasMany(SPR::class);
    }

    public function dashboards(): HasMany
    {
        return $this->hasMany(Dashboard::class);
    }

    public function phases(): HasMany
    {
        return $this->hasMany(Phase::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }
}
