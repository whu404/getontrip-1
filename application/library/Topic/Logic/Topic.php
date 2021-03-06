<?php
/**
 * 话题逻辑层
 * @author huwei
 *
 */
class Topic_Logic_Topic extends Base_Logic{
    
    const DEFAULT_SIZE  = 4;
    
    const DEFAULT_DAYS  = 30;    
    
    const ADD_TOPIC     = 1;
    
    const DEL_TOPIC     = 2;
    
    protected $model;
    
    public function __construct(){
        $this->model = new TopicModel();
    }
    
    /**
     * 根据景点Id获取话题ID数组，如果景点ID为空，则返回所有话题ID
     * @param string $sightId
     * @return string
     */
    public function getTopicIdBySight($sightId = ''){
        $ret   = array();
        $redis = Base_Redis::getInstance();
        $ret   = $redis->sMembers(Sight_Keys::getSightTopicKey($sightId));
        if(!empty($ret)){
            $strTopicId = implode(",", $ret);
            return $strTopicId;
        }
        //获取景点的所有话题
        $redis->delete(Sight_Keys::getSightTopicKey($sightId));
        $listTopic = new Sight_List_Topic();
        $listTopic->setPagesize(PHP_INT_MAX);
        if(!empty($sightId)){
            $listTopic->setFilter(array('sight_id' => $sightId));
        }
        $arrRet = $listTopic->toArray();
        foreach ($arrRet['list'] as $val){
            $objTopic = new Topic_Object_Topic();
            $objTopic->fetch(array('id' => $val['topic_id']));
            if($objTopic->status == Topic_Type_Status::PUBLISHED){
                $ret[] = $val['topic_id'];
                $redis->sAdd(Sight_Keys::getSightTopicKey($sightId),$val['topic_id']);
            }
        }
        $strTopicId = implode(",", $ret);      
        return $strTopicId;
    }
    
    /**
     * 获取最热门的话题，带景点ID、时间范围、大小、标签过滤，并加上答案等信息
     * @param integer $sightId
     * @param integer $size
     * @return array
     */
    public function getHotTopic($sightId,$period=self::DEFAULT_DAYS,$page=1,$pageSize=self::DEFAULT_SIZE,$strTags=''){
        $logicTag = new Tag_Logic_Tag;
        if($logicTag->getTagType($strTags) == Tag_Type_Tag::CLASSIFY){
            $arrRet     = $this->model->getHotTopicIds($sightId,$strTags,$page,$pageSize,$period);
        }elseif($logicTag->getTagType($strTags) == Tag_Type_Tag::TOP_CLASS){
            $arrRet     = $this->getTopTopicIds($strTags, $sightId, $page, $pageSize);
        }else{
            $arrRet     = $this->model->getHotTopicIds('',$strTags, $page, $pageSize,$period);
        }   
        foreach($arrRet as $key => $val){
            $topicDetail = $this->model->getTopicDetail($val['id'],$page); 
            if(empty($topicDetail['title'])){
                continue;
            }         
            $arrRet[$key]['title']     = trim($topicDetail['title']);
            $arrRet[$key]['subtitle']  = trim($topicDetail['subtitle']);
            //话题访问人数            
            $arrRet[$key]['visit']     = strval($this->getTotalTopicVistUv($val['id']));
            
            //话题收藏数
            $logicCollect              = new Collect_Logic_Collect();
            $arrRet[$key]['collect']   = strval($logicCollect->getTotalCollectNum(Collect_Type::TOPIC, $val['id']));
            
            //话题点赞数
            $logicPraise              = new Praise_Logic_Praise();
            $arrRet[$key]['praise']  = $logicPraise->getPraiseNum($val['id']);
             
            
            //话题来源
            //$logicSource = new Source_Logic_Source();         
            //$arrRet[$key]['from']      = $logicSource->getSourceName($topicDetail['from']);
            
            $arrRet[$key]['image']     = Base_Image::getUrlByName($topicDetail['image']);
            
            $arrRet[$key]['tagid']     = strval($strTags);
            
            $arrRet[$key]['url']       = Base_Config::getConfig('web')->root.'/topic/detail/'.Base_Util_Secure::encryptForUuap(Base_Util_Secure::PASSWD_KEY,$topicDetail['id']);
                                
        }
        return $arrRet;
    }
    
    /**
     * 获取最新的话题，带景点、时间范围、大小、标签过滤，并加上答案等信息:话题的更新时间取话题时间与答案时间中的最新者
     * @param integer $sightId
     * @param integer $size
     * @return array
     */
    public function getNewTopic($sightId,$period = self::DEFAULT_DAYS, $page, $pageSize, $strTags = ''){
        $logicTag = new Tag_Logic_Tag;        
        if($logicTag->getTagType($strTags) == Tag_Type_Tag::CLASSIFY){
            $arrRet     = $this->model->getHotTopicIds($sightId,$strTags,$page,$pageSize,$period);
        }elseif($logicTag->getTagType($strTags) == Tag_Type_Tag::TOP_CLASS){
            $arrRet     = $this->getTopTopicIds($strTags, $sightId, $page, $pageSize);
        }else{
            $arrRet     = $this->getGeneralTopicIds($strTags, $page, $pageSize);
        }        
        foreach($arrRet as $key => $val){    
            $topicDetail               = $this->model->getTopicDetail($val['id'],$page);
            $arrRet[$key]['title']     = trim($topicDetail['title']);
            $arrRet[$key]['subtitle']  = trim($topicDetail['subtitle']);

            //话题收藏数
            $logicCollect      = new Collect_Logic_Collect();        

            $arrRet[$key]['visit']   = $this->getTotalTopicVistPv($val['id'], $period);
            $arrRet[$key]['collect'] = strval($logicCollect->getTotalCollectNum(Collect_Keys::TOPIC, $val['id']));
            
            //话题点赞数
            $logicPraise              = new Praise_Logic_Praise();
            $arrRet[$key]['praise']  = $logicPraise->getPraiseNum($val['id']);
            
            //话题来源
            //$logicSource             = new Source_Logic_Source();
            //$arrRet[$key]['from']    = $logicSource->getSourceName($topicDetail['from']);
            
            $arrRet[$key]['image']   = Base_Image::getUrlByName($topicDetail['image']);
            
            $arrRet[$key]['tagid']     = strval($strTags);
            
            $arrRet[$key]['url']       = Base_Config::getConfig('web')->root.'/topic/detail/'.Base_Util_Secure::encryptForUuap(Base_Util_Secure::PASSWD_KEY,$topicDetail['id']);
        }        
        return $arrRet;
    }
    
    
    /**
     * 获取话题详细信息
     * @param integer $topicId
     * @return Topic_Object_Topic
     */
    public function getTopicDetail($topicId, $sightId = ''){
        $objTopic = new Topic_Object_Topic();
        $objTopic->setFileds(array('id','subtitle','title','content','from','from_detail','image','url'));
        $objTopic->fetch(array('id' => $topicId));
        $arrRet   = $objTopic->toArray();
        if(empty($arrRet)){
            return $arrRet;
        }
        $arrRet['sight'] = '';
        $arrRet['arrsights'] = array();
        
        $logic = new Sight_Logic_Sight();
        $arrSight = $logic->getSightByTopic($topicId);
        foreach($arrSight['list'] as $val){
            $sight   = new Sight_Object_Sight();
            $sight->fetch(array('id' => $val['sight_id']));
            if($sight->status == Sight_Type_Status::PUBLISHED){
                $temp['id']    = strval($val['sight_id']);
                $sight         = Sight_Api::getSightById($val['sight_id']);
                $temp['name']  = $sight['name'];
                $arrRet['arrsights'][] = $temp;
            }
        }        
        $logicComment          = new Comment_Logic_Comment();
        $arrRet['id']          = strval($arrRet['id']);
        $arrRet['commentNum']  = $logicComment->getTotalCommentNum($topicId);
        $arrRet['subtitle']    = Base_Util_String::trimall($arrRet['subtitle']);
        $arrRet['title']       = Base_Util_String::trimall($arrRet['title']);
        $arrRet['content']     = trim($arrRet['content']);
        $arrRet['shareurl']    = Base_Config::getConfig('web')->root.'/topic/detail/'.Base_Util_Secure::encryptForUuap(Base_Util_Secure::PASSWD_KEY,$topicId);
        $arrRet['contenturl']  = $arrRet['shareurl'].'?isapp=1';
       
        //$arrRet['desc']      = Base_Util_String::getSubString($arrRet['content'], 30);
        
        //话题来源
        $logicSource     = new Source_Logic_Source();
        if(empty($objTopic->fromDetail)){
            $arrRet['from']  = $logicSource->getSourceName($objTopic->from);
        }else{
            $arrRet['from']  = trim($objTopic->fromDetail);
        }
        
        $arrRet['image']     = isset($arrRet['image'])?Base_Image::getUrlByName($arrRet['image']):'';
        
        //话题访问人数
        $arrRet['visit']     = strval($this->getTotalTopicVistUv($arrRet['id']));
        
        //话题收藏数
        $logicCollect        = new Collect_Logic_Collect();
        $arrRet['collect']   = strval($logicCollect->getTotalCollectNum(Collect_Type::TOPIC, $arrRet['id']));
        $arrRet['collected'] = strval($logicCollect->checkCollect(Collect_Type::TOPIC, $arrRet['id']));
        
        //话题点赞情况
        $logicPraise          = new Praise_Logic_Praise();
        $arrRet['praised']    = strval($logicPraise->checkPraise(Praise_Type_Type::TOPIC, $topicId));
        $arrRet['praiseNum']  = strval($logicPraise->getPraiseNum($topicId));
        
        //添加redis中话题访问次数统计，直接让其失效，下次从数据库中获取
        $redis = Base_Redis::getInstance();
        $redis->hDel(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($topicId));
        $redis->hDel(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($topicId,'*'));  
        
        $logicTag = new Tag_Logic_Tag();
        $arrRet['tags'] = $logicTag->getTopicTags($topicId);
        if(!empty($arrRet['tags'])){
            $tag = str_replace("其他", "", $arrRet['tags'][0]);
            $arrRet['tags'] = array($tag);
        }
        
        if(empty($sightId)){
            $sightId = isset($arrRet['arrsights'][0]['id'])?($arrRet['arrsights'][0]['id']):'';
        }
        
        if(!empty($sightId)){
            $arrSight         = Sight_Api::getSightById($sightId);
            $arrRet['sight']  = $arrSight['name'];
        }
        $arrRet['sightid']     = strval($sightId);
        
        //这里需要更新一下热度
        return $arrRet;
    }    
    
    /**
     * 获取某个用户的所有话题
     * @param integer $deviceId
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getUserTopic($deviceId,$page,$pageSize){
        $logicUser = new User_Logic_User();
        $userId    = $logicUser->getUserId($deviceId);
        $listTopic = new Topic_List_Topic();
        $listTopic->setFilter(array('user_id' => $userId));
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        return $listTopic->toArray();
    }
    
    /**
     * 根据景点ID获取话题信息
     * @param integer $sightId
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getTopicBySight($sightId,$page=1,$pageSize=PHP_INT_MAX){
        $arrRet = array();
        $listSightTopic = new Sight_List_Topic();
        $listSightTopic->setFields(array('topic_id'));
        $listSightTopic->setFilter(array('sight_id' => $sightId));
        $listSightTopic->setPage($page);
        $listSightTopic->setPagesize($pageSize);
        $ret = $listSightTopic->toArray();
        foreach ($ret['list'] as $key => $val){
            $arrRet[] = $val['topic_id'];
        }
        return $arrRet;
    }
    
    /**
     * 获取话题最近的访问人数
     * @param integer $topicId
     * @param string $during
     * @return integer
     */
    public function getLateTopicVistUv($topicId,$during,$dateType = 'DAY'){
        $redis   = Base_Redis::getInstance();
        if( $dateType == 'DAY'){
            $from    = strtotime($during." days ago");
            $ret = $redis->hGet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($topicId,$during));
        }else{
            $from    = time() - 60*$during;
            $ret = $redis->hGet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateMinuteKey($topicId,$during));
        }        
        if(!empty($ret)){
            return $ret;
        }
        $list   = new Tongji_List_Visit();
        $list->setFields(array('user'));
        $filter = "`obj_id` = $topicId and `create_time` >= $from and `type` = ".Tongji_Type_Visit::TOPIC; 
        $list->setPagesize(PHP_INT_MAX);
        $list->setFilterString($filter);
        $arrRet = $list->toArray();
        $arrTotal = array();
        foreach($arrRet['list'] as $val){
            if(!in_array($val['user'],$arrTotal)){
                $arrTotal[] = $val['user'];
            }
        }
        if( $dateType == 'DAY'){
            $redis->hSet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($topicId,$during),count($arrTotal));
        }else{
            $redis->hSet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateMinuteKey($topicId,$during),count($arrTotal));
        }
        return count($arrTotal);
    }
    
    /**
     * 获取话题最近的访问次数
     * @param integer $topicId
     * @param string $during
     * @return integer
     */
    public function getLateTopicVistPv($topicId,$during){
        $redis   = Base_Redis::getInstance();
        $from    = strtotime($during);
        $ret = $redis->hGet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($topicId,$during));
        if(!empty($ret)){
            return $ret;
        }
        $list   = new Tongji_List_Visit();
        $filter = "`obj_id` = $topicId and `create_time` >= $from and `type` = ".Tongji_Type_Visit::TOPIC;
        $list->setPagesize(PHP_INT_MAX);
        $list->setFilterString($filter);
        $arrRet = $list->toArray();
        $redis->hSet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($topicId,$during),$arrRet['total']);
        return $arrRet['total'];
    }
    
    /**
     * 获取话题总的访问人数
     * @param integer $topicId
     * @param string $during
     * @return integer
     */
    public function getTotalTopicVistUv($topicId){
        $redis   = Base_Redis::getInstance();
        $ret = $redis->hGet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($topicId));
        if(!empty($ret)){
            return $ret;
        }
        $list   = new Tongji_List_Visit();
        $list->setFields(array('user'));
        $list->setFilter(array('obj_id' => $topicId,'type' => Tongji_Type_Visit::TOPIC));
        $list->setPagesize(PHP_INT_MAX);
        $arrRet = $list->toArray();
        $arrTotal = array();
        foreach($arrRet['list'] as $val){
            if(!in_array($val['user'],$arrTotal)){
                $arrTotal[] = $val['user'];
            }
        }
        $redis->hSet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($topicId),count($arrTotal));
        return count($arrTotal);
    }
    
    /**
     * 获取话题总的访问次数
     * @param integer $topicId
     * @param string $during
     * @return integer
     */
    public function getTotalTopicVistPv($topicId){
        $redis   = Base_Redis::getInstance();
        $ret = $redis->hGet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($topicId));
        if(!empty($ret)){
            return $ret;
        }
        $list   = new Tongji_List_Visit();
        $list->setFilter(array('obj_id' => $topicId,'type' => Tongji_Type_Visit::TOPIC));
        $list->setPagesize(PHP_INT_MAX);
        $arrRet = $list->toArray();
        $redis->hSet(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($topicId),$arrRet['total']);
        return $arrRet['total'];
    }
    
    /**
     * 获取话题的热度:热度=话题收藏数+评论数+话题浏览量
     * @param integer $sightId，景点ID
     * @param string $period,时间段
     * @return integer，话题热度
     */
    public function getTopicHotDegree($topicId,$period){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $topicId));
        if($period == self::DEFAULT_DAYS){
            return $objTopic->hot2;
        }
        return $objTopic->hot1;
    }
    

    /**
     * 对话题中的标题内容进行模糊查询
     * @param array $arrParam，条件数组,$arrParam['title']中包含模糊匹配词
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function search($arrParam,$page,$pageSize){
        $arrTopics = array();
        $filter    = '';
        $sight_id  = '';
        if(isset($arrParam['sight_id'])){
            $logic = new Topic_Logic_Topic();
            $arrTopics = $logic->getTopicBySight($arrParam['sight_id']);
            $sight_id  = $arrParam['sight_id'];
            unset($arrParam['sight_id']);
        }
        $listTopic = new Topic_List_Topic();
        if(isset($arrParam['title'])){
            $filter = "`title` like '%".$arrParam['title']."%' and ";
            unset($arrParam['title']);
        }
        if(isset($arrParam['tag_id'])){
            $listTopicTag = new Topic_List_Tag();
            $listTopicTag->setFilter(array('tag_id' => $arrParam['tag_id']));
            $listTopicTag->setPagesize(PHP_INT_MAX);
            $arrTopicTag  = $listTopicTag->toArray();
            if(empty($arrTopics)){
                foreach ($arrTopicTag['list'] as $data){
                    $arrTopics[] = $data['topic_id'];
                }
            }else{
                $arrTemp = array();
                foreach ($arrTopicTag['list'] as $data){
                    $arrTemp[] = $data['topic_id'];
                }
                $arrTopics = array_intersect($arrTopics,$arrTemp);
            }
            unset($arrParam['tag_id']);
        }
        foreach ($arrParam as $key => $val){
            $filter .= "`".$key."` = $val and ";
        }
        if(!empty($sight_id) || !empty($arrTopics)){
            $strTopics = implode(",",$arrTopics);
            if(empty($strTopics)){
                $strTopics = -1;
            }
            $filter .= "`id` in ($strTopics)";
        }else{
            if(!empty($filter)){
                $filter  = substr($filter,0,-4);
            }
        }
        if(!empty($filter)){
            $listTopic->setFilterString($filter);
        }
        if(isset($arrParam['id'])){
            $listTopic->setFields(array('id','title','from','from_detail','content','url','image','status','create_time','update_time'));
        }else{
            $listTopic->setFields(array('id','title','from','from_detail','url','image','status','create_time','update_time'));
        }
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        $arrRet = $listTopic->toArray();
        foreach ($arrRet['list'] as $key => $val){
            $listTopictag = new Topic_List_Tag();
            $listTopictag->setFilter(array('topic_id' => $val['id']));
            $listTopictag->setPagesize(PHP_INT_MAX);
            $arrTag = $listTopictag->toArray();
            $arrRet['list'][$key]['tags'] = array(); 
            foreach ($arrTag['list'] as $index => $data){
                $objTag = new Tag_Object_Tag();
                $objTag->fetch(array('id' => $data['tag_id']));
                $arrRet['list'][$key]['tags'][] = $objTag->toArray();
            }
    
            $listSighttopic = new Sight_List_Topic();
            if(!empty($sight_id)){
                $listSighttopic->setFilter(array('topic_id' =>$val['id'],'sight_id' =>$sight_id));
            }else{
                $listSighttopic->setFilter(array('topic_id' =>$val['id']));
            }
            $listSighttopic->setPagesize(PHP_INT_MAX);
            $arrSighttopic = $listSighttopic->toArray();
            $arrRet['list'][$key]['sights'] = $arrSighttopic['list'];                                  
             
            $logicCollect      = new Collect_Logic_Collect();           
            $arrRet['list'][$key]['collect'] = $logicCollect->getTotalCollectNum(Collect_Keys::TOPIC, $val['id']);
            
            $logicComment      = new Comment_Logic_Comment();
            $arrRet['list'][$key]['comment'] = $logicComment->getTotalCommentNum($val['id']);
        }
        return $arrRet;
    }
    
    
    public function getTopicById($id){
        $objTopic = new Topic_Object_Topic();
        $objTopic->setFileds(array('id','title','subtitle','content','desc','image','create_user','x','y','update_user','from','from_detail','url','status','create_time','update_time'));
        $objTopic->fetch(array('id' => $id));
        $ret = $objTopic->toArray();
        
        $listTopictag = new Topic_List_Tag();
        $listTopictag->setFilter(array('topic_id' => $id));
        $listTopictag->setPagesize(PHP_INT_MAX);
        $arrTag = $listTopictag->toArray();
        $ret['tags'] = $arrTag['list'];
        
        $listSighttopic = new Sight_List_Topic();
        $listSighttopic->setFilter(array('topic_id' =>$id));
        $listSighttopic->setPagesize(PHP_INT_MAX);
        $arrSighttopic = $listSighttopic->toArray();
        $ret['sights'] = $arrSighttopic['list'];        
         
        $logicCollect      = new Collect_Logic_Collect();
        $ret['collect'] = $logicCollect->getTotalCollectNum(Collect_Keys::TOPIC, $id);
        
        $logicComment      = new Comment_Logic_Comment();
        $ret['comment'] = $logicComment->getTotalCommentNum($id);
        
        $ret['visit']   = strval($this->getTotalTopicVistUv($id));
        $ret['shareurl']    = Base_Config::getConfig('web')->root.'/topic/detail/'.Base_Util_Secure::encryptForUuap(Base_Util_Secure::PASSWD_KEY,$id);
        return $ret;
    }
    
    public function delTopic($id){
        $redis = Base_Redis::getInstance();
        //删除话题
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $id));
        
        //删除图片
        if(!empty($objTopic->image)){
            $oss      = Oss_Adapter::getInstance();
            $filename = $objTopic->image . '.jpg';
            $oss->remove($filename);
        }        
        $ret = $objTopic->remove();
 
        //删除评论
        $listComment = new Comment_List_Comment();
        $listComment->setFilter(array('obj_id' => $id));
        $listComment->setPagesize(PHP_INT_MAX);
        $arrComment = $listComment->toArray();
        foreach ($arrComment['list'] as $index => $val){
            $objComment = new Comment_Object_Comment();
            $objComment->fetch(array('id' => $val['id']));
            $objComment->remove();
        }
    
        //删除话题标签关系
        $listTopicTag = new Topic_List_Tag();
        $listTopicTag->setFilter(array('topic_id' => $id));
        $listTopicTag->setPagesize(PHP_INT_MAX);
        $arrTopicTag = $listTopicTag->toArray();
        foreach ($arrTopicTag['list'] as  $val){
            $objTopicTag = new Topic_Object_Tag();
            $objTopicTag->fetch(array('id' => $val['id']));
            $redis->sRemove(Topic_Keys::getTopicTagKey($id),$objTopicTag->tagId);
            $objTopicTag->remove();
        }
        //删除话题景点关系
        $listSightTopic = new Sight_List_Topic();
        $listSightTopic->setFilter(array('topic_id' => $id));
        $listSightTopic->setPagesize(PHP_INT_MAX);
        $arrSightTopic = $listSightTopic->toArray();
        foreach ($arrSightTopic['list'] as $data){
            $objSightTopic = new Sight_Object_Topic();
            $objSightTopic->fetch(array('id' => $data['id']));
            $redis->hDel(Sight_Keys::getSightTongjiKey($objSightTopic->sightId), Sight_Keys::TOPIC);
            $redis->sRemove(Sight_Keys::getSightTopicKey($objSightTopic->sightId),$id);
            $num = $redis->sCard(Sight_Keys::getSightTopicKey($objSightTopic->sightId));
            $objSightTopic->remove();
        }
    
        //更新redis统计数据
        $redis->hDel(Topic_Keys::getTopicVisitKey(),Topic_Keys::getLateKey($id, '*'));
        $redis->hDel(Topic_Keys::getTopicVisitKey(),Topic_Keys::getTotalKey($id));
        $redis->delete(Topic_Keys::getTopicTagKey($id));
        return $ret;
    }
    
    /**
     * 获取话题列表信息
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getTopicList($page, $pageSize){
        $listTopic = new Topic_List_Topic();
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        $arrRet = $listTopic->toArray();
        foreach ($arrRet['list'] as $key => $val){
            $listTopictag = new Topic_List_Tag();
            $listTopictag->setFilter(array('topic_id' => $val['id']));
            $listTopictag->setPagesize(PHP_INT_MAX);
            $arrTag = $listTopictag->toArray();
            $arrRet['list'][$key]['tags'] = $arrTag['list'];
    
            $listSighttopic = new Sight_List_Topic();
            $listSighttopic->setFilter(array('topic_id' =>$val['id']));
            $listSighttopic->setPagesize(PHP_INT_MAX);
            $arrSighttopic = $listSighttopic->toArray();
            $arrRet['list'][$key]['sights'] = $arrSighttopic['list'];
        }
        return $arrRet;
    }
    
    /**
     * 根据条件获取话题信息
     * @param array $arrParam:参数数组，如：array('sight_id'=>1);
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public  function queryTopic($arrParam,$page,$pageSize){
        $listTopic = new Topic_List_Topic();
        $arrTopics = array();
        $filter    = '';
        $sight_id  = '';
        if(isset($arrParam['sight_id'])){
            $logic = new Topic_Logic_Topic();
            $arrTopics = $logic->getTopicBySight($arrParam['sight_id']);
            $sight_id  = $arrParam['sight_id'];
            unset($arrParam['sight_id']);
        }
        foreach ($arrParam as $key => $val){
            $filter = "`".$key."`=$val and ";
        }
        if(!empty($arrTopics)){
            $strTopics = implode(",",$arrTopics);
            $filter .= "`id` in ($strTopics)";
        }else{
            $filter = substr($filter,0,-4);
        }
        if(!empty($filter)){
            $listTopic->setFilterString($filter);
        }
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        $arrRet = $listTopic->toArray();
        foreach ($arrRet['list'] as $key => $val){
            $listTopictag = new Topic_List_Tag();
            $listTopictag->setFilter(array('topic_id' => $val['id']));
            $listTopictag->setPagesize(PHP_INT_MAX);
            $arrTag = $listTopictag->toArray();
            $arrRet['list'][$key]['tags'] = $arrTag['list'];
    
            $listSighttopic = new Sight_List_Topic();
            if(!empty($sight_id)){
                $listSighttopic->setFilter(array('topic_id' =>$val['id'],'sight_id' =>$sight_id));
            }else{
                $listSighttopic->setFilter(array('topic_id' =>$val['id']));
            }
            $listSighttopic->setPagesize(PHP_INT_MAX);
            $arrSighttopic = $listSighttopic->toArray();
            $arrRet['list'][$key]['sights'] = $arrSighttopic['list'];
        }
        return $arrRet;
    }
    
    /**
     * 修改话题状态接口
     * @param integer $topicId
     * @param integer $status
     * @return boolean
     */
    /*public function changeTopicStatus($topicId,$status){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $topicId));
        $objTopic->status = $status;
        return $objTopic->save();
    }*/
    
    public function addTopic($arrInfo){
        $objTopic = new Topic_Object_Topic();
        $redis    = Base_Redis::getInstance();
        foreach ($arrInfo as $key => $val){
            $key  = $this->getprop($key);
            $objTopic->$key = $val;
        }        
        $ret = $objTopic->save();
        if(isset($arrInfo['tags'])){
            $arrInfo['tags'] = array_unique($arrInfo['tags']);
            foreach($arrInfo['tags'] as $val){
                $objTopictag = new Topic_Object_Tag();
                $objTopictag->topicId = $objTopic->id;
                $objTopictag->tagId   = $val;
                $objTopictag->save();    
                $redis->sAdd(Topic_Keys::getTopicTagKey($objTopic->id),$val);
                
                //因为有的标签直接关联景点，所有改变了话题的标签，可能会影响景点的话题数，要更新缓存
                $listSightTag = new Sight_List_Tag();
                $listSightTag->setFilter(array('tag_id' => $val));
                $listSightTag->setPagesize(PHP_INT_MAX);
                $arrSightTag  = $listSightTag->toArray();
                foreach ($arrSightTag['list'] as $data){
                    $this->updateTopicRedis(self::ADD_TOPIC, $data['sight_id'], $objTopic->id);
                }
            }
        }
        if(isset($arrInfo['sights'])){
            $arrInfo['sights'] = array_unique($arrInfo['sights']);
            foreach($arrInfo['sights'] as $val){
                $objSightTopic = new Sight_Object_Topic();
                $objSightTopic->topicId = $objTopic->id;
                $objSightTopic->sightId = $val;
                $objSightTopic->save();
                if($objTopic->status == Topic_Type_Status::PUBLISHED){
                    $this->updateTopicRedis(self::ADD_TOPIC, $val, $objTopic->id);                    
                }                
            }
        }
        $redis->delete(Topic_Keys::getHotTopicNumKey());
        return $objTopic->id;        
    }
    
    public function editTopic($topicId,$arrInfo){
        $objTopic = new Topic_Object_Topic();
        $redis    = Base_Redis::getInstance();
        $objTopic->fetch(array('id' => $topicId));
        if(empty($objTopic->id)){
            return false;
        }
        foreach ($arrInfo as $key => $val){
            $key  = $this->getprop($key);
            $objTopic->$key = $val;
        }
        $ret = $objTopic->save();
    
        //话题状态修改，对应改变缓存中信息
        if(isset($arrInfo['status'])){
            $listSightTopic = new Sight_List_Topic();
            $listSightTopic->setFilter(array('topic_id' => $topicId));
            $listSightTopic->setPagesize(PHP_INT_MAX);
            $arrList = $listSightTopic->toArray();
            foreach($arrList['list'] as $key => $val){
                $this->updateTopicRedis(self::ADD_TOPIC, $val['sight_id'], $topicId);
            }
        }
                 
        if(isset($arrInfo['tags'])){
            $listTopicTag = new Topic_List_Tag();
            $listTopicTag->setFilter(array('topic_id' => $topicId));
            $listTopicTag->setPagesize(PHP_INT_MAX);
            $arrList = $listTopicTag->toArray();
            foreach($arrList['list'] as $key => $val){
                $objTopicTag = new Topic_Object_Tag();
                $objTopicTag->fetch(array('id' => $val['id']));
                if(!in_array($objTopicTag->tagId,$arrInfo['tags'])){
                    $redis->sRemove(Topic_Keys::getTopicTagKey($topicId),$objTopicTag->tagId);
                    $objTopicTag->remove();
                }
                
                //因为有的标签直接关联景点，所有改变了话题的标签，可能会影响景点的话题数，要更新缓存
                $listSightTag = new Sight_List_Tag();
                $listSightTag->setFilter(array('tag_id' => $val['tag_id']));
                $listSightTag->setPagesize(PHP_INT_MAX);
                $arrSightTag  = $listSightTag->toArray();
                foreach ($arrSightTag['list'] as $data){
                    $redis->hDel(Sight_Keys::getSightTongjiKey($data['sight_id']), Sight_Keys::TOPIC);
                }
            }
    
            foreach($arrInfo['tags'] as $tag){
                $objTopicTag = new Topic_Object_Tag();
                $objTopicTag->fetch(array('topic_id' => $topicId,'tag_id' =>$tag));
                if(empty($objTopicTag->id)){
                    $objTopicTag->tagId   = $tag;
                    $objTopicTag->topicId = $topicId;
                    $objTopicTag->save();
                    $redis->sAdd(Topic_Keys::getTopicTagKey($topicId),$objTopicTag->tagId);
                }
                
                //因为有的标签直接关联景点，所有改变了话题的标签，可能会影响景点的话题数，要更新缓存
                $listSightTag = new Sight_List_Tag();
                $listSightTag->setFilter(array('tag_id' => $tag));
                $listSightTag->setPagesize(PHP_INT_MAX);
                $arrSightTag  = $listSightTag->toArray();
                foreach ($arrSightTag['list'] as $data){
                    $redis->hDel(Sight_Keys::getSightTongjiKey($data['sight_id']), Sight_Keys::TOPIC);
                }
            }
        }
    
        if(isset($arrInfo['sights'])){
            $listSightTopic = new Sight_List_Topic();
            $listSightTopic->setFilter(array('topic_id' => $topicId));
            $listSightTopic->setPagesize(PHP_INT_MAX);
            $arrList = $listSightTopic->toArray();
            foreach($arrList['list'] as $key => $val){
                $objSightTopic = new Sight_Object_Topic();
                $objSightTopic->fetch(array('id' => $val['id']));
                if(!in_array($objSightTopic->sightId,$arrInfo['sights'])){
                    $this->updateTopicRedis(self::DEL_TOPIC, $objSightTopic->sightId, $topicId);
                    $objSightTopic->remove();
                }
            }
    
            foreach($arrInfo['sights'] as $sight){
                $objSightTopic = new Sight_Object_Topic();
                $objSightTopic->fetch(array('topic_id' => $topicId,'sight_id' =>$sight));
                if(empty($objSightTopic->id)){
                    $objSightTopic->sightId = $sight;
                    $objSightTopic->topicId = $topicId;
                    $objSightTopic->save();
                    if($objTopic->status == Topic_Type_Status::PUBLISHED){
                       $this->updateTopicRedis(self::ADD_TOPIC, $sight, $topicId);
                    }                    
                }
            }            
        }
        $redis->delete(Topic_Keys::getHotTopicNumKey());
        $redis->delete(Topic_Keys::getTopicContentKey($topicId));
        return $ret;
    }
    
    /**
     * 根据话题名搜索话题，并且结果不包含标签、景点信息
     * @param string $query
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function searchTopic($query,$page,$pageSize){
        $arrTopic  = Base_Search::Search('topic', $query, $page, $pageSize, array('id','title','content'));
        $num       = $arrTopic['num'];
        $arrTopic  = $arrTopic['data'];
        foreach ($arrTopic as $key => $val){
            $topic = $this->getTopicById($val['id']);
            $arrTopic[$key]['image']       = isset($topic['image'])?Base_Image::getUrlByName($topic['image']):'';
            $arrTopic[$key]['search_type'] = 'topic';
        }
        return array('data' => $arrTopic,'num' => $num);
    }
    
    /**
     * 根据条件获取话题数量
     * @param array $arrInfo
     * @param integer 
     */
    public function getTopicNum($arrInfo){
        $sightId   = isset($arrInfo['sightId'])?intval($arrInfo['sightId']):'';
        $arrTopics = array();
        $count     = 0;
        $listTopic = new Sight_List_Topic();
        $listTopic->setPagesize(PHP_INT_MAX);
        if(!empty($sightId)){
            $listTopic->setFilter(array('sight_id' => $sightId));
        }
        $arrTopics = $listTopic->toArray();
        if(isset($arrInfo['sightId'])){
            unset($arrInfo['sightId']);
        }
        if(!empty($arrTopics['list'])){
            foreach ($arrTopics['list'] as $topic){
                $arrInfo['id'] = $topic['topic_id'];
                $objTopic      = new Topic_Object_Topic();
                $objTopic->fetch($arrInfo);
                if(!empty($objTopic->id)){
                    $count += 1;   
                }
            }
        }
        return $count;
    }
    
    /**
     * 根据景点ID获取话题数
     * @param integer $sightId
     * @return integer
     */
    public function getTopicNumBySight($sightId,$status){
        $redis = Base_Redis::getInstance();
        $num   = $redis->sCard(Sight_Keys::getSightTopicKey($sightId));
        $num = ''; 
        if(empty($num)){
            $num = 0;
            $listTopic = new Sight_List_Topic();
            $objTopic  = new Topic_Object_Topic();
            $listTopic->setFilter(array('sight_id' => $sightId));
            $listTopic->setPagesize(PHP_INT_MAX);
            $arrTopics = $listTopic->toArray();
            foreach ($arrTopics['list'] as $val){
                $objTopic->fetch(array('id' => $val['topic_id']));
                if ($objTopic->status == $status) {
                    $redis->sAdd(Sight_Keys::getSightTopicKey($sightId),$val['topic_id']);
                    $num += 1;
                }
            }
        }
        return $num;
    }
    
    /**
     * 获取通用标签所包含的话题ID集合
     * @param string $strTag
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getGeneralTopicIds($strTag,$page,$pageSize){
        $arrTags       = explode(",",$strTag);
        $listTopicTage = new Topic_List_Tag();
        $arrRet        = array();
        foreach ($arrTags as $tagId){
            $listTopicTage->setFilter(array('tag_id' => $tagId));
            $listTopicTage->setPage($page);
            $listTopicTage->setPagesize($pageSize);
            $ret = $listTopicTage->toArray();
            foreach ($ret['list'] as $val){
                $arrRet[] = array('id' => strval($val['topic_id']));
            }
        }        
        return $arrRet;
    }
    
    /**
     * 获取通用标签所包含的话题ID集合
     * @param string $strTag
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getTopTopicIds($strTag, $sightId, $page, $pageSize){
        $arrTags         = array();
        $arrIds          = array();
        $logicTag        = new Tag_Logic_Tag();
        $limit_num       = Base_Config::getConfig('showtag')->topicnum;
        $strTopicIds = $this->getTopicIdBySight($sightId);
        if(!empty($strTopicIds)){
            $arrTopicIds = explode(",",$strTopicIds);
        }        
        $arrSecond = Tag_Api::getTagRelation($strTag, 1, PHP_INT_MAX);
        foreach ($arrSecond['list'] as $tag){
            $num = $this->model->getTopicNumByTag($tag['classifytag_id'], $sightId);
            $objTag = new Tag_Object_Tag();
            $objTag->fetch(array('id' => $tag['classifytag_id']));
            if($num < $limit_num || $objTag->weight == -1){
                if(!in_array($tag['classifytag_id'],$arrIds)){
                    $arrIds[] = $tag['classifytag_id'];
                }
           }
        }
        $strTagIds     = implode(",",$arrIds);
        $arrRet        = $this->model->getHotTopicIdsByTopicAndTag($strTopicIds, $strTagIds, $page, $pageSize);
        return $arrRet;
    }
    
    /**
     * 有新话题发布时更新redis
     * @param integer $type,1:新增，2：删除
     * @param integer $sightId
     */
    public function updateTopicRedis($type,$sightId,$topicId){
        //让缓存话题数据失效
        $redis = Base_Redis::getInstance();        
        $redis->delete(Sight_Keys::getSightTopicKey($sightId));
        $redis->hDel(Sight_Keys::getSightTongjiKey($sightId), Sight_Keys::TOPIC);
        $logicSight = new Sight_Logic_Sight();
        $sight   = $logicSight->getSightById($sightId);
        if(isset($sight['city_id'])){
            $redis->hDel(City_Keys::getCityTopicNumKey(),$sight['city_id']);
            $arrKeys = $redis->keys(City_Keys::getCityTopicKey($sight['city_id'], '*', '*'));
            foreach ($arrKeys as $key){
                $redis->delete($key);
            }
        }
    }
    
    public function getTopicNumByTag($tagId, $sightId){
        $total  = 0;
        $objTag = new Tag_Object_Tag();
        $objTag->fetch(array('id' => $tagId));
        if($objTag->type == Tag_Type_Tag::GENERAL){
             //通用标签
             $listTopicTag = new Topic_List_Tag();
             $listTopicTag->setFilter(array('tag_id' => $tagId));
             $listTopicTag->setPagesize(PHP_INT_MAX);
             $arrTopics = $listTopicTag->toArray();
             foreach ($arrTopics['list'] as $val){
                 $objTopic = new Topic_Object_Topic();
                 $objTopic->fetch(array('id' => $val['topic_id']));
                 if($objTopic->status == Topic_Type_Status::PUBLISHED){
                     $total += 1;
                 }
             }
        }else{
             //分类标签或普通标签
             $logicTopic = new Topic_Logic_Topic();
             $strTopics  = $logicTopic->getTopicIdBySight($sightId);
             $arrTopics  = explode(",",$strTopics);
             foreach ($arrTopics as $id){
                 $objTopic = new Topic_Object_Topic();
                 $objTopic->fetch(array('id' => $id));
                 if($objTopic->status == Topic_Type_Status::PUBLISHED){
                     $listTopicTag = new Topic_List_Tag();
                     $listTopicTag->setFilter(array('topic_id' => $id,'tag_id' => $tagId));
                     $listTopicTag->setPagesize(PHP_INT_MAX);
                     $total += $listTopicTag->countAll();
                 }
             }
        }
        return $total;
    }
    
    public function getAllHotTopic($page,$pageSize){
        $listTopic = new Topic_List_Topic();
        $listTopic->setFilter(array('status' => Topic_Type_Status::PUBLISHED));
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        $listTopic->setOrder('`hot3` desc, `create_time` desc');
        return $listTopic->toArray();
    }
    
    public function getHotTopicNum(){
        $redis = Base_Redis::getInstance();
        $count = $redis->get(Topic_Keys::getHotTopicNumKey());
        if(!empty($count)){
            return $count;
        }
        $listTopic = new Topic_List_Topic();
        $listTopic->setFilter(array('status' => Topic_Type_Status::PUBLISHED));
        $count     = $listTopic->getTotal();
        $redis->set(Topic_Keys::getHotTopicNumKey(),$count);
        return $count;
    }
}