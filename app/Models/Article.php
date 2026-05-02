<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'category',
        'status',
        'author_id',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title) . '-' . uniqid();
            }
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
