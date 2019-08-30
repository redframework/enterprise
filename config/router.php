<?php

use Red\RouterService\Router;


/*
|--------------------------------------------------------------------------
| Default Route
|--------------------------------------------------------------------------
|
| Default Route will Be Used when No Route Exist
| You Should Set this On your Not Found View.
|
*/

    Router::setDefaultRoute(function () {
        http_response_code('404');
        \Red\View\View::render("Red.NotFoundError");
    });


    /*
    |--------------------------------------------------------------------------
    | Default No Access
    |--------------------------------------------------------------------------
    |
    | If Access Function Return FALSE
    | User will Be Redirect to Access Error View.
    |
    */

    Router::setDefaultNoAccess('Red.AccessError');


    /*
    |--------------------------------------------------------------------------
    | Access Error for Web Server
    |--------------------------------------------------------------------------
    |
    | This path will Be Routed when Web Server Give Access Error.
    | WARNING!
    | Do Not Change or Remove this Route.
    |
    */

    Router::register('error/403', 'GET,POST,PUT,PATCH,DELETE', function (){
        http_response_code('403');
        \Red\View\View::render("Red.AccessError");
    }, 'All');


    /*
    |--------------------------------------------------------------------------
    | Captcha Code Regeneration
    |--------------------------------------------------------------------------
    |
    | This route will be Used for Captcha Regeneration (AJAX Request)
    | WARNING !
    | Do Not CHANGE or REMOVE this Route.
    |
    */

    Router::register('new-captcha', 'GET', function (){
        echo \Red\CaptchaService\Captcha::CaptchaRegenerateAPI();
    }, ["AJAXRequest"]);