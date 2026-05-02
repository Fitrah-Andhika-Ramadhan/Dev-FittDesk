<?php

namespace App\Enums;

enum BlockStatus: string {
    case NOT_STARTED = 'NOT_STARTED';
    case FOUNDATION = 'FOUNDATION';
    case STRUCTURE = 'STRUCTURE';
    case FINISHING = 'FINISHING';
    case COMPLETED = 'COMPLETED';
}

