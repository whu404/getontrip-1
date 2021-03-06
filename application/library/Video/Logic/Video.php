<?php
class Video_Logic_Video extends Base_Logic{
    
    const PAGE_SIZE = 20;
    
    const DEFAULT_WEIGHT = 0;
    
    protected $fields = array('sight_id', 'title', 'url', 'image', 'from', 'len', 'type', 'status', 'create_time', 'update_time', 'create_user', 'update_user');
    
    public function __construct(){
        
    }
    
    /**
     * 获取视频信息,供后端使用     
     * @param integer $sightId，景点ID
     * @param integer $page,页码
     * @param integer $pageSize
     * @param array   $arrParam,过滤条件
     * @return array
     */
    public function getVideos($page,$pageSize,$arrParam = array()){
        $arrVideo['list']   = array();
        $arrRet['list']     = array();
        $title    = '';
        if(isset($arrParam['sight_id'])){
            $sightId    = $arrParam['sight_id'];
            $arrVideoIds = array();            
            $listSightVideo = new Sight_List_Video();
            $listSightVideo->setFilter(array('sight_id' => $sightId));
            if(isset($arrParam['order'])){
                $listSightVideo->setOrder($arrParam['order']);
                unset($arrParam['order']);
            }
            $listSightVideo->setPagesize(PHP_INT_MAX);
            $ret = $listSightVideo->toArray();
            if(isset($arrParam['title'])){
                $title  = $arrParam['title'];
                unset($arrParam['title']);
            }
            foreach ($ret['list'] as $val){
                $arrParam = array_merge($arrParam,array('id' => $val['video_id']));                
                $objVideo = new Video_Object_Video();
                $objVideo->fetch($arrParam);
                $arrTmpVideo = $objVideo->toArray();
                if(!empty($title) && isset($arrTmpVideo['title'])){
                    if( false ==  strstr($arrTmpVideo['title'],$title)){
                        continue;
                    }
                }
                if(!empty($arrTmpVideo)){
                    $arrVideo['list'][] = $arrTmpVideo['id'];
                }
            }          
            $arrVideo['page'] = $page;
            $arrVideo['pagesize'] = $pageSize;
            $arrVideo['pageall'] = ceil(count($arrVideo['list'])/$pageSize);
            $arrVideo['total'] = count($arrVideo['list']);
            $arrVideo['list'] = array_slice($arrVideo['list'], ($page-1)*$pageSize,$pageSize); 
        }else{
            $listVideo = new Video_List_Video();
            if(!empty($arrParam)){
                $filter = "1";
                if(isset($arrParam['title'])){
                    $filter .= " and `title` like '".$arrParam['title']."%'";
                    unset($arrParam['title']);
                }
                foreach ($arrParam as $key => $val){
                    $filter .= " and `".$key."` =".$val;
                }
                $listVideo->setFilterString($filter);
            }          
            $listVideo->setPage($page);
            $listVideo->setPagesize($pageSize);
            $arrVideo = $listVideo->toArray();  
            foreach ($arrVideo['list'] as $key => $val){
                $arrVideo['list'][$key] = $val['id'];   
            }
        }
        $arrRet['page'] = $arrVideo['page'];
        $arrRet['pagesize'] = $arrVideo['pagesize'];
        $arrRet['pageall'] = $arrVideo['pageall'];
        $arrRet['total'] = $arrVideo['total'];
        foreach($arrVideo['list'] as $key => $val){
            $temp = array();
            $arrVideo['list'][$key] = Video_Api::getVideoInfo($val);
            $arrVideo['list'][$key]['sights'] = array();
            $listSightVideo = new Sight_List_Video();
            $listSightVideo->setFilter(array('video_id' => $val));
            $listSightVideo->setPagesize(PHP_INT_MAX);
            $arrSightVideo  = $listSightVideo->toArray();
            foreach ($arrSightVideo['list'] as $data){
                $sight          = Sight_Api::getSightById($data['sight_id']);
                $temp['id']     = $data['sight_id'];
                $temp['name']   = $sight['name'];
                $temp['weight'] = $data['weight'];
            }
            if(!empty($temp)){
                $arrVideo['list'][$key]['sights'][] = $temp;
            }
            
        }
        return $arrVideo;
    }
    
    /**
     * 获取视频信息,供前端使用
     * @param integer $sightId，景点ID
     * @param integer $page,页码
     * @param integer $pageSize
     * @param array   $arrParam,过滤条件
     * @return array
     */
    public function getVideoList($sightId,$page,$pageSize,$arrParam = array()){
        $arrRet         = array();
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('sight_id' => $sightId));
        $listSightVideo->setOrder('`weight` asc');
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $ret = $listSightVideo->toArray();
        foreach ($ret['list'] as $val){
            $objVideo = new Video_Object_Video();
            $arrParam = array_merge($arrParam,array('id' => $val['video_id']));
            $objVideo->fetch($arrParam);
            $arrVideo = $objVideo->toArray();
            if(!empty($arrVideo)){
                $temp['id']    = strval($arrVideo['id']);
                $video         = Video_Api::getVideoInfo($arrVideo['id']);
                $temp['title'] = Base_Util_String::getHtmlEntity($video['title']);
                $temp['image'] = Base_Image::getUrlByName($video['image']);
                $temp['url']   = Base_Config::getConfig('web')->root.'/video/detail?id='.$temp['id'];
                if($video['type'] == Video_Type_Type::ALBUM){
                    $temp['len'] = sprintf("合辑：共%d集",$video['len']);
                }else{
                    $temp['len'] = sprintf("时长：%s",$video['len']);
                }
                $temp['type']    = strval($video['type']);
                $logicCollect    = new Collect_Logic_Collect();
                $temp['collected'] = strval($logicCollect->checkCollect(Collect_Type::VIDEO, $arrVideo['id']));
                $arrRet[] = $temp;
            }
        }
        return array_slice($arrRet,($page-1)*$pageSize,$pageSize);
    }
        
    /**
     * 从爱奇艺源获取数据
     * @param string $query
     * @param integer $page
     * @return array
     */
    public function getAiqiyiSource($sightId,$page){
        require_once(APP_PATH."/application/library/Base/HtmlDom.php");
        $arrData = array();
        $sight = Sight_Api::getSightById($sightId);
        $name  = urlencode(trim($sight['name']));        
        $url = "http://so.iqiyi.com/so/q_".$name."_page_".$page;
        $html = file_get_html($url);
        
        //视频总数
        //$item  = $html->find('div.mod-page a',-2);
        //$count = $item->getAttribute('data-key')*self::PAGE_SIZE;
        $count = 0;
        foreach($html->find('li.list_item') as $index => $e){           
            $info = array();
            $info['title']     = $e->getAttribute('data-widget-searchlist-tvname');
            if(empty($info['title'])){
                $test = $html->find("h3.result_title a",$index);
                $info['title'] = $test->getAttribute('title');
            }
            $diversity         = intval($e->getAttribute('data-widget-searchlist-pagesize'));
            $info['type']      = ($diversity > 1)?Video_Type_Type::ALBUM:Video_Type_Type::VIDEO;
            $info['catageory'] = html_entity_decode($e->getAttribute('data-widget-searchlist-catageory'));
            $ret               = $e->find('a.figure',0);
            $info['url']       = trim($ret->getAttribute("href"));        
            $ret               = $e->find('a.figure img',0);
            $info['image']     = $this->uploadPic($ret->getAttribute("src"),$url);
            $info['status']    = Video_Type_Status::NOTPUBLISHED;
            $info['from']      = '爱奇艺';
            $info['create_time'] = time();          
            
            if(Video_Type_Type::VIDEO == $info['type']){
                $ele = $e->find('p.viedo_rb span.v_name',0);
                if($ele){
                    $info['len'] = $ele->innertext;
                }else{
                    $info['len'] = '1';
                }
            }else{
                $ele  = $e->find('li.album_item a',-1);
                if(!empty($ele)){
                    $data = $ele->getAttribute("title");
                }                
                if(empty($data) || stristr($data,"更多")){
                    $ele = $e->find('li.album_item a',-2);
                }
                if($ele){
                    $strLen = $ele->getAttribute("title");
                    sscanf($strLen,"第%d集",$intLen);
                }else{
                    $intLen = 1;
                }
                $info['len'] = strval($intLen);
            }
            
            $guid = md5($info['title'].$info['url']);
            $id   = $this->getVideoByGuid($guid);            
            if(empty($id)){
                $objVideo          = new Video_Object_Video();
                $objVideo->title   = Base_Util_String::delStartEmpty(Base_Util_String::getHtmlEntity($info['title']));
                if(empty($objVideo->title)){
                    $this->delPic($info['image']);
                    continue;
                }
                $objVideo->from    = $info['from'];
                $objVideo->url     = $info['url'];
                $objVideo->image   = $info['image'];
                $objVideo->type    = $info['type'];
                $objVideo->status  = $info['status'];
                $objVideo->len     = $info['len'];
                $objVideo->guid    = $guid;
                $objVideo->save();
                
                $objSightVideo = new Sight_Object_Video();
                $objSightVideo->sightId = $sightId;
                $objSightVideo->videoId = $objVideo->id;
                $objSightVideo->weight  = self::DEFAULT_WEIGHT;
                $objSightVideo->save();
              
            }else{//删除上传了的图片，其它字段不改变
                $this->delPic($info['image']);
            }
            $arrData[]       = $info;
            $count += 1;
        }
        if(empty($count)){
            Base_Log::error('sight '.$sightId.' can not get aqiyi videos!');
            return 0;
        }
        $html->clear();
        return $arrData;
    }    
    
    public function getVideoByInfo($videoId){
        $objVideo = new Video_Object_Video();
        $objVideo->fetch(array('id' => $videoId));
        $arrVideo = $objVideo->toArray();
        
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('video_id' => $videoId));
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo  = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $val){
            $temp['id']   = $val['sight_id'];
            $sight        = Sight_Api::getSightById($val['sight_id']);
            $temp['name'] = $sight['name'];
            $arrVideo['sights'][] = $temp;
        }
        return $arrVideo;
    }
    
    public function search($query, $page, $pageSize){
        $arrVideo  = Base_Search::Search('video', $query, $page, $pageSize, array('id'));
        $num       = $arrVideo['num'];
        $arrVideo  = $arrVideo['data'];
        foreach ($arrVideo as $key => $val){
            $video = $this->getVideoByInfo($val['id']);            
            $arrVideo[$key]['title']       = empty($val['title'])?trim($video['title']):$val['title'];
            $arrVideo[$key]['image']       = isset($video['image'])?Base_Image::getUrlByName($video['image']):'';
            $arrVideo[$key]['url']         = isset($video['url'])?trim($video['url']):'';
            $arrVideo[$key]['content']     = isset($video['from'])?trim($video['from']):'';
            $arrVideo[$key]['search_type'] = 'video';
        }
        return array('data' => $arrVideo, 'num' => $num);
    }
    
    public function getAllVideoNum($sightId){
        $maxWeight  = 0;    
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('sight_id' => $sightId));
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo  = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $val){
            $objVideo = new Video_Object_Video();
            $objVideo->fetch(array('id' => $val['video_id']));
            if($objVideo->status == Video_Type_Status::PUBLISHED){
                if($val['weight'] > $maxWeight){
                    $maxWeight = $val['weight'];
                }
            }            
        }
        return $maxWeight + 1;
    }
    
    public function getVideoNum($sighId, $status = Video_Type_Status::PUBLISHED){
        if($status == Video_Type_Status::PUBLISHED){
            $redis = Base_Redis::getInstance();
            $ret   = $redis->hGet(Sight_Keys::getSightTongjiKey($sighId),Sight_Keys::VIDEO);
            if(!empty($ret)){
                return $ret;
            }
        }
        $count          = 0;
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('sight_id' => $sighId));
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo  = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $val){
            $objVideo = new Video_Object_Video();
            $objVideo->fetch(array('id' => $val['video_id']));
            if($objVideo->status == $status){
                $count += 1;
            }
        }
        if($status == Video_Type_Status::PUBLISHED){
            $redis = Base_Redis::getInstance();
            $redis->hSet(Sight_Keys::getSightTongjiKey($sighId),Sight_Keys::VIDEO,$count);
        }
        return $count;
    }
    
    /**
     * 修改视频信息
     * @param integer $id
     * @param array $arrParam
     */
    public function editVideo($id, $arrParam){
        $this->updateRedis($id);
        if(isset($arrParam['status'])){
            $arrSightIds = array();
            $weight      = array();
            $ret         = true;
            $objVideo = new Video_Object_Video();
            $objVideo->fetch(array('id' => $id));
            $objVideo->status = $arrParam['status'];
            $listSightVideo = new Sight_List_Video();
            $listSightVideo->setFilter(array('video_id' => $id));
            $listSightVideo->setPagesize(PHP_INT_MAX);
            $arrSightVideo  = $listSightVideo->toArray();
            foreach ($arrSightVideo['list'] as $val){
                $objSightVideo = new Sight_Object_Video();
                $objSightVideo->fetch(array('id' => $val['id']));
                
                $redis = Base_Redis::getInstance();
                $redis->hDel(Sight_Keys::getSightTongjiKey($val['sight_id']),Sight_Keys::VIDEO);
                
                if($arrParam['status'] == Video_Type_Status::BLACKLIST){
                    $ret = $objSightVideo->remove();
                }else{
                    $objSightVideo->weight = $this->getAllVideoNum($val['sight_id']);
                    $objSightVideo->save();
                }
            }
            if($arrParam['status'] == Video_Type_Status::BLACKLIST){
                return $objVideo->save();
            }
        }
        
        $arrSight = array();
        if(isset($arrParam['sight_id'])){
            $listSightVideo = new Sight_List_Video();
            $listSightVideo->setFilter(array('video_id' => $id));
            $listSightVideo->setPagesize(PHP_INT_MAX);
            $arrSightVideo  = $listSightVideo->toArray();
            foreach ($arrSightVideo['list'] as $val){
                $objSightVideo = new Sight_Object_Video();
                $objSightVideo->fetch(array('id' => $val['id']));
                $objSightVideo->remove();
            }
            $arrSight = $arrParam['sight_id'];
            unset($arrParam['sight_id']);
        }
        $objVideo = new Video_Object_Video();
        $objVideo->fetch(array('id' => $id));
        
        foreach ($arrParam as $key => $val){
            if(in_array($key,$this->fields)){
                $key = $this->getprop($key);
                if(($key == 'image') && ($objVideo->image !== $val) &&(!empty($objVideo->image))){
                    $this->delPic($objVideo->image);
                }
                $objVideo->$key = $val;
            }
        }
        
        foreach ($arrSight as $sightId){
            $objSightVideo = new Sight_Object_Video();
            $objSightVideo->sightId = $sightId;
            $objSightVideo->videoId = $id;
            $objSightVideo->weight  = $this->getAllVideoNum($sightId);
            $objSightVideo->save();
        }
        return $objVideo->save();
    }
    
    /**
     * 添加视频
     * @param array $arrParam
     */
    public function addVideo($arrParam){
        $arrSight = array();
        if(isset($arrParam['sight_id'])){
            $arrSight = $arrParam['sight_id'];
            unset($arrParam['sight_id']);
        }
        $objVideo = new Video_Object_Video();
        foreach ($arrParam as $key => $val){
            if(in_array($key,$this->fields)){
                $key = $this->getprop($key);
                $objVideo->$key = $val;
            }
        }
        $objVideo->guid   = md5($arrParam['title'].$arrParam['url']);
        $ret =             $objVideo->save();
        
        foreach ($arrSight as $sightId){
            $objSightVideo = new Sight_Object_Video();
            $objSightVideo->sightId = $sightId;
            $objSightVideo->videoId = $objVideo->id;
            $objSightVideo->weight  = $this->getAllVideoNum($sightId);
            $objSightVideo->save();            
        }
        $this->updateRedis($objVideo->id);
        return $objVideo->id;
    }
    
    /**
     * 删除视频
     * @param integer $id
     */
    public function delVideo($id){
        $arrSightIds    = array();
        $weight         = array();
        $this->updateRedis($id);
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('video_id' => $id));
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo  = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $val){
            $objSightVideo = new Sight_Object_Video();
            $objSightVideo->fetch(array('id' => $val['id']));
            $weight[]      = $objSightVideo->weight;
            $arrSightIds[] = $objSightVideo->sightId;
            $objSightVideo->remove();
        }
        
        $objVideo = new Video_Object_Video();
        $objVideo->fetch(array('id' => $id));
        if(!empty($objVideo->image)){
            $this->delPic($objVideo->image);
        }
        $ret = $objVideo->remove();
        
        foreach ($arrSightIds as $key => $id){
            $listSightVideo = new Sight_List_Video();
            $listSightVideo->setFilterString("`weight` >".$weight[$key]);
            $listSightVideo->setPagesize(PHP_INT_MAX);
            $arrSightVideo  = $listSightVideo->toArray();
            foreach ($arrSightVideo['list'] as $val){
                $objSightVideo = new Sight_Object_Video();
                $objSightVideo->fetch(array('id' => $val['id']));
                $objSightVideo->weight -= 1;
                $objSightVideo->save();
            }
        }
        
        return $ret;
    }
    
    /**
     * 根据GUID获取视频ID
     * @param string $strGuid
     * @return number|''
     */
    public function getVideoByGuid($strGuid){
        $objVideo = new Video_Object_Video();
        $objVideo->fetch(array('guid' => $strGuid));
        if($objVideo->id){
            return $objVideo->id;
        }
        return '';
    }
    
    /**
     * 修改某景点下的视频的权重
     * @param integer $id 视频ID
     * @param integer $to 需要排的位置
     * @return boolean
     */
    public function changeWeight($sightId,$id,$to){
        $strVideoids = '';
        $model = new VideoModel();
        $ret   = $model->getSightVideo($sightId, Video_Type_Status::PUBLISHED);
        $strVideoids = implode(",",$ret);
        
        $objSightVideo = new Sight_Object_Video();
        $objSightVideo->fetch(array('sight_id' => $sightId,'video_id' => $id));
        $from       = $objSightVideo->weight;
        $objSightVideo->weight = $to;        
    
        $listSightVideo = new Sight_List_Video();
        $filter ="`sight_id` =".$sightId." and `video_id` in (".$strVideoids.") and `weight` >= $to and `weight` != $from";
        $listSightVideo->setFilterString($filter);       
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $key => $val){
            $objTmpSightVideo = new Sight_Object_Video();
            $objTmpSightVideo->fetch(array('id' => $val['id']));
            $objTmpSightVideo->weight += 1;
            $objTmpSightVideo->save();
        }
        $ret = $objSightVideo->save();
        return $ret;
    }
    
    public function updateRedis($videoId){
        $redis = Base_Redis::getInstance();
        $listSightVideo = new Sight_List_Video();
        $listSightVideo->setFilter(array('video_id' => $videoId));
        $listSightVideo->setPagesize(PHP_INT_MAX);
        $arrSightVideo  = $listSightVideo->toArray();
        foreach ($arrSightVideo['list'] as $val){
            $redis->hDel(Sight_Keys::getSightTongjiKey($val['sight_id']),Sight_Keys::VIDEO);
            
            $objSight = new Sight_Object_Sight();
            $objSight->fetch(array('id' => $val['sight_id']));
            $redis->hDel(City_Keys::getCityVideoNumKey(),$objSight->cityId);
        }
    }
}