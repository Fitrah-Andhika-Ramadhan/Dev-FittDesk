<?php

namespace App\Enums;

enum PhaseStatus: string {
    case NOT_STARTED = 'NOT_STARTED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case PAUSED = 'PAUSED';
    case COMPLETED = 'COMPLETED';
}

