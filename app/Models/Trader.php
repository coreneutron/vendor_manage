<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trader extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'date',
        'company_name',
        'routing_id',
        'prefecture_id',
        'site_type',
        'cell_content',
        'first_representative',
        'correspondence_situation',
        'mobilephone_number',
        'telephone_number'
    ];
}
