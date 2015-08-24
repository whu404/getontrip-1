<?php
class Sight_Logic_Sight{
    
    protected $modelSight;
    
    protected $logicTopic;
    
    const DEFAULT_HOT_PERIOD = 30;
    
    const REDIS_TIMEOUT = 3600;
    
    const ORDER_HOT = 1;
    
    const ORDER_NEW = 2;
    
    public function __construct(){
        $this->modelSight = new SightModel();
        $this->logicTopic = new Topic_Logic_Topic();
    }
    
    /**
     * 根据景点ID获取景点详情
     * @param integer $sightId
     * @return array
     */
    public function getSightById($sightId){
        $arr = $this->modelSight->getSightById($sightId);
        return $arr;
    }
    
    /**
     * 根据景点ID获取景点及话题信息，支持带标签筛选及热度的时间范围设置
     * @param integer $sightId
     * @param integer $page
     * @param integer $pageSize
     * @param string $strTags
     * @return array
     */
    public function getSightDetail($sightId,$page,$pageSize,$order,$strTags=''){
        $arrRet  = array();
        $redis   = Base_Redis::getInstance();
        if(self::ORDER_NEW == $order){
             $arrRet =  $this->logicTopic->getNewTopic($sightId,self::DEFAULT_HOT_PERIOD,$page,$pageSize,$strTags);                                          
        }else{
             $arrRet =  $this->logicTopic->getHotTopic($sightId,self::DEFAULT_HOT_PERIOD,$page,$pageSize,$strTags);                     
        }
        $logicTag = new Tag_Logic_Tag();
        foreach ($arrRet as $key => $val){            
            $arrRet[$key]['tags'] = $logicTag->getTopicTags($val['id']);
        }      
        return $arrRet;
    }
    
    /**
     * 获取景点列表
     * @param integer $page
     * @param integer $pageSize
     * @param integer $cityId
     * @return array
     */
    public function getSightListByCity($page,$pageSize,$cityId){
        $arrRet = array();
        if(empty($cityId)){
            $arrSight = $this->modelSight->getSightList($page,$pageSize);
        }else{
            $arrSight = $this->modelSight->getSightByCity($page,$pageSize,$cityId);
        }
        foreach ($arrSight as $index => $val){
            $arrRet[$index]['id']   = $val['id'];
            $arrRet[$index]['name'] = $val['name'];
        }
        return $arrRet;
    }
    
    /**
     * 获取景点列表
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getSightList($page,$pageSize,$status){
        $arr = $this->modelSight->getSightList($page,$pageSize,$status);
        $num = $this->modelSight->getSightNum($status);
        $arrRet['page']     = $page;
        $arrRet['pagesize'] = $pageSize;
        $arrRet['pageall']  = ceil($num/$pageSize);
        $arrRet['total']    = $num;
        $arrRet['list']     = $arr;
        return $arrRet;
    }
    
    /**
     * 根据话题ID获取景点id数组
     * @param integer $topicId
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getSightByTopic($topicId,$page=1,$pageSize=PHP_INT_MAX){
        $listSightTopic = new Sight_List_Topic();
        $listSightTopic->setFields(array('sight_id'));
        $listSightTopic->setFilter(array('topic_id' => $topicId));
        $listSightTopic->setPage($page);
        $listSightTopic->setPagesize($pageSize);
        $ret = $listSightTopic->toArray();
        return $ret;
    }
    
    /**
     * 根据条件数组筛选景点
     * @param array $arrInfo，条件数组，如:array('id'=1);
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function querySights($arrInfo,$page,$pageSize){
        $ret   = $this->modelSight->query($arrInfo,1,PHP_INT_MAX);
        $num   = count($ret);
        $arrRet['page']     = $page;
        $arrRet['pagesize'] = $pageSize;
        $arrRet['pageall']  = ceil($num/$pageSize);
        $arrRet['total']    = $num;
        $arrRet['list']     = array_slice($ret,($page-1)*$pageSize,$pageSize);
        return $arrRet;
    }
    
    /**
     * 对景点中的标题内容进行模糊查询
     * @param string $query
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function search($query,$page,$pageSize,$x='',$y=''){
        $redis = Base_Redis::getInstance();
        $ret = $this->modelSight->search($query, $page, $pageSize,$x,$y);
        foreach ($ret as $key => $val){
            $ret[$key]['topicNum'] = $redis->zSize(Sight_Keys::getSightTopicKey($val['id']));
        }
        return $ret;
    }
    
    /**
     * 根据ID删除景点信息
     * @param integer $id
     * @return boolean
     */
    public function delSight($id){
        $ret = $this->modelSight->delSight($id);
    
        //删除景点话题关系
        $redis = Base_Redis::getInstance();
        $listSightTopic = new Sight_List_Topic();
        $listSightTopic->setFilter(array('sight_id' => $id));
        $listSightTopic->setPagesize(PHP_INT_MAX);
        $arrSightTopic = $listSightTopic->toArray();
        foreach ($arrSightTopic['list'] as $val){
            $objSightTopic = new Sight_Object_Topic();
            $objSightTopic->fetch(array('id' => $val['id']));
            $objSightTopic->remove();
        }
        //删除redis缓存
        $redis->delete(Sight_Keys::getSightTopicKey($id));
        
        //删除景点词条
        $listKeyword = new Keyword_List_Keyword();
        $listKeyword->setFilter(array('sight_id' => $id));
        $listKeyword->setPagesize(PHP_INT_MAX);
        $arrKeyword  = $listKeyword->toArray();
        foreach ($arrKeyword['list'] as $val){
            $objKeyword = new Keyword_Object_Keyword();
            $objKeyword->fetch(array('id' => $val['id']));
            $objKeyword->remove();
        }
        $keys = $redis->keys(Wiki_Keys::getWikiInfoName($id, '*'));
        $keys = array_merge($keys,$redis->keys(Wiki_Keys::getWikiCatalogName($id, '*','*')));
        foreach ($keys as $key){
            $redis->delete($key);
        }
        return $ret;
    }
    
    /**
     * 根据$arrInfo添加景点
     * @param array $arrInfo:array('name' => 'xxx','level' => 'xxx');
     * @return integer:更新影响的行数，返回非零值正确
     */
    public function addSight($arrInfo){
        $ret = $this->modelSight->addNewSight($arrInfo);
        if($ret && isset($arrInfo['status']) && ($arrInfo['status'] == Sight_Type_Status::PUBLISHED)){
            $data = $this->modelSight->query(array('name' => $arrInfo['name']), 1, 1);
            $conf = new Yaf_Config_INI(CONF_PATH. "/application.ini", ENVIRON);
            $url  = $_SERVER["HTTP_HOST"]."/InitData?sightId=".$data[0]['id']."&type=All&num=".$conf['thirddata'] ['initnum'];
            $http = Base_Network_Http::instance()->url($url);
            $http->timeout(1);
            $http->exec();
        }
        return $ret; 
    }
    
    /**
     * 根据$_updateData更新景点信息
     * @param integer $sightId
     * @param array $_updateData: array('describe' =>'xxx','name' => 'xxx');
     * @return integer:更新影响的行数，返回非零值正确
     */
    public function editSight($sightId,$_updateData){
        $ret = $this->modelSight->eddSight($sightId, $_updateData);
        if($ret && isset($_updateData['status']) && ($_updateData['status'] == Sight_Type_Status::PUBLISHED)){
            $data = $this->modelSight->query(array('id' => $sightId), 1, 1);
            $conf = new Yaf_Config_INI(CONF_PATH. "/application.ini", ENVIRON);
            $url  = $_SERVER["HTTP_HOST"]."/InitData?sightId=".$data[0]['id']."&type=All&num=".$conf['thirddata'] ['initnum'];
            $http = Base_Network_Http::instance()->url($url);
            $http->timeout(1);
            $http->exec();
        }
        return $ret;
    }
    
    /**
     * 获取景点的话题数
     * @param integer $sightId
     * @return integer
     */
    public function getTopicNum($sightId='',$arrConf = array()){
        $count = 0;
        $listSightTopic = new Sight_List_Topic();
        if(!empty($sightId)){
            $listSightTopic->setFilter(array('sight_id' => $sightId));
        }
        $listSightTopic->setFields(array('topic_id'));
        $listSightTopic->setPagesize(PHP_INT_MAX);
        $arr = $listSightTopic->toArray();
        foreach ($arr['list'] as $topicId){
            $objTopic = new Topic_Object_Topic();
            $arrFilter = array_merge(array('id' => $topicId['topic_id']),$arrConf);
            $objTopic->fetch($arrFilter);
            if(isset($objTopic->id)){
                $count += 1;
            }
        }
        return $count;
    }
    
    /**
     * 获取景点词条数
     * @param integer  $sightId
     * @return integer
     */
    public function getKeywordNum($sightId){
        $listKeyword = new Keyword_List_Keyword();
        $listKeyword->setFilter(array('sight_id' => $sightId));
        return intval($listKeyword->getTotal());
    }
    
    /**
     * 根据条件获取景点数量
     * @param array $arrInfo
     * @return integer
     */
    public function getSightsNum($arrInfo){
        return $this->modelSight->getSightNumByWhere($arrInfo);
    }
    
    /**
     * 检查所给的景点名是否存在
     * @param string $name
     */
    public function checkSightName($name){
        $ret = $this->querySights(array('name'=>$name), 1, 1);
        if(empty($ret['list'])){
            return false;
        }
        return true;
    }
}