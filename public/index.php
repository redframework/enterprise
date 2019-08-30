<?php

use App\Bootstrap\Bootstrap;

if (defined('php_development_server')) {
    require_once 'vendor/autoload.php';
    require_once 'config/path.php';
    require_once 'vendor/redframework/enterprise-core/src/Red/Helpers/Helpers.php';
} else {
    require_once '../vendor/autoload.php';
    require_once '../config/path.php';
    require_once '../vendor/redframework/enterprise-core/src/Red/Helpers/Helpers.php';
}


$Bootstrap = new Bootstrap();
$Bootstrap->run();
