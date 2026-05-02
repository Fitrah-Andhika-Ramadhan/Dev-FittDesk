<?php

namespace App\Enums;

enum UnitStatus: string {
    case NOT_STARTED = 'NOT_STARTED';
    case FOUNDATION = 'FOUNDATION';
    case STRUCTURE = 'STRUCTURE';
    case INTERNAL_FINISHING = 'INTERNAL_FINISHING';
    case FINAL_FINISHING = 'FINAL_FINISHING';
    case READY = 'READY';
}

