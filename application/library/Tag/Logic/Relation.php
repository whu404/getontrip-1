<?php
class Tag_Logic_Relation extends Base_Logic{
    
    protected  $_logicTag;
    
    public function __construct(){
        $this->_logicTag = new Tag_Logic_Tag();
    }
    
    public function groupByTop($arrTags){
        //一级分类标签按历史、文化、科学、艺术排序，数组中为存放次序
        if(ENVIRON == 'dev'){
            $arrTemp   = array(
                '75' => array(),
                '11' => array(),
                '74' => array(),
                '83' => array(),              
            );
        }else{
            $arrTemp   = array(
                '75' => array(),
                '11' => array(),
                '74' => array(),
                '83' => array(),              
            );
        }
        $arrRet    = array();
        $limit_num = Base_Config::getConfig('showtag')->firstnum;
        foreach ($arrTags as $tag){
            $objTagRelation = new Tag_Object_Relation();
            $objTagRelation->fetch(array('classifytag_id' => $tag));
            if(!empty($objTagRelation->toptagId)){
                $arrTemp[$objTagRelation->toptagId][] = $tag;
            }
        }
        foreach ($arrTemp as $key => $val){
            if(count(array_unique($val)) == 1){
                $tmp  = array();
                $tag  = $this->_logicTag->getTagById($val[0]);
                if(!isset($tag['name'])){
                    continue;
                }
                $tmp['id']   = strval($key);
                $tmp['name'] = trim($tag['name']);
                $tmp['name'] = str_replace("其他", "", $tmp['name']);
                $arrRet[]  = $tmp;
            }elseif(count($val) >= $limit_num){
                $tmp  = array();
                $tag  = $this->_logicTag->getTagById($key);
                if(!isset($tag['name'])){
                    continue;
                }
                $tmp['id']   = strval($key);
                $tmp['name'] = trim($tag['name']);
                $arrRet[]  = $tmp;
            }
        }
        return $arrRet;
    }
    
    public function getTagRelation($topTagId, $page, $pageSize){
        $listTagRelation = new Tag_List_Relation();
        $listTagRelation->setFilter(array('toptag_id' => $topTagId));
        $listTagRelation->setPage($page);
        $listTagRelation->setPagesize($pageSize);
        return $listTagRelation->toArray();
    }
    
    public function editTagRelation($topTagId, $arrTagIds){
        $arrTags = $this->getTagRelation($topTagId, 1, PHP_INT_MAX);
        $ret     = true;
        foreach ($arrTags['list'] as $val){
            $objTagRelation = new Tag_Object_Relation();
            $objTagRelation->fetch(array('id' => $val['id']));
            $objTagRelation->remove();
        }
        
        foreach ($arrTagIds as $tagId){
            $objTagRelation = new Tag_Object_Relation();
            $objTagRelation->toptagId = $topTagId;
            $objTagRelation->classifytagId = $tagId;
            $ret = $objTagRelation->save();
        }
        return $ret;
    }
    
    public function getAllClassTags($page, $pageSize){
        $listTag = new Tag_List_Tag();
        $listTag->setFilter(array('type' => Tag_Type_Tag::TOP_CLASS));
        $listTag->setFields(array('id','name','type'));
        $listTag->setPage($page);
        $listTag->setPagesize(PHP_INT_MAX);
        $arrTag = $listTag->toArray();
        foreach ($arrTag['list'] as $key => $val){
             $sub = Tag_Api::getTagRelation($val['id'], 1, PHP_INT_MAX);
             foreach ($sub['list'] as $val){
                 $temp['id']   = $val['classifytag_id'];
                 $tag          = Tag_Api::getTagInfo($temp['id']);
                 $temp['name'] = $tag['name'];
                 $arrTag['list'][$key]['subtags'][] = $temp;                 
             }
        }
        return $arrTag;
    }
}