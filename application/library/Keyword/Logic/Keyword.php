<?php
class Keyword_Logic_Keyword extends Base_Logic{
    
    protected $_fields;
    
    public function __construct(){
        $this->_fields = array('id','sight_id','name','url','create_time','update_time');
    }
    
    /**
     * 查询词条列表
     * @param integer $sight_id
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function queryKeywords($page, $pageSize,$status,$sight_id){
        $list  = new Keyword_List_Keyword();
        $arr   = array();
        if($status != Keyword_Type_Status::ALL){
            $arr['status'] = $status;
        }
        if(!empty($sight_id)){
            $arr['sight_id'] = $sight_id;
        }
        if(!empty($arr)){
            $list->setFilter($arr);
        }        
        $list->setPage($page);
        $list->setPagesize($pageSize);
        return $list->toArray();
    }
    
    /**
     * 添加词条信息
     * @param array $arrInfo
     * @return boolean
     */
    public function addKeywords($arrInfo){
        $bCheck = false;
        $obj    = new Keyword_Object_Keyword();
        foreach ($arrInfo as $key => $val){
            if(in_array($key,$this->_fields)){  
                $key = $this->getprop($key);              
                $obj->$key = $val;
                $bCheck    = true;
            }
        }
        if($bCheck){
            return $obj->save();
        }
        return false;
    }
    
    /**
     * 词条编辑
     * @param integer $id
     * @param array $arrInfo
     * @return boolean
     */
    public function editKeyword($id,$arrInfo){
        $bCheck = false;
        $obj    = new Keyword_Object_Keyword();
        $obj->fetch(array('id' => $id));
        foreach ($arrInfo as $key => $val){
            if(in_array($key,$this->_fields)){  
                $key = $this->getprop($key);              
                $obj->$key = $val;
                $bCheck    = true;
            }
        }
        if($bCheck){
            return $obj->save();
        }
        return false;
    }
    
    /**
     * 删除词条
     * @param integer $id
     * @return boolean
     */
    public function delKeyword($id){
        $obj    = new Keyword_Object_Keyword();
        $obj->fetch(array('id' => $id));
        return $obj->remove();
    }
    
    /**
     * 根据ID查询词条
     * @param integer $id
     * @return array
     */
    public function queryById($id){
        $obj = new Keyword_Object_Keyword();
        $obj->fetch(array('id' => $id));
        return $obj->toArray();
    }
    
    /**
     * 根据词条ID获取景点ID
     * @param unknown $keywordId
     * @return number
     */
    public function getSightId($keywordId){
        $obj = new Keyword_Object_Keyword();
        $obj->fetch(array('id' => $keywordId));
        return $obj->sightId;
    }
}