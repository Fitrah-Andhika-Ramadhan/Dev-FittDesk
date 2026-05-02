<?php

namespace App\Enums;

enum MilestoneStatus: string {
    case PENDING = 'PENDING';
    case IN_PROGRESS = 'IN_PROGRESS';
    case COMPLETED = 'COMPLETED';
    case OVERDUE = 'OVERDUE';
}

