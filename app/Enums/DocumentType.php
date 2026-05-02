<?php

namespace App\Enums;

enum DocumentType: string {
    case SPR = 'SPR';
    case BLUEPRINT = 'BLUEPRINT';
    case CONTRACT = 'CONTRACT';
    case PERMIT = 'PERMIT';
    case REPORT = 'REPORT';
    case INSPECTION = 'INSPECTION';
    case CERTIFICATE = 'CERTIFICATE';
    case INVOICE = 'INVOICE';
    case OTHER = 'OTHER';
}

