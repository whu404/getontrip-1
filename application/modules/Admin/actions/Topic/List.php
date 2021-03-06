<?php
/**
 * 话题列表
 * @author fanyy
 *
 */
class ListAction extends Yaf_Action_Abstract {
    public function execute() { 
    	$statusTypeArray=Topic_Type_Status::$names;
    	$this->getView()->assign('statusTypeArray', $statusTypeArray);

    	//处理传递过来的景点
        $sight_id  = isset($_REQUEST['sight_id'])?intval($_REQUEST['sight_id']):'';
        if($sight_id!=''){
           $sight=Sight_Api::getSightById($sight_id); 
           $this->getView()->assign('sight', $sight);
        } 
    }
}
