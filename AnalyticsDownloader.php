<?php

set_time_limit(0);

echo "\e[1;31;40m[*] Wait ... ! Fetching Red Analytics Last Version." . PHP_EOL . PHP_EOL;


$api_path = "https://api.github.com/repos/redframework/red-analytics/releases/latest";

$options = [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER         => false,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING       => "",
    CURLOPT_USERAGENT      => "redframework",
    CURLOPT_AUTOREFERER    => true,
    CURLOPT_CONNECTTIMEOUT => 120,
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_MAXREDIRS      => 10,
    CURLOPT_SSL_VERIFYPEER => false
];


$curl_handler = curl_init($api_path);

curl_setopt_array($curl_handler, $options);


$json_info = curl_exec($curl_handler);

curl_close($curl_handler);

$json_info = json_decode($json_info, true);


$red_analytics_path = $json_info['assets'][0]['browser_download_url'];
$red_analytics_version = $json_info['tag_name'];



$dir = './';
$file_name = "Red Analytics V" . $red_analytics_version . ".jar";
$save_file_loc = $dir . $file_name;

$directory_scan = scandir($dir);

if (in_array($file_name, $directory_scan)){

    echo "\e[1;31;40m[*] Red Analytics is Already Up to Date !" . PHP_EOL . PHP_EOL;

} else {

    foreach ($directory_scan as $key => $value) {
        if (preg_match("/Red Analytics/", $value)){
            echo "\e[1;31;40m[*] Uninstalling Old Version ..." . PHP_EOL . PHP_EOL;
            unlink($value);
            echo "\e[1;31;40m[*] Old Version Uninstalled Successfully !" . PHP_EOL . PHP_EOL;
        }
    }

    if(file_put_contents( $save_file_loc, file_get_contents($red_analytics_path))) {
        echo "\e[1;31;40m[*] Red Analytics Version " . $red_analytics_version . " has Been Downloaded .";
    }
    else {
        echo "\e[1;31;40m[-] Download Failed ! Try to Run Script Later.";
    }

}


echo "\e[1;37;40m";


$handler = fopen("php://stdin", "r");
