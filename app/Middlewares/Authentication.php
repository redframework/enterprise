<?php
/** RedFramework
 * Authentication Middleware
 * @author RedCoder
 * http://redframework.ir
 */

namespace App\Middlewares;


use Red\Base\Middleware;
use Red\SanitizeService\Sanitize;
use Red\SessionProvider\Session;
use Red\RouterService\Router;

class Authentication extends Middleware

{
    private static $authentication_variable;

    public function run(... $roles)
    {
        $roles = implode(",", $roles);

        $roles = Sanitize::sanitize($roles, "space");
        $roles = explode(",", $roles);

        // Set Your Authentication Variable (it will be A Session Variable)
        self::setAuthenticationVariable('user_logged_in', 'access_level');

        if (self::$authentication_variable == '' || self::$authentication_variable == NULL) {
            self::$authentication_variable = "guest";
        }

        if (!in_array(self::$authentication_variable, $roles)) {
            Router::defaultNoAccess();
            return FALSE;
        } else {
            return TRUE;
        }

    }


    public static function setAuthenticationVariable($first_dimension, $second_dimension = NULL, $third_dimension = NULL)
    {

        if (is_null($second_dimension) && is_null($third_dimension)) {
            if (Session::get($first_dimension) == FALSE) {
                Session::set('guest', $first_dimension);
            } else {
                self::$authentication_variable = Session::get($first_dimension);
            }
        } else if (!is_null($second_dimension)) {

            if (Session::get($first_dimension, $second_dimension) == FALSE) {
                Session::set('guest', $first_dimension, $second_dimension);
            } else {
                self::$authentication_variable = Session::get($first_dimension, $second_dimension);
            }

        } else if (!is_null($second_dimension) && !is_null($third_dimension)) {
            if (Session::get($first_dimension, $second_dimension, $third_dimension) == FALSE) {
                Session::set('guest', $first_dimension, $second_dimension, $third_dimension);
            } else {
                self::$authentication_variable = Session::get($first_dimension, $second_dimension, $third_dimension);
            }
        }

    }
}