<?php
/** Red Framework
 * CSRF_Token Generation
 * CSRF_Token Verification
 * @author RedCoder
 * http://redframework.ir
 */

namespace App\Middlewares;

use Red\Base\Middleware;
use Red\InputProvider\Input;
use Red\SessionProvider\Session;
class CSRFToken extends Middleware
{

    public function run(... $parameters)
    {
        if(Input::post('CSRF_Token') == Session::Get('CSRF_Token')) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    public static function generate()
    {
        Session::Set(self::generateRandomString(200), 'CSRF_Token');
        return Session::Get('CSRF_Token');
    }


    public static function generateRandomString($length = 10)
    {
        return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,_-', ceil($length / strlen($x)))), 1, $length);
    }

}