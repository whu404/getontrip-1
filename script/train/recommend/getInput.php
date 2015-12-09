<?php
require_once "config.php";
const PRE_TOPIC = "topic_";

const PRE_DESC  = "desc_";

const PRE_WIKI  = "wiki_";

$fp_label = fopen(WORK_PATH.INDEX_LABEL,"w");

$listSight = new Sight_List_Meta();
$listSight->setFilterString("`level` != ''");
$listSight->setOrder("`id` asc");
$listSight->setPagesize(PHP_INT_MAX);
$arrSight  = $listSight->toArray();
foreach ($arrSight['list'] as $index => $sight){
    $strBuffer = "";
    
    //景点话题内容
    $listSightTopic = new Sight_List_Topic();
    $listSightTopic->setFilter(array('sight_id' => $sight['id']));
    $listSightTopic->setOrder("`id` asc");
    $listSightTopic->setPagesize(PHP_INT_MAX);
    $arrSightTopic  = $listSightTopic->toArray();
    foreach ($arrSightTopic['list'] as $sightTopic){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $sightTopic['topic_id']));
        $content = preg_replace( '/<.*?>/s', "", $objTopic->content.$objTopic->title.$objTopic->subtitle);
        $arrTopicVoc = Base_Util_String::ChineseAnalyzerAll($content);
        if(!empty($arrTopicVoc)){
            $strTopicVoc = implode("\t",$arrTopicVoc);
            $strBuffer .= sprintf(PRE_TOPIC."%d\t%s\r\n",$objTopic->id,$strTopicVoc);
        }
    }
    
    //景点描述内容
    if(!empty($sight['describe'])){
        $arrSightVoc = Base_Util_String::ChineseAnalyzerAll($sight['describe']);
        if(!empty($arrSightVoc)){
            $strSightVoc = implode("\t",$arrSightVoc);
            $strBuffer .= sprintf(PRE_DESC."%d\t%s\r\n",$sight['id'],$strSightVoc);
        }
    }
    
    if(!empty($strBuffer)){
        $index = $index + 1;
        
        $str = sprintf("%d\tsight:%d\r\n",$index,$sight['id']);
        fwrite($fp_label, $str);
        
        $fp_sight = fopen(WORK_PATH."$index","w");
        fwrite($fp_sight, $strBuffer);
        fclose($fp_sight);
    } 
    unset($arrSightTopic);   
}
unset($arrSight);

$listTag = new Tag_List_Tag();
$listTag->setFilter(array('type' => Tag_Type_Tag::GENERAL));
$listTag->setOrder("`id` asc");
$listTag->setPagesize(PHP_INT_MAX);
$arrTag  = $listTag->toArray();
foreach ($arrTag['list'] as $key => $tag){
    $strBuffer = "";
    
    //通用标签话题内容
    $listTagTopic = new Topic_List_Tag();
    $listTagTopic->setFilter(array('tag_id' => $tag['id']));
    $listTagTopic->setOrder("`id` asc");
    $listTagTopic->setPagesize(PHP_INT_MAX);
    $arrTagTopic  = $listTagTopic->toArray();
    foreach ($arrTagTopic['list'] as $tagTopic){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $tagTopic['topic_id']));
        $content = preg_replace( '/<.*?>/s', "", $objTopic->content.$objTopic->title.$objTopic->subtitle);
        $arrTopicVoc = Base_Util_String::ChineseAnalyzerAll($content);
        if(!empty($arrTopicVoc)){
            $strTopicVoc = implode("\t",$arrTopicVoc);
            $strBuffer .= sprintf(PRE_TOPIC."%d\t%s\r\n",$objTopic->id,$strTopicVoc);
        }
    }
    
    if(!empty($strBuffer)){
        $key = $index + $key + 1;
    
        $str = sprintf("%d\ttag:%d\r\n",$key,$tag['id']);
        fwrite($fp_label, $str);
    
        $fp_sight = fopen(WORK_PATH."$key","w");
        fwrite($fp_sight, $strBuffer);
        fclose($fp_sight);
    }
}
fclose($fp_label);