<?php
/**
 * 抓取视频、书籍、百科数据脚本,有三个参数:类型 景点ID 条数
 * 类型取值范围：Book Video Wiki All
 * 如果景点ID为空或-1,则取所有景点数据
 * 如果条数为空或-1,则取该景点下的所有数据
 */
require_once("../env.inc.php");
$arrTypes = array("Book","Video","Wiki","All");
if(count($argv) < 2){
    print "参数错误!Usage:Run.php 类型 景点ID 条数\r\n";
    return 0;
}
if(!in_array(trim($argv[1]),$arrTypes)){
    print "类型错误!只有三种类型：Book Video Wiki All\r\n";
    return 0;
}
$type      = isset($argv[1])?trim($argv[1]):'All';
$sightId   = isset($argv[2])?intval($argv[2]):-1;
$num       = isset($argv[3])?intval($argv[3]):-1;

$conf    = new Yaf_Config_INI(CONF_PATH. "/application.ini", ENVIRON);
$url  = $conf['web']['root']."/InitData?type=$type";
if(!empty($sightId) && ($sightId !== -1)){
    $url .= "&sightId=$sightId";
}
if(!empty($num) && ($num !== -1)){
    $url .= "&num=$num";
}
$http = Base_Network_Http::instance()->url($url)->exec();