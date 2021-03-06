<?php
class Food_Keys {
    
    //美食详情
    const REDIS_FOOD_INFO_KEY   = 'food_%s_%s';
    
    const REDIS_FOOD_TOPIC_NUM  = 'food_topic_num';
    
    const REDIS_FOOD_TOPIC_IDS  = 'food_topic_id_%s';
    
    //美食推荐的话题ID数据
    const REDIS_FOOD_RECOMMEND  = 'food_recommend_%s';
    
    //美食黑名单
    const REDIS_BLACK_FOOD_KEY  = 'black_food_%s';

    public static function getFoodInfoName($sightId,$index){
        return sprintf(self::REDIS_Food_INFO_KEY, $sightId,$index);
    }
    
    public static function getBlackFoodName($id){
        return sprintf(self::REDIS_BLACK_FOOD_KEY, $id);
    }
    
    public static function getFoodRecommend($id){
        return sprintf(self::REDIS_FOOD_RECOMMEND, $id);
    }
    
    public static function getFoodTopicNum(){
        return self::REDIS_FOOD_TOPIC_NUM;
    }
    
    public static function getFoodTopicIds($id){
        return sprintf(self::REDIS_FOOD_TOPIC_IDS, $id);
    }
}
