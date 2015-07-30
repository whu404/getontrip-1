<?php
/**
 * 评论页接口
 * @author huwei
 *
 */
class ListController extends Base_Controller_Api {
    
    const PAGESIZE = 6;
    
    public function init() {
        $this->setNeedLogin(false);
        parent::init();        
    }
    
    /**
     * 接口1：/comment/list
     * 评论列表页
     * @param integer topicId，话题ID
     * @param integer page
     * @param integer pageSize
     * @return json
     */
    public function indexAction() {
        $topicId    = isset($_POST['topicId'])?intval($_POST['topicId']):'';
        $page       = isset($_POST['page'])?intval($_POST['page']):1;
        $pageSize   = isset($_POST['pageSize'])?intval($_POST['pageSize']):self::PAGESIZE;
        if(empty($topicId)){
            return $this->ajaxError(Base_RetCode::PARAM_ERROR,Base_RetCode::getMsg(Base_RetCode::PARAM_ERROR));
        }
        $logic      = new Comment_Logic_Comment();
        $ret        = $logic->getCommentList($topicId, $page, $pageSize);
        $this->ajax($ret);
    }    
}