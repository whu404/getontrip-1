<?php
/**
 * 新建编辑 话题
 * @author fanyy
 *
 */
class EditAction extends Yaf_Action_Abstract {
    public function execute() {

       $action  = isset($_REQUEST['action'])?$_REQUEST['action']:'add'; 
        
 
        //获取普通标签
        $normalTag = Tag_Api::getTagList(1, PHP_INT_MAX, array('type' => Tag_Type_Tag::NORMAL));
        $normalTag=$normalTag['list'];

        //获取通用标签
        $generalTag = Tag_Api::getTagList(1, PHP_INT_MAX, array('type' => Tag_Type_Tag::GENERAL));
        $generalTag = $generalTag['list']; 

        //获取分类标签
        $classifyTag = Tag_Api::getAllClassTags(1, PHP_INT_MAX);
        $classifyTag = $classifyTag['list']; 

        //来源分组
        $groupList = Source_Api::listType(1,PHP_INT_MAX,array());
        $this->getView()->assign('groupList', $groupList['list']);
        
        
        $sightList=array();

        $postid = isset($_REQUEST['id']) ? $_REQUEST['id'] : '0';
       
        $postInfo=Topic_Api::getTopicById($postid); 

        if(empty($postInfo)){
            $action='add';

            //处理传递过来的景点
            $sight_id  = isset($_REQUEST['sight_id'])?intval($_REQUEST['sight_id']):'';
            if($sight_id!=''){
               $sight=Sight_Api::getSightById($sight_id);
               array_push($sightList,$sight); 
            } 
            $sightSelected = 1;

        }else{
 
           //处理状态值  
           $postInfo["statusName"] = Topic_Type_Status::getTypeName($postInfo["status"]);  
          
           //处理被选中的标签
            $tagSelected=$postInfo['tags']; 
            $tag_id_array=array();
            for($i=0; $i<count($tagSelected); $i++) {
            	array_push($tag_id_array, $tagSelected[$i]['tag_id']);
            }
            for($i=0; $i<count($normalTag); $i++) {   
                if(in_array($normalTag[$i]["id"],$tag_id_array)){ 
                    $normalTag[$i]["selected"]="selected";
                }
            }
            for($i=0; $i<count($classifyTag); $i++) {
                $subtags =  $classifyTag[$i]['subtags'];
                for ($j=0; $j < count($subtags); $j++) { 
                    if(in_array($subtags[$j]["id"],$tag_id_array)){ 
                        $subtags[$j]["selected"]="selected";
                    }
                } 
                $classifyTag[$i]['subtags']=$subtags;
            }
            for($i=0; $i<count($generalTag); $i++) {    
                if(in_array($generalTag[$i]["id"],$tag_id_array)){ 
                    $generalTag[$i]["selected"]="selected";
                }  
            }

            //处理所选景点
            $sightSelectedList=$postInfo['sights']; 
            if (count($sightSelectedList)>0) {
                $sightSelected = 1;
            }else{
                $sightSelected = 0;
            } 
            for($i=0; $i<count($sightSelectedList); $i++) {
                $sight=Sight_Api::getSightById($sightSelectedList[$i]['sight_id']);
                array_push($sightList,$sight);
            } 

            //处理来源名称、类型
            $sourceInfo = Source_Api::getSourceInfo($postInfo['from']);
            $postInfo["fromName"]=$sourceInfo['name'];
            $postInfo["fromType"]=empty($sourceInfo['url'])?3:$sourceInfo['type'];

  
            //处理图片名称 分割为hash 和 img_type 
            if(!empty($postInfo["image"])){
               $img=Base_Image::getImgParams($postInfo["image"]);
               $postInfo["img_hash"] = $img['img_hash'];
               $postInfo["img_type"] = $img['img_type'];
            }  

            //处理正文的英文标点
            $englishSymbol = Base_Util_String::englishSymbol($postInfo["content"]);
            $this->getView()->assign('englishSymbol', $englishSymbol);
            $this->getView()->assign('post', $postInfo);
           

         }
         
        
        /*$sourceList = Source_Api::searchSource(array("type"=>2),1, PHP_INT_MAX);
        $sourceList=$sourceList['list']; */
        $sourceList =  Source_Api::getHotSource();


        if($action==Admin_Type_Action::ACTION_VIEW){
            $this->getView()->assign('disabled', 'disabled');
        } 
        
        

        $this->getView()->assign('sightList', $sightList);
        $this->getView()->assign('sourceList', $sourceList);
        $this->getView()->assign('tag_id_array', $tag_id_array);
        $this->getView()->assign('action', Admin_Type_Action::getTypeName($action));
        $this->getView()->assign('classifyTag',$classifyTag);
        $this->getView()->assign('normalTag', $normalTag);
        $this->getView()->assign('generalTag',$generalTag);   
        $this->getView()->assign('sightSelected',$sightSelected);
    }
}
