<?php
/** RedCoder Framework
 * Bootstrap Class
 *
 * This Class Will Run Application
 * @author RedCoder
 * http://redframework.ir
 */

namespace App\Bootstrap;

use Red\DebugBar\DebugBar;
use Red\Debugger\Debugger;
use Red\EnvironmentProvider\Environment;
use Red\Red;
use Red\RouterService\Router;
use Red\PostEncryption\PostEncrypt;
use Red\SessionProvider\Session;
use Red\InputProvider\Input;
use Red\CookieProvider\Cookie;
use Red\FilterService\Filter;
use Red\SanitizeService\Sanitize;
use Red\ValidateService\Validate;
use Red\View\View;


/**
 * Class Bootstrap
 * @package App
 */
class Bootstrap
{
    private static $start_time;
    private static $execution_time;
    private static $singleton = 0;

    public function __construct()
    {
        if (self::$singleton != 0) {
            $error_no = "Singleton Class";
            $error_message = "Singleton Class 'Bootstrap' instanced twice !";

            Red::generateError($error_no, $error_message);

        } else {
            self::$singleton = 1;
        }

        self::$start_time = microtime(true);

        Environment::initialize();

        if (Red::getPhpConfig() === TRUE) {
            require_once ROOT_PATH . 'config' . DS . 'config.php';
        }
        $project_state = strtolower(Environment::get('PROJECT', 'State'));


        if ($project_state == "maintenance") {
            Environment::set("DEBUG", "Errors", "off");
            Environment::set("DEBUG", "DebugBar", "off");
        } else if ($project_state == "break" && $_SERVER['REMOTE_ADDR'] != Environment::get('PROJECT', 'SupervisorIP')) {
            Environment::set("DEBUG", "Errors", "off");
            Environment::set("DEBUG", "DebugBar", "off");
            View::render("Red.MaintenanceBreak");
            exit();
        }

        return TRUE;
    }


    public function run()
    {

        if (Environment::get('PROJECT', 'Language') == 'fa') {
            header('Content-Type: text/html; charset=UTF-8');
        }

        if (Environment::get('DEBUG', 'Errors') == 'on') {

            // Initialize Debugger
            Debugger::enable();

        } else {
            Debugger::disable();
        }

        if (Environment::get('PROJECT', 'Encryption') == 'yes' && !extension_loaded('openssl')) {
            $error_no = 'PHP Extension';
            $error_message = 'OpenSSL Extension is Disabled';
            Red::generateError($error_no, $error_message);
        }

        date_default_timezone_set(Environment::get('PROJECT', 'Timezone'));

        require_once ROOT_PATH . 'config' . DS . 'session.php';
        Session::initSession();

        header("Web-Application: Red Framework");

        Input::initInput();

        // Set Up Custom Validation Roles
        Validate::initialize();

        // Set Up Custom Sanitization Roles
        Sanitize::initialize();

        // Set Up Custom Filter Roles
        Filter::initialize();


        if (Cookie::get('language') == FALSE) {
            Cookie::set('language', Environment::get('PROJECT', 'Language'), 7);
        }

        DebugBar::addMessage("Red Framework The Chosen One");


        if (Environment::get('PROJECT', 'Encryption') == 'on') {
            // Create the session RSA key pair if doesn't exists.
            PostEncrypt::$RSA_key_length = 1024;

            PostEncrypt::$openssl_config = ROOT_PATH . 'vendor' . DS . 'redframework' . DS . 'enterprise-core' . DS . 'src' . DS . 'Red' . DS . 'PostEncryption' . DS . 'OpenSSL' . DS . 'OpenSSL.cnf';
            if (!isset($_SESSION['RSA_Private_key'])) {
                PostEncrypt::createSessionKeys();
            }

            if (isset($_POST['RedCryption'])) {

                PostEncrypt::decodeForm();

            }
        }


        if (Input::get('url') != NULL && Input::get('url') != '') {
            $url = mb_strtolower(Input::get('url'));
        } else {
            $url = '/';
        }

        require_once ROOT_PATH . 'config' . DS . 'router.php';
        require_once ROOT_PATH . 'routes' . DS . 'routes.php';
        Router::route($url);

    }


    public function __destruct()
    {


        self::$execution_time = (microtime(true) - self::$start_time) * 1000;
        self::$execution_time = substr(self::$execution_time, 0, strpos(self::$execution_time, ".") + 3);

        if (Environment::get('DEBUG', 'DebugBar') == 'on') {

            $debug_bar = new DebugBar();
            $debug_bar->render();

        }
    }


    public static function getExecutionTime()
    {
        return self::$execution_time;
    }


}