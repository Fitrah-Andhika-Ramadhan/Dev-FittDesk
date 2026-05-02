<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Document extends Model
{
    use HasUuids;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'file_type',
        'file_url',
        'file_size',
        'doc_type',
        'uploaded_by',
        'uploaded_at',
        'version',
    ];

    protected $casts = [
        'file_size' => 'decimal:2',
        'uploaded_at' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
