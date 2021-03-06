<?php
/**
 * Adapter for TopazDb
 * usage:
 * $db = Base_Pg::getInstance('DB_NAME');
 * $rs = $db->query($sql);
 */
class Base_Pg {
    
    private static $_instance;

    private static $_bolMaster = false;

    protected static $_arrInstance = array();
    
    /**
     * 加载数据库分片配置
     * @return array array('{$dbname}'=>$arrInfo)
     */
    protected static function loadConfig() {
        $shards = Base_Config::getConfig('pg', CONF_PATH . '/db.ini');
        $arrRetInfo = array();
        foreach ($shards as $dbkey => $arrInfo) {
            foreach ($arrInfo as $info) {
                $arrRetInfo[$info['dbname']] = $info;
            }
        }
        return $arrRetInfo;
    }

    /**
     * 获取库表对应的db链接
     * @param  string $strName 库名或'库.表'名
     * @return         Db实例
     */
    public static function getInstance($strName) {
        $arrShardInfo     = self::loadConfig();
        $arrConf          = $arrShardInfo[$strName];
        $arrConf['hosts'] = explode(',', $arrConf['hosts']);
        $key              = array_rand($arrConf['hosts']);
        $host             = $arrConf['hosts'][$key];
        $port             = $arrConf['port'];
        $dbname           = $arrConf['dbname'];
        $username         = $arrConf['username'];
        $password         = $arrConf['password'];
        $conn = @pg_connect("host=$host port=$port dbname=$dbname user=$username password=$password");
        return $conn;        
    }

    private static $_pdoInstance;

    public static function getPDOInstance($dbname) {
        if(self::$_pdoInstance == null) {
            $arrShardInfo = self::loadConfig();
            $arrConf = $arrShardInfo[$dbname];
            $arrConf['hosts'] = explode(',', $arrConf['hosts']);
            $key = array_rand($arrConf['hosts']);
            $host = $arrConf['hosts'][$key];
            $port = $arrConf['port'];
            $dbname = $arrConf['dbname'];
            $username = $arrConf['username'];
            $password = $arrConf['password'];
            $charset = $arrConf['charset'];
            self::$_pdoInstance = new PDO("pgsql:dbname=$dbname host=$host", $username, $password);
        }
        return self::$_pdoInstance;
    }
}

