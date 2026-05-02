<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BugReport extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'severity',
        'status',
        'resolution_notes',
        'reported_by',
        'assigned_to',
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
