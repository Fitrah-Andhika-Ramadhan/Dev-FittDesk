<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $table = 'company_profiles';

    protected $fillable = [
        'company_name',
        'description',
        'website',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'logo_url',
        'mission',
        'vision',
    ];
}
