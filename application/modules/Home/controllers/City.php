<?php
/**
 * 首页指定城市后数据
 * @author huwei
 *
 */
class IndexController extends Base_Controller_Api {
    
    const PAGESIZE = 6;
    
    public function init() {
        $this->setNeedLogin(false);
        parent::init();        
    }
    
    /**
     * 接口1：/home
     * 首页数据获取接口
     * @param double x，经度
     * @param double y，纬度
     * @param integer page，页码
     * @param integer pageSize，页面大小
     * @return json
     */
    public function indexAction() {
        $page      = isset($_POST['page'])?intval($_POST['page']):1;
        $pageSize  = isset($_POST['size'])?$_POST['size']:self::PAGESIZE;
        $x = 100;
        $y = 100;
        if(empty($x) || empty($y)){
            return $this->ajaxError(Base_RetCode::PARAM_ERROR,Base_RetCode::getMsg(Base_RetCode::PARAM_ERROR));
        }                       
        $logic = new Home_Logic_List();
        $ret = $logic->getNearSight($x,$y,$page,$pageSize);
        return $this->ajax($ret);
    }       
    
}