<?php
/**
 * API controller基础类
 * @author hejunhua
 */
class Base_Controller_Api extends Base_Controller_Abstract {
    
    public function init () {
        //增加日志字段
        $this->addBaseLogs(array('type'=>'api'));

        parent::init();

        Yaf_Dispatcher::getInstance()->disableView();
        $arrUrl    = explode("/",$_SERVER['REQUEST_URI']);
        if(strtolower($arrUrl[1]) == "admin"){
            return;
        }
        //统一验证token      
        $token     = isset($_REQUEST['token']) ? trim($_REQUEST['token']) : '';
        $type      = isset($_REQUEST['token_type'])?intval($_REQUEST['token_type']):'';
        if(!empty($type)){
            $csrftoken = Yaf_Session::getInstance()->get(Base_Keys::getCsrfTokenKey());
            $bCheck    = ($csrftoken == $token)?true:false;
        }else{
            $bCheck    = $this->checkToken($token);
        }
        if(!$bCheck){
            Base_Log::warn(array(
                'msg'        => 'Csrf token invalid', 
                'post_token' => $token,
            ));
            @header("Content-Type: application/json; charset=UTF-8");
            $arrRtInfo = array();
            $arrRtInfo['status'] = Base_RetCode::TOKEN_INVALID;
            //$arrRtInfo['statusInfo'] = Base_RetCode::getMsg(Base_RetCode::TOKEN_INVALID);
            $arrRtInfo['data'] = array();
            $output = json_encode($arrRtInfo);
            echo $output;
            exit;
        }else{
            Base_Log::debug(array(
                'msg'        => 'Csrf token valid', 
                'post_token' => $token,
            ));
        }
    }

    protected function isAjax() {
        return true;
    }
    
    public function getVersion(){
        $request = $this->getRequest();
        $param   = $request->getParams();
        return $param['version'];
    }
    
    public function addCache($arrData){
        @$md5 = md5(json_encode($arrData));
        $this->setBrowserCache($md5,0);
        if(isset($_SERVER['HTTP_IF_NONE_MATCH']) && ($md5 == $_SERVER['HTTP_IF_NONE_MATCH'])){
            @header("Content-Type: application/json; charset=UTF-8" , true, 304);
        }
    }
   
    public function ajax($arrData = array(), $errorMsg = '', $status = 0){
        @header("Content-Type: application/json; charset=UTF-8");
        $arrRtInfo = array();
        $arrRtInfo['status'] = $status;
        $arrRtInfo['statusInfo'] = $errorMsg;
        $arrRtInfo['data']= $arrData;
        
        $output = json_encode($arrRtInfo);
        $output = str_replace("<","&lt;",$output);
        $output = str_replace(">","&gt;",$output);
        $this->_response->setBody($output);
    }
    
    //将转义后的字符进行decode处理，输出未转义原样
    public function ajaxDecode($arrData = array(), $errorMsg = '', $status = 0){
        @header("Content-Type: application/json; charset=UTF-8");

        $arrRtInfo = array();
        $arrRtInfo['status'] = $status;
        $arrRtInfo['statusInfo'] = $errorMsg;
        $arrRtInfo['data']= $arrData;
        
        $output = json_encode($arrRtInfo);
        $output = str_replace("&lt;","<",$output);
        $output = str_replace("&gt;",">",$output);
        $this->_response->setBody($output);
    }

    public function ajaxRaw($arrData){
        Yaf_Dispatcher::getInstance()->disableView();
        @header("Content-Type: application/json; charset=UTF-8");
        $output = json_encode($arrData);
        $output = str_replace("<","&lt;",$output);
        $output = str_replace(">","&gt;",$output);
        $this->_response->setBody($output);
    }
    
    /**
     * ajax输出 支持HTML格式
     * @param array $arrData
     */
    public function ajaxHTML($arrData){
        @header("Content-Type: application/json; charset=UTF-8");

        $arrRtInfo = array();
        $arrRtInfo['status'] = 0;
        $arrRtInfo['statusInfo'] = '';
        $arrRtInfo['data']= $arrData;
        
        $output = json_encode($arrRtInfo);
        $this->_response->setBody($output);
    }

    public function jsonp($callback = '', $arrData = array(), $errorMsg = '', $status = 0){
        @header("Content-Type: application/javascript; charset=UTF-8");
        $arrRtInfo = array();
        $arrRtInfo['status'] = $status;
        $arrRtInfo['statusInfo'] = $errorMsg;
        $arrRtInfo['data']= $arrData;
        
        $strJsonRet = json_encode($arrRtInfo);
        $strJsonRet = str_replace("<","&lt;",$strJsonRet);
        $strJsonRet = str_replace(">","&gt;",$strJsonRet);
        if($callback){
            $this->_response->setBody($callback.'('.$strJsonRet.');');
        }else{
            $this->_response->setBody($strJsonRet);
        }
    }
   
    public function ajaxError($errorCode = Base_RetCode::UNKNOWN_ERROR, $errorMsg = '', $arrData = array()) {
        @header("Content-Type: application/json; charset=UTF-8");
        $arrRtInfo = array();
        $arrRtInfo['status'] = $errorCode;
        $arrRtInfo['statusInfo'] = empty($errorMsg) ? Base_RetCode::getMsg($errorCode) : $errorMsg;
        $arrRtInfo['data']= $arrData;

        $output = json_encode($arrRtInfo);
        $this->_response->setBody($output);
    }

    public function jsonpError($callback = '', $errorCode = Base_RetCode::UNKNOWN_ERROR, $errorMsg = '', $arrData = array()) {
        @header("Content-Type: application/javascript; charset=UTF-8");
        $arrRtInfo = array();
        $arrRtInfo['status'] = $errorCode;
        $arrRtInfo['statusInfo'] = empty($errorMsg) ? Base_RetCode::getMsg($errorCode) : $errorMsg;
        $arrRtInfo['data']= $arrData;
        $strJsonRet = json_encode($arrRtInfo);
        if($callback){
            $this->_response->setBody($callback.'('.$strJsonRet.');');
        }else{
            $this->_response->setBody($strJsonRet);
        }
    }

    /** 
     * 前端跳转
     * @param   $url jump url
     */
    public function ajaxJump($url, $arrData = null){
        @header("Content-Type: application/json; charset=UTF-8"); 
        $arrRtInfo               = array();
        $arrRtInfo['status']     = Base_RetCode::NEED_REDIRECT;
        $arrRtInfo['statusInfo'] = Base_RetCode::getMsg(Base_RetCode::NEED_REDIRECT);
        $arrRtInfo['data']       = array('url' => $url);
        
        $output = json_encode($arrRtInfo);
        $this->_response->setBody($output);       
    }

}
