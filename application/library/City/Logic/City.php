<?php
class City_Logic_City{
    
    const HOTPERIOD = 30;
    
    protected $_modeSight;
    
    public function __construct(){
        $this->_modeSight = new SightModel();
    }   
    
    /**
     * 根据城市ID获取其经纬度
     * @param integer $cityId
     * @return array
     */
    public function getCityLoc($cityId){
        $objCity = new City_Object_City();
        $objCity->fetch(array('id' => $cityId));
        if(!empty($objCity->id)){
            return array(
                'x' => $objCity->x,
                'y' => $objCity->y,
            );
        }
        return array();
    }
    
    /**
     * 根据城市ID获取城市信息，包含景点及话题信息，景点按话题热度排序
     * @param integer $cityId
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getCityDetail($cityId,$page,$pageSize){
        $arrHot     = array();
        $logicTopic = new Topic_Logic_Topic();
        $redis      = Base_Redis::getInstance();
        $ret        = City_Api::getCityById($cityId);
        $arrSight   = $this->_modeSight->getSightByCity($page, $pageSize, $cityId);
        foreach ($arrSight as $key => $val){
            $ret    = $redis->sMembers(Sight_Keys::getSightTopicKey($val['id']));
            $hot    = 0;
            foreach ($ret as $topicId){
                $hot += $logicTopic->getTopicHotDegree($topicId, self::HOTPERIOD);
            }
            $arrHot[] = $hot;     
            $arrSight[$key]['image']  = Base_Image::getUrlByName($val['image']);
            $arrSight[$key]['topics'] = count($redis->sMembers(Sight_Keys::getSightTopicKey($val['id'])));
        }
        array_multisort($arrHot, SORT_DESC , $arrSight);
        return $arrSight;
    }
    
    /**
     * 获取城市信息
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getCityInfo($page, $pageSize,$filter=''){
        $arrHot = array();
        if(($page == 1)&&(empty($filter)||(strtoupper($filter) == 'A'))){
            $arrHot = $this->getHotCity();
        }
        if($pageSize-count($arrHot) > 0){
            $listCity = new City_List_City();
            $strFilter = "`cityid` = 0 and `provinceid` != 0";
            if(!empty($filter)){
                $strFilter .=" and `pinyin` > '".strtolower($filter)."%'";
            }
            $listCity->setFilterString($strFilter);
            $listCity->setFields(array('name','pinyin','id'));
            $listCity->setOrder("pinyin asc");
            $listCity->setPage($page);
            $listCity->setPagesize($pageSize-count($arrHot));
            $arrCity = $listCity->toArray();     
            foreach ($arrCity['list'] as $key => $val){
                $index = strtoupper(substr($val['pinyin'],0,1));
                unset($val['pinyin']);
                unset($arrCity['list'][$key]);
                $arrCity['list'][$index][] = $val;
            } 
        }
        if(!empty($arrHot)){
            $arrCity['list']['hot'] = $arrHot;
        }       
        return $arrCity['list'];
    }
    
    /**
     * 根据城市ID获取城市信息
     * @param integer $cityId
     * @return array
     */
    public function getCityById($cityId){
        $objCity = new City_Object_City();
        $objCity->fetch(array('id' => $cityId));
        $ret = $objCity->toArray();
        if(!empty($ret)){
            $objCity->fetch(array('id' => $ret['pid']));
            $ret['pidname'] = $objCity->name;
        }
        return $ret;
    }
    
    /**
     * 修改城市信息
     * @param integer $cityId
     * @param array $arrInfo: array('pinyin' => 'xxx','x' => xxxx)
     * @return boolean
     */
    public function editCity($cityId,$arrInfo){
        $objCity = new City_Object_City();
        $objCity->fetch(array('id' => $cityId));
        if(empty($objCity->id)){
            return false;
        }
        foreach ($arrInfo as $key => $val){
            $objCity->$key = $val;
        }
        return $objCity->save();
    }
    
    /**
     * 添加新的城市
     * @param array $arrInfo : array('name' => 'xxx','cityid' => 'xxx')
     * @return boolean
     */
    public function addCity($arrInfo){
        $objCity = new City_Object_City();
        foreach ($arrInfo as $key => $val){
            $objCity->$key = $val;
        }
        return $objCity->save();
    }
    
    /**
     * 查询城市
     * @param array $arrInfo:过滤条件，如:array("status"=>1);
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function queryCity($arrInfo,$page,$pageSize){
        $listCity = new City_List_City();
        $strFileter = "`cityid` = 0 and `provinceid` != 0";
        foreach ($arrInfo as $key => $val){
            $strFileter .=" and `".$key."` = $val";
        }
        $listCity->setFilterString("$strFileter");
        $listCity->setPage($page);
        $listCity->setPagesize($pageSize);
        $arrCity = $listCity->toArray();
        foreach ($arrCity['list'] as $key => $val){
            $city = City_Api::getCityById($val['pid']);
            $arrCity['list'][$key]['pidname'] = $city['name'];
        }
        return $arrCity;
    }
    
    /**
     * 获取省的信息列表
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getProvinceList($page,$pageSize){
        $listCity = new City_List_City();
        $listCity->setFilter(array('provinceid' => 0));
        $listCity->setPage($page);
        $listCity->setPagesize($pageSize);
        $arrCity = $listCity->toArray();
        foreach ($arrCity['list'] as $key => $val){
            $city = City_Api::getCityById($val['pid']);
            $arrCity['list'][$key]['pidname'] = $city['name'];
        }
        return $arrCity;
    }
    
    /**
     * 城市名前缀模糊查询
     * @param string $str
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function queryCityPrefix($str,$page,$pageSize){
        $listCity = new City_List_City();
        $strFileter = "`cityid` = 0 and `provinceid` != 0 and name like '".$str."%'";
        $listCity->setFilterString("$strFileter");
        $listCity->setFields(array('id','name','pid'));
        $listCity->setPage($page);
        $listCity->setPagesize($pageSize);
        $arrCity = $listCity->toArray();
        foreach ($arrCity['list'] as $key => $val){
            $city = City_Api::getCityById($val['pid']);
            $arrCity['list'][$key]['pidname'] = $city['name'];
            $arrCity['list'][$key]['sight_num'] = $this->_modeSight->getSightNum($val['id']);
            $arrCity['list'][$key]['topic_num'] = $this->getTopicNum($val['id']);
        }
        return $arrCity;
    }
    
    /**
     * 省份名前缀模糊查询
     * @param string $str
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function queryProvincePrefix($str,$page,$pageSize){
        $listCity = new City_List_City();
        $strFileter = "`provinceid` = 0 and name like '".$str."%'";
        $listCity->setFilterString("$strFileter");
        $listCity->setPage($page);
        $listCity->setPagesize($pageSize);
        $arrCity = $listCity->toArray();
        foreach ($arrCity['list'] as $key => $val){
            $city = City_Api::getCityById($val['id']);
            $arrCity['list'][$key]['pidname'] = $city['name'];
        }
        return $arrCity;
    }
    
    /**
     * 获取一个城市的话题总数
     * @param integer $cityId
     * @return integer
     */
    public function getTopicNum($cityId){
        $count = 0;
        $redis = Base_Redis::getInstance();
        $ret   = $this->_modeSight->getSightByCity(1,PHP_INT_MAX,$cityId);
        foreach ($ret as $val){
            $count += $redis->zSize(Sight_Keys::getSightTopicKey($val['id']));
        }
        return $count;
    }
    
    /**
     * 获取热门城市信息
     * @return array
     */
    public function getHotCity(){
        $arrHotCity = array(
            array('id' =>2,   'name'=>'北京'),
            array('id' =>41,  'name'=>'上海'),
            array('id' =>2185,'name'=>'广州'),
            array('id' =>2211,'name'=>'深圳'),
            array('id' =>925, 'name'=>'南京'),
            array('id' =>1058,'name'=>'杭州'),
            array('id' =>972, 'name'=>'苏州'),
        );
        return $arrHotCity;
    }
}