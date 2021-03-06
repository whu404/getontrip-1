<?php
/**
 * 百科管理相关操作
 * author:fanyy
 */
class WikiapiController extends Base_Controller_Api{
     
     public function init() {
        parent::init();
    }
    
    public function listAction(){
         //第一条数据的起始位置，比如0代表第一条数据
        $start=isset($_REQUEST['start'])?$_REQUEST['start']:0;
       
        $pageSize=isset($_REQUEST['length'])?$_REQUEST['length']:20;

        $page=($start/$pageSize)+1;
         
        $sight_id =isset($_REQUEST['sight_id'])?intval($_REQUEST['sight_id']):1;
       
        $List = Keyword_Api::queryKeywords($page,$pageSize,array('sight_id' => $sight_id));  
        
        foreach ($List['list'] as $key => $val){
            $List['list'][$key]['statusName'] = Keyword_Type_Status::getTypeName($val["status"]);
            $List['list'][$key]['title']      = $val['name'];
        }
        
        $retList['recordsFiltered'] = $List['total'];
        $retList['recordsTotal'] = $List['total']; 
        $retList['data'] = $List['list']; 
        return $this->ajax($retList);
    }

    /**
     * 添加词条
     */
    function addAction(){
        $dbRet=Keyword_Api::addKeyword($_REQUEST);
        if ($dbRet) {
            return $this->ajax();
        }
        return $this->ajaxError();
    }

     /**
     * 编辑保存词条
     */
    function saveAction(){
        $id =isset($_REQUEST['id'])?$_REQUEST['id']:'';
        if($id==''){
            return $this->ajaxError();
        }
        $dbRet=Keyword_Api::editKeyword($id,$_REQUEST);
        if ($dbRet) {
            return $this->ajax();
        }
        return $this->ajaxError();
    }

     /**
     * 删除词条
     */
    function delAction(){
        $id =isset($_REQUEST['id'])?$_REQUEST['id']:'';
        if($id==''){
            return $this->ajaxError();
        }
        $dbRet=Keyword_Api::delKeyword($id);
        if ($dbRet) {
            return $this->ajax();
        }
        return $this->ajaxError();
    }
  

    
}