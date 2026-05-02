<?php

namespace App\Enums;

enum NotificationType: string {
    case MILESTONE_DUE = 'MILESTONE_DUE';
    case MILESTONE_OVERDUE = 'MILESTONE_OVERDUE';
    case BUDGET_ALERT = 'BUDGET_ALERT';
    case SAFETY_ALERT = 'SAFETY_ALERT';
    case DOCUMENT_UPDATED = 'DOCUMENT_UPDATED';
    case NEW_ACTIVITY = 'NEW_ACTIVITY';
    case SYSTEM_ALERT = 'SYSTEM_ALERT';
}

