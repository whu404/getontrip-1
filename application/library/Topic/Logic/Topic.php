<?php
/**
 * 话题逻辑层
 * @author huwei
 *
 */
class Topic_Logic_Topic{
    
    protected $sightId = '';
    protected $size    = 0;
    protected $strTags = '';
    protected $strDate = "1 month ago";
    
    public function __construct(){
        
    }
    
    /**
     * 获取最热门的话题，带景点ID、时间范围、大小、标签过滤，并加上答案等信息
     * @param integer $sightId
     * @param integer $size
     * @return array
     */
    public function getHotTopic($sightId,$period='1 month ago',$size=2,$strTags=''){
        $arrHotDegree     = array();
        $arrTags          = array();
        $arrTet           = array();
        $collectTopicNum  = 0;
        $visitTopicUv     = 0;
        $commentNum       = 0;
        
        $redis = Base_Redis::getInstance();
        
        //获取景点的所有话题
        if(!empty($sightId)){        
            $ret = $redis->zRange(Sight_Keys::getSightTopicName($sightId),0,-1);
        }else{
            $arrKeys = $redis->keys(Sight_Keys::getSightTopicName("*"));
            foreach ($arrKeys as $key){
                $ret = array_merge($ret,$redis->zRange($key,0,-1));
            }            
        }
        foreach($ret as $key => $val){
            //根据标签过滤话题
            if(!empty($strTags)){
                $arrTags = explode(",",$strTags);
                $arrHasTags = $redis->sGetMembers(Topic_Keys::getTopicTagKey($val['id']));
                $temp = array_diff($arrHasTags,$arrTags);
                if(count($arrHasTags) == count($temp)){
                    continue;
                }
            }              
            
            $objTopic = new Topic_Object_Topic();
            $objTopic->fetch(array('id' => $val));
            $arrRet[] = $objTopic->toArray();
                                   
            $arrHotDegree[] = $this->getTopicHotDegree($val, $period);
            
            //话题访问次数            
            $arrRet[$key]['visit']   = $this->getTopicVistPv($val, $period);
            
            //话题收藏数
            $arrRet[$key]['collect'] = $collectTopicNum;
            
            //话题来源
            $logicSource = new Source_Logic_Source();
            $arrRet[$key]['from']    = $logicSource->getSourceName($objTopic->from);
        }        
        //根据权重排序
        array_multisort($arrHotDegree, SORT_DESC , $arrRet);
        return array_slice($arrRet,0,$size);
    }
    
    /**
     * 获取最新的话题，带景点、时间范围、大小、标签过滤，并加上答案等信息:话题的更新时间取话题时间与答案时间中的最新者
     * @param integer $sightId
     * @param integer $size
     * @return array
     */
    public function getNewTopic($sightId,$period='1 month ago',$page,$pageSize,$strTags=''){
        $arrHotDegree     = array();
        $arrTags          = array();
        $collectTopicNum  = 0;
        $visitTopicNum    = 0;
        $strFileter       = 'true';
        
        $redis = Base_Redis::getInstance();
        
        $listTopic = new Topic_List_Topic();
        
        if(!empty($sightId)){
            $ret = $redis->zRange(Sight_Keys::getSightTopicName($sightId),0,-1);
            $strTopicIds = implode(",",$ret);
            $strFileter = "`id` in($strTopicIds)";           
        }
        if(!empty($period)){
            $time      = strtotime($period);
            $strFileter .= " AND `update_time` > $time";
        }
        $listTopic->setFields(array('id','title','content','desc','image'));
        $listTopic->setFilterString($strFileter);
        $listTopic->setOrder("update_time desc");
        $listTopic->setPage($page);
        $listTopic->setPagesize($pageSize);
        $ret = $listTopic->toArray();
        foreach($ret['list'] as $key => $val){
            if(!empty($strTags)){
                $arrTags = explode(",",$strTags);
                $arrHasTags = $redis->sGetMembers(Topic_Keys::getTopicTagKey($val['id']));
                $temp = array_diff($arrHasTags,$arrTags);
                if(count($arrHasTags) == count($temp)){
                    continue;
                }
            }            

            //话题收藏数
            $logicCollect      = new Collect_Logic_Collect();
            $collectTopicNum   = $logicCollect->getLateCollectNum(Collect_Keys::TOPIC, $val['id']);             

            $ret['list'][$key]['visit']   = $this->getTopicVistPv($val, $period);
            $ret['list'][$key]['collect'] = $collectTopicNum;
            
            //话题来源
            $logicSource = new Source_Logic_Source();
            $arrRet[$key]['from']    = $logicSource->getSourceName($objTopic->from);
        }        
        return $ret;
    }
    
    
    /**
     * 根据景点ID获取一个月内的话题数
     * @param integer $sightId
     * @return integer
     */
    public function getHotTopicNum($sightId,$during){
        $redis = Base_Redis::getInstance();
        $start = 0;
        $end = time();
        if(!empty($during)){
            $start = strtotime($during);
        }
        $ret = $redis->zRangeByScore(Sight_Keys::getSightTopicName($sightId),$start,$end);
        return count($ret);
    }
    
    /**
     * 获取话题详细信息
     * @param integer $topicId
     * @return Topic_Object_Topic
     */
    public function getTopicDetail($topicId,$device_id,$page,$pageSize){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $topicId));
        $arrRet = $objTopic->toArray();
        
        //添加redis中话题访问次数统计
        $redis = Base_Redis::getInstance();
        
        $logicUser = new User_Logic_User();
        $userId    = $logicUser->getUserId($device_id);
        $redis->zAdd(Topic_Keys::getTopicVisitKey($topicId),time(),$userId);
               
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
    public function getTopicVistUv($topicId,$during){
        $redis   = Base_Redis::getInstance();
        $from    = strtotime($during);
        $arrUser = $redis->zRangeByScore(Topic_Keys::getTopicVisitKey($topicId),$from,time());
        return count(array_unique($arrUser));
    }
    
    /**
     * 获取话题最近的访问次数
     * @param integer $topicId
     * @param string $during
     * @return integer
     */
    public function getTopicVistPv($topicId,$during){
        $redis   = Base_Redis::getInstance();
        $from    = strtotime($during);
        $arrUser = $redis->zRangeByScore(Topic_Keys::getTopicVisitKey($topicId),$from,time());
        return count($arrUser);
    }
    
    /**
     * 获取话题的热度:热度=话题收藏数+评论数+话题浏览量
     * @param integer $sightId，景点ID
     * @param string $period,时间段
     * @return integer，话题热度
     */
    public function getTopicHotDegree($topicId,$period){
    
        //话题最近收藏数
        $logicCollect      = new Collect_Logic_Collect();
        $collectTopicNum   = $logicCollect->getLateCollectNum(Collect_Keys::TOPIC, $topicId,$period);
    
        //话题最近访问人数
        $visitTopicUv      = $this->getTopicVistUv($topicId, $period);
    
        //最近评论次数
        $logicComment      = new Comment_Logic_Comment();
        $commentNum        = $logicComment->getCommentNum($topicId, $period);
        
        return $collectTopicNum + $commentNum + $visitTopicUv;
    }
    
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
    
        foreach ($arrParam as $key => $val){
            $filter .= "`".$key."` = $val and ";
        }
        if(!empty($sight_id)){
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
             
            $logicCollect      = new Collect_Logic_Collect();           
            $arrRet['list'][$key]['collect'] = $logicCollect->getCollectNum(Collect_Keys::TOPIC, $val['id']);
            
            $logicComment      = new Comment_Logic_Comment();
            $arrRet['list'][$key]['comment'] = $logicComment->getCommentNum($val['id']);
        }
        return $arrRet;
    }
    
    public function delTopic($id){
        $redis = Base_Redis::getInstance();
        //删除话题
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $id));
        $objTopic->status = Topic_Type_Status::DELETED;
        $ret =  $objTopic->save();
    
        //删除答案
        $listAnswers = new Answers_List_Answers();
        $listAnswers->setFilter(array('topic_id' => $id));
        $listAnswers->setPagesize(PHP_INT_MAX);
        $arrAnswers = $listAnswers->toArray();
        foreach ($arrAnswers['list'] as $index => $val){
            $objAnswer = new Answers_Object_Answers();
            $objAnswer->fetch(array('id' => $val['id']));
            $objAnswer->status = Answers_Type_Status::DELETED;
            $objAnswer->save();
        }
    
        //删除话题标签关系
        $listTopicTag = new Topic_List_Tag();
        $listTopicTag->setFilter(array('topic_id' => $id));
        $listTopicTag->setPagesize(PHP_INT_MAX);
        $arrTopicTag = $listTopicTag->toArray();
        foreach ($arrTopicTag['list'] as $index => $val){
            $objTopicTag = new Topic_Object_Tag();
            $objTopicTag->fetch(array('id' => $val['id']));
            $objTopicTag->remove();
            $redis->sRemove(Topic_Keys::getTopicTagKey($id),$objTopicTag->tagId);
            $redis->hIncrBy(Tag_Keys::getTagInfoKey($objTopicTag->tagId),'num',-1);
        }
        //删除话题景点关系
        $listSigtTopic = new Sight_List_Topic();
        $listSigtTopic->setFilter(array('topic_id' => $id));
        $listSigtTopic->setPagesize(PHP_INT_MAX);
        $arrSigtTopic = $listSigtTopic->toArray();
        foreach ($arrSigtTopic['list'] as $index => $val){
            $objSightTopic = new Sight_Object_Topic();
            $objSightTopic->fetch(array('id' => $val['id']));
            $objAnswer->remove();
            $redis->zDelete(Sight_Keys::getSightTopicName($objSightTopic->sightId),$id);
        }
    
        //更新redis统计数据
        $redis->hDel(Topic_Keys::getTopicVisitKey(),$id);
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
    
        $listTopic->setFilterString($filter);
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
    public function changeTopicStatus($topicId,$status){
        $objTopic = new Topic_Object_Topic();
        $objTopic->fetch(array('id' => $topicId));
        $objTopic->status = $status;
        return $objTopic->save();
    }
    
    public function addTopic($arrInfo){
        $objTopic = new Topic_Object_Topic();
        $redis = Base_Redis::getInstance();
        foreach ($arrInfo as $key => $val){
            $objTopic->$key = $val;
        }
        $ret = $objTopic->save();
        if(isset($arrInfo['tags'])){
            foreach($arrInfo['tags'] as $val){
                $objTopictag = new Topic_Object_Tag();
                $objTopictag->topicId = $objTopic->id;
                $objTopictag->tagId   = $val;
                $objTopictag->save();
    
                $redis->sAdd(Topic_Keys::getTopicTagKey($objTopic->id),$val);
            }
        }
        if(isset($arrInfo['sights'])){
            foreach($arrInfo['sights'] as $val){
                $objSightTopic = new Sight_Object_Topic();
                $objSightTopic->topicId = $objTopic->id;
                $objSightTopic->sightId = $val;
                $objSightTopic->save();
    
                $redis->zAdd(Sight_Keys::getSightTopicName($val),time(),$objTopic->id);
            }
        }
        return $ret;
    }
    
    public function editTopic($topicId,$arrInfo){
        $objTopic = new Topic_Object_Topic();
        $redis    = Base_Redis::getInstance();
        $objTopic->fetch(array('id' => $topicId));
        if(empty($objTopic->id)){
            return false;
        }
        foreach ($arrInfo as $key => $val){
            $objTopic->$key = $val;
        }
        $ret = $objTopic->save();
    
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
                    $redis->zDelete(Sight_Keys::getSightTopicName($objSightTopic->sightId),$topicId);
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
                    $redis->zAdd(Sight_Keys::getSightTopicName($objSightTopic->sightId),time(),$topicId);
                }
            }
        }
        return $ret;
    }
}