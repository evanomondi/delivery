<?php
/*******************************************
@author : bastikikang 
@author email: bastikikang@gmail.com
@author website : http://bastisapp.com/kartero/
*******************************************/

/* ********************************************************
 *   Kartero
 *   August 17 2016 Version 1.0.0 initial release
 *   Last Update : 12 January 2017 Version 1.1.0 
 *   Last Update : 13 March 2017 Version 1.2.0  
 *   Last Update : 21 March 2017 Version 1.2.1  
 ***********************************************************/

define('YII_ENABLE_ERROR_HANDLER', false);
define('YII_ENABLE_EXCEPTION_HANDLER', false);
ini_set("display_errors",false);

// include Yii bootstrap file
require_once(dirname(__FILE__).'/yiiframework/yii.php');
$config=dirname(__FILE__).'/protected/config/main.php';

// create a Web application instance and run
Yii::createWebApplication($config)->run();