<?php

namespace App\Enums;

enum ProjectStatus: string {
    case PLANNING = 'PLANNING';
    case IN_PROGRESS = 'IN_PROGRESS';
    case ON_HOLD = 'ON_HOLD';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';
}

