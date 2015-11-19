<?php
/**
 * 用户页面controller基础类
 * @author hejunhua
 */
class Base_Controller_Page extends Base_Controller_Abstract {

    public function init(){
        //增加日志字段
        $this->addBaseLogs(array('type'=>'page'));

        parent::init();

        $this->getView()->assign('webroot', $this->webroot);
        $this->getView()->assign('stroot',Base_Config::getConfig('web')->stroot);
        $feversion = Base_Config::getConfig('web')->version;
        $this->getView()->assign('feroot', Base_Config::getConfig('web')->stroot . '/v1/'. $feversion . '/asset');
        $this->getView()->assign('tongji', Base_Config::getConfig('web')->tongji);
        
        //判断是否来自移动端
        $isMobile = Base_Util_Mobile::isMobile(); 
        $this->getView()->assign('isMobile', $isMobile); 

        //set csrf token
        /*$token = Yaf_Session::getInstance()->get(Base_Keys::getCsrfTokenKey());
        if(empty($token)){
            $token = time() . mt_rand(10000, 99999);
            $ret   = Yaf_Session::getInstance()->set(Base_Keys::getCsrfTokenKey(), $token);
            //防止错误时验证无法访问
            $token = $ret ? $token : '';
        }
        $this->getView()->assign('token', $token);*/
    }

    protected function isAjax(){
        return false;
    }

    public function redirect($url){
        parent::redirect($url);
        exit;
    }
}
