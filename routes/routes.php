<?php


/*
 |--------------------------------------------------------------------------
 | Register Routes
 |--------------------------------------------------------------------------
 |
 | Example
 | Router::register("path/{param1}{?param2}{?param3}", "GET", "IndexController@Index")
 |
 | Call Closure Object
 | Router::register("view/{name}", "GET", function($name) {
 | echo 'Your Name:' . $name;
 | });
 |
 | Call Render View Directly
 | Router::register("view", "GET", function() {
 | \Red\View\View::render("Red.NoRoute");
 | });
 |
 | Do Not Register Routes From PUBLIC or Any Existing Directories.
 |
 */


use Red\RouterService\Router;


