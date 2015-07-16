<?php
/**
 */
class DetailController extends Base_Controller_Api {
    
    const PAGESIZE = 6;
    
    public function init() {
        $this->setNeedLogin(false);
        parent::init();        
    }
    
    /**
     * 景点详情接口
     */
    public function indexAction() {
        //$page       = $_POST['page'];
        //$pageSize   = $_POST['pageSize'];
        //$sight      = $_POST['sight'];
        $page = 1;
        $pageSize = 10;
        $sight = 1;
        $logic      = new Sight_Logic_Sight();
        $ret        = $logic->getSightDetail($sight,$page,$pageSize);
        $this->ajax($ret);
    }
    
}
