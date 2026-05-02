<?php

namespace App\Enums;

enum SaleStatus: string {
    case AVAILABLE = 'AVAILABLE';
    case RESERVED = 'RESERVED';
    case SOLD = 'SOLD';
}

