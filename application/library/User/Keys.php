<?php
class User_Keys {

    const SESSION_OPENID_KEY      = 'openid';

    const SESSION_AUTHTYPE_KEY    = 'authtype';
    
    const SESSION_LOGINADMIN_KEY  = 'login_admin';

    const SESSION_LOGINUSER_KEY   = 'login_user';
    
    const COOKIE_CURRENTUSER_KEY  = 'current_user';
    
    const COOKIE_DEVICEID_KEY     = 'device_id';

    const ACCESS_TOKEN_KEY        = 'user_openid_%s';
    
    const OPEN_INFO_KEY           = 'openinfo_%s_%s';
    
    const SMS_CODE_KEY            = 'smscode_%s_%s';
   

    public static function getOpenidKey(){
        return self::SESSION_OPENID_KEY;
    }

    public static function getAuthTypeKey(){
    	return self::SESSION_AUTHTYPE_KEY;
    }

    public static function getLoginUserKey(){
    	return self::SESSION_LOGINUSER_KEY;
    }
    
    public static function getLoginAdminKey(){
        return self::SESSION_LOGINADMIN_KEY;
    }

    public static function getAccessTokenKey($openid){
        return sprintf(self::ACCESS_TOKEN_KEY, $openid);
    }

    public static function getOpenInfoKey($authtype, $openid){
        return sprintf(self::OPEN_INFO_KEY, $authtype, $openid);
    }
    
    public static function getCurrentUserKey(){
        return self::COOKIE_CURRENTUSER_KEY;
    }
    
    public static function getDeviceIdKey(){
        return self::COOKIE_DEVICEID_KEY;
    }
    
    public static function getSmsCodeKey($strPhone, $strType){
        return sprintf(self::SMS_CODE_KEY, $strPhone, $strType);
    }
}
