<?php
/**
 * 添加收藏接口
 * @author huwei
 *
 */
class ApiController extends Base_Controller_Api {
    
    const PAGESIZE = 6;
    
    protected $logic;
    
    public function init() {
        $this->setNeedLogin(true);
        parent::init();
        $this->logic     = new Collect_Logic_Collect();     
    }
    
    /**
     * 接口1：/api/collect/add
     * 添加收藏接口
     * @param integer type,2：景点；3:城市; 4:话题;5:书籍
     * @param integer objid，收藏对象的ID
     * @return json
     */
    public function addAction() {
        $type      = isset($_REQUEST['type'])?intval($_REQUEST['type']):Collect_Type::TOPIC;
        $obj_id    = isset($_REQUEST['objid'])?intval($_REQUEST['objid']):'';
        if(empty($obj_id)){
            return $this->ajaxError(Collect_RetCode::PARAM_ERROR,
                Collect_RetCode::getMsg(Collect_RetCode::PARAM_ERROR));
        }
        $ret = $this->logic->addCollect($type, $this->userid, $obj_id);
        return $this->ajax(strval($ret));
    } 
    
    /**
     * 接口2：/api/collect/del
     * 取消收藏接口
     * @param integer type,2：景点；3:城市,4:话题,5:书籍
     * @param integer objid，收藏对象的ID
     * @return json
     */
    public function delAction() {
        $type      = isset($_REQUEST['type'])?intval($_REQUEST['type']):Collect_Type::TOPIC;
        $obj_id    = isset($_REQUEST['objid'])?intval($_REQUEST['objid']):'';
        if(empty($obj_id)){
            return $this->ajaxError(Collect_RetCode::PARAM_ERROR,
                Collect_RetCode::getMsg(Collect_RetCode::PARAM_ERROR));
        }
        $ret = $this->logic->delCollect($type, $this->userid, $obj_id);
        return $this->ajax(strval($ret));
    }

    /**
     * 接口3：/api/collect/list
     * 获取收藏列表内容
     * @param integer type,1：内容;2：景点；3：城市
     * @param integer page，页码
     * @param integer pageSize，页面大小
     * @return json
     */
    public function listAction() {
        $type      = isset($_REQUEST['type'])?intval($_REQUEST['type']):'';
        $page      = isset($_REQUEST['page'])?intval($_REQUEST['page']):1;
        $pageSize  = isset($_REQUEST['pageSize'])?intval($_REQUEST['pageSize']):self::PAGESIZE;
        if(empty($type)){
            return $this->ajaxError(Collect_RetCode::PARAM_ERROR,
                Collect_RetCode::getMsg(Collect_RetCode::PARAM_ERROR));
        }
        $ret = $this->logic->getCollect($type, $this->userid,$page,$pageSize);
        return $this->ajax($ret);
    }
}
