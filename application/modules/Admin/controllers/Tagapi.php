<?php
/**
 * 标签相关操作
 * author:fyy
 */
class TagapiController extends Base_Controller_Api{
     
     public function init() {
        parent::init();
    }
    
 
    /**
     * 标签list
     *  
     */    
    public function listAction(){  
        //第一条数据的起始位置，比如0代表第一条数据
        $start=isset($_REQUEST['start'])?$_REQUEST['start']:0; 
        $pageSize=isset($_REQUEST['length'])?$_REQUEST['length']:PHP_INT_MAX; 
        //$page=($start/$pageSize)+1;
         
        $arrParam = isset($_REQUEST['params'])?$_REQUEST['params']:array();
        
        $List=Tag_Api::getTagList(1, PHP_INT_MAX,$arrParam);
        
        $num    = 0;
        $arrRet = array();
        foreach ($List['list'] as $val){
            if($val['type'] == Tag_Type_Tag::NORMAL){
                continue;
            }
            $val['type_name'] = Tag_Type_Tag::getTypeName($val['type']);
            $arrRet[]         = $val;
            $num += 1;
        }
        
        $arrRet = array_slice($arrRet, $start, $pageSize);
    
        $retList['recordsFiltered'] =$num;
        $retList['recordsTotal'] = $num; 
        $retList['data'] =$arrRet;

    
		    return $this->ajax($retList);
         
    }

    public function saveAction()
    {   
      //判断是否有ID
       $arrPram = array();
       $id      = isset($_REQUEST['id'])?$_REQUEST['id']:'';
       $name    = isset($_REQUEST['name'])?$_REQUEST['name']:''; 
       $type    = isset($_REQUEST['type'])?intval($_REQUEST['type']):'';
       if(!empty($name)){
           $arrPram = array('name' => $name);
       }
       if(!empty($type)){
           $arrPram   = array_merge($arrPram,array('type' => $type));
       }
       /*$type_name     = isset($_REQUEST['type_name'])?trim($_REQUEST['type_name']):'';
       if(!empty($type_name)){
           $type      = Tag_Type_Tag::getTypeId($type_name);
           $arrPram   = array_merge($arrPram,array('type' => $type));
       }*/ 
       if($id!=""){
           $bRet = Tag_Api::editTag($id,$arrPram);
       }else{ 
           $bRet = Tag_Api::saveTag($arrPram);
       } 

        if($bRet){
            //根据名称返回标签信息 
            $tagInfo = Tag_Api::getTagByName($name);
            return $this->ajax($tagInfo);
        }
        return $this->ajaxError();
    }
    
    public function delAction(){
        //判断是否有ID
        $id=isset($_REQUEST['id'])?$_REQUEST['id']:''; 
        $bRet =Tag_Api::delTag($id);
        if($bRet){
            return $this->ajax();
        }
        return $this->ajaxError();
    }


    /**
     * 获取通用标签、二级分类信息  用于下拉框
     * @return [type] [description]
     */
    public function getTagListAction(){ 
        $str=$_REQUEST['query'];
        //最大值 PHP_INT_MAX  
        $List =Tag_Api::queryTagPrefix($str,1,PHP_INT_MAX,array('type'=>Tag_Type_Tag::GENERAL)); 
        $List2 =Tag_Api::queryTagPrefix($str,1,PHP_INT_MAX,array('type'=>Tag_Type_Tag::CLASSIFY)); 
        
        $List['list'] = array_merge($List['list'],$List2['list']);
        return $this->ajax($List["list"]);  
    }

    /**
     * 获取通用标签、二级分类信息  用于下拉框
     * @return [type] [description]
     */
    public function getTagGeneralListAction(){ 
        $str=$_REQUEST['query'];
        //最大值 PHP_INT_MAX  
        $List =Tag_Api::queryTagPrefix($str,1,PHP_INT_MAX,array('type'=>Tag_Type_Tag::GENERAL)); 
          
        return $this->ajax($List["list"]);  
    }

    /**
     * 根据景点获取通用标签信息list  
     * @return [type] [description]
    */
    public function getTagBySightAction(){ 
        $sightId=$_REQUEST['sightId'];  
        $tagArray = Tag_Api::getTagBySight($sightId);
        $allList=Tag_Api::getTagList(1, PHP_INT_MAX,array('type'=>Tag_Type_Tag::GENERAL));
        foreach ($allList['list'] as $key => $val){
          if (in_array($allList['list'][$key]['id'], $tagArray)) {
            $allList['list'][$key]['selected']=1;
          } 
        }
        return $this->ajax($allList['list']);    
    }
    
    public function saveRelationAction(){
        $firstId   = $_REQUEST['firstid'];
        $secondIds = isset($_REQUEST['secondid'])?$_REQUEST['secondid']:array();
        
        $ret = Tag_Api::editTagRelation($firstId, $secondIds);
        return $this->redirect("/admin/tag/edit?id=".$firstId);
    }
    
}