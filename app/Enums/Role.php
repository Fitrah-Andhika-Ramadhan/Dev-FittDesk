<?php

namespace App\Enums;

enum Role: string {
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case ADMIN = 'ADMIN';
    case MANAGER = 'MANAGER';
    case CONTRACTOR = 'CONTRACTOR';
    case VIEWER = 'VIEWER';
}

