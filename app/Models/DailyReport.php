<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'project_id',
        'project_name',
        'report_date',
        'weather',
        'workers_count',
        'equipment',
        'material_received',
        'activities',
        'issues',
        'photo_path',
        'status',
        'notes'
    ];

    protected $casts = [
        'report_date' => 'date',
        'workers_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
