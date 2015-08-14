<?php
class TopicModel{
    
    const MONTH = 30;
    
    const WEEK  = 7;
    
    protected $db;
    
    public function __construct(){
        $this->db = Base_Db::getInstance('getontrip');
    }
    
    /**
     * 获取热门话题
     * @param string $strTopicId
     * @param string $strTags
     * @param integer $size
     * @return array
     */
    public function getHotTopics($strTopicId,$strTags,$page,$pageSize,$during){
        $from = ($page-1)*$pageSize;
        if(empty($strTags)){
            if($during == self::MONTH){
                $sql = "SELECT `id`,`title`,`subtitle`,`image`,`from`,`desc`,`content` FROM `topic`   WHERE  `id` in(".$strTopicId.") ORDER BY `hot2` desc,`update_time` desc limit $from,$pageSize";
            }elseif($during == self::WEEK){
                $sql = "SELECT `id`,`title`,`subtitle`,`image`,`from`,`desc`,`content` FROM `topic`   WHERE  `id` in(".$strTopicId.") ORDER BY `hot1` desc,`update_time` desc limit $from,$pageSize";
            }
        }else{
            if($during == self::MONTH){
                $sql = "SELECT a.id,a.title,a.subtitle,a.image,a.from,a.desc,a.content FROM `topic`  a,`topic_tag`  b WHERE a.status = 5 a.id=b.topic_id AND a.id in(".$strTopicId.") AND b.tag_id in(".$strTags.") ORDER by a.hot2 desc, a.update_time desc limit $from,$pageSize";
            }elseif($during == self::WEEK){
                $sql = "SELECT a.id,a.title,a.subtitle,a.image,a.from,a.desc,a.content FROM `topic`  a,`topic_tag`  b WHERE a.status = 5 a.id=b.topic_id AND a.id in(".$strTopicId.") AND b.tag_id in(".$strTags.") ORDER by a.ho1 desc, a.update_time desc limit $from,$pageSize";
            }
        }       
        try {                 	
            $data = $this->db->fetchAll($sql);          
        } catch (Exception $ex) {
            Base_Log::error($ex->getMessage());          
            return array();
        }
        return $data;
    }
    
    /**
     * 获取最新话题
     * @param string $strTopicId
     * @param string $strTags
     * @param integer $size
     * @return array
     */
    public function getNewTopics($strTopicId,$strTags,$page,$pageSize){
        $from = ($page-1)*$pageSize;
        if(empty($strTags)){
            $sql = "SELECT `id`,`title`,`subtitle`,`image`,`from`,`desc`,`content` FROM `topic`   WHERE  `id` in(".$strTopicId.") ORDER BY `update_time` desc limit $from,$pageSize";
        }else{
            $sql = "SELECT a.id,a.title,a.subtitle,a.image,a.from,a.desc,a.content FROM `topic`  a,`topic_tag`  b WHERE a.id=b.topic_id AND a.id in(".$strTopicId.") AND b.tag_id in(".$strTags.") ORDER by a.update_time desc limit $from,$pageSize";
        }
        try {
            $data = $this->db->fetchAll($sql);
        } catch (Exception $ex) {
            Base_Log::error($ex->getMessage());
            return array();
        }
        return $data;
    }
}