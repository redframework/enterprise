<?php
/** RedFramework
 * Validate AJAX Request
 * @author RedCoder
 * http://redframework.ir
 */

namespace App\Middlewares;


use Red\Base\Middleware;
use Red\RouterService\Router;

class AJAXRequest extends Middleware
{
    public function run(... $parameters)
    {
        $headers = getallheaders();
        if (isset($headers['AJAX-Request']) == TRUE) {
            return TRUE;
        } else {
            Router::defaultNoAccess();
            return FALSE;
        }
    }
}