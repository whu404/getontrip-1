<?php
/**
 * 话题详情页接口
 * @author huwei
 *
 */
class ApiController extends Base_Controller_Api {
    
    const PAGESIZE = 6;
    
    public function init() {
        $this->setNeedLogin(false);
        parent::init();        
    }
    
    /**
     * 接口1：/api/topic
     * 话题详情页接口
     * @param integer topicId，话题ID
     * @return json
     */
    public function indexAction() {
        $topicId    = isset($_REQUEST['topicId'])?intval($_REQUEST['topicId']):'';
        if(empty($topicId)){
            return $this->ajaxError(Base_RetCode::PARAM_ERROR,Base_RetCode::getMsg(Base_RetCode::PARAM_ERROR));
        }        
        $logic      = new Topic_Logic_Topic();
        $ret        = $logic->getTopicDetail($topicId);
        $content    = $ret['content'];
        if($content != ""){
            $spider  = Spider_Factory::getInstance("Filterimg",$content,Spider_Type_Source::STRING);
            $ret['content'] = $spider->getContentToDis();
        }   
        $this->ajaxDecode($ret);
    }  
}