<?php
/**
 * 城市管理相关操作
 * author:fanyy
 */
class KeywordapiController extends Base_Controller_Api{
     
     public function init() {
        parent::init();
    }
    
    public function listAction(){
         //第一条数据的起始位置，比如0代表第一条数据
        $start=isset($_REQUEST['start'])?$_REQUEST['start']:0;
       
        $pageSize=isset($_REQUEST['length'])?$_REQUEST['length']:PHP_INT_MAX;

        $page=($start/$pageSize)+1;
         
        // $sight_id =isset($_REQUEST['sight_id'])?$_REQUEST['sight_id']:'';

        //$status = isset($_REQUEST['status'])?intval($_REQUEST['status']):3;
        //
        $arrInfo =isset($_REQUEST['params'])?$_REQUEST['params']:array();
        
        $List =Keyword_Api::queryKeywords($page,$pageSize,$arrInfo);
        

        $tmpList=$List['list'];
        if (count($tmpList)>0) {
            $sightArray=array(); 
           
            for($i=0;$i<count($tmpList);$i++){ 

              //处理景点名称 
              $sight_id = $tmpList[$i]['sight_id']; 
              if (!array_key_exists($sight_id,$sightArray)) {  
                    //根据ID查找景点名称
                    $sightInfo =(array) Sight_Api::getSightById($sight_id);
                     
                    $tmpList[$i]['sight_name'] = isset($sightInfo['name'])?$sightInfo['name']:''; 
                    //添加到数组
                    $sightArray[$sight_id]=isset($sightInfo['name'])?$sightInfo['name']:'';  
              }
              else{ 
                   $tmpList[$i]['sight_name']  = $sightArray[$sight_id];
              } 
              
              $tmpList[$i]['audio'] = isset($tmpList[$i]['audio'])?$_SERVER['HTTP_HOST'].'/audio/'.$tmpList[$i]['audio']:'';

              //处理状态名称
              $tmpList[$i]['status_name'] = Keyword_Type_Status::getTypeName($tmpList[$i]['status']);
            }
        }
        $List['list'] =  $tmpList;

        $retList['recordsFiltered'] =$List['total'];
        $retList['recordsTotal'] = $List['total']; 
        $retList['data'] =$List['list']; 
        return $this->ajax($retList);
    }

    /**
     * 添加词条
     */
    function addAction(){ 
        $dbRet=Keyword_Api::addKeyword($_REQUEST);
        if (!empty($dbRet)) {
            return $this->ajax($dbRet);
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
          if (!empty($dbRet)) {
            return $this->ajax($dbRet);
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
  

      /**
     * 根据景点ID获取百科词条
     * @return [type] [description]
     */
    public function getKeywordsBySightIdAction(){
      
        $sight_id = isset($_REQUEST['sight_id'])? intval($_REQUEST['sight_id']) : 1;  
        $keywordsList = Keyword_Api::queryKeywords(1, PHP_INT_MAX,array('sight_id'=>$sight_id));
        return $this->ajax($keywordsList['list']);
    }

    /**
     * 修改某景点下的词条的权重
     * @return [type] [description]
     */
    public function changeWeightAction(){
       $id = isset($_REQUEST['id'])? intval($_REQUEST['id']) : 0; 
       $to = isset($_REQUEST['to'])? intval($_REQUEST['to']) : 0;
        
       $dbRet = Keyword_Api::changeWeight($id,$to);
       if ($dbRet) {
            return $this->ajax();
        }
        return $this->ajaxError();
    }

}