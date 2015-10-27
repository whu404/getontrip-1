<?php
/**
 * 全文检索接口
 */
class Base_Search {
    
    const PAGE_SIZE = 8;
    
    const HIGHT_LIGHT  = false;
    
    //所有检索字段
    protected static $arrPrams = array(
        'name',
        'content',
        'title',
    );
    
    //支持的检索表
    protected static $arrTypes = array(
        'topic',
        'sight',
        'book',
        'video',  
        'wiki',
        'city',
        'content',
    );
    
    /**
     * 对theme、topic两表提供全文检索,eg:Base_Search::Search('topic','测试',1,10,array('id'))
     * @param string  $type，类型，eg:'topic','theme'
     * @param string  $word,检索关键词
     * @param integer $page
     * @param integer $pageSize
     * @param array $arrNeedKey,需要返回的key
     */
    public static function Search($type,$word,$page = 1,$pageSize = self::PAGE_SIZE, $arrNeedKey = array()){
        $query         = '';
        $searchSizeMax = 10000;
        if($pageSize >= $searchSizeMax){
            $pageSize = $searchSizeMax;
        }
        $arrRet = array();
        if(!in_array(trim($type),self::$arrTypes)){
            return $arrRet;
        }
        foreach (self::$arrPrams as $val){
            $query .= $val.":\"".$word."\" or ";
        }
        $query = substr($query,0,-3);
        $query = urlencode($query);
        
        $arrParams = array(
            'id',
            'name',
            'title',
            'content',
        );
        if(empty($arrNeedKey)){
            $param = implode(",",self::$arrPrams);
        }else{
            $param = implode(",",$arrNeedKey);
        }
        $param  = urlencode($param);
        $from   = ($page-1)*$pageSize;
        $url    = Base_Config::getConfig('solr')->url.'/solr/'.$type.'/select?q='.$query.'&wt=json&fl='.$param."&start=".$from."&rows=".$pageSize;
        if($type == 'content'){
            $url   .= '&hl=true&hl.fl=title'.urlencode(',')."content";
        }else{
            $url   .= '&hl=true&hl.fl=name';
        }        
        if(self::HIGHT_LIGHT){
            $url .='&hl.simple.pre='.urlencode('<b>').'&hl.simple.post='.urlencode('</b>');
        }else{
            $url .='&hl.simple.pre='.urlencode('').'&hl.simple.post='.urlencode('');
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $ret = curl_exec($ch);
        curl_close($ch);
        
        $arrRet = json_decode($ret,true);
        
        foreach ($arrRet['response']['docs'] as $key => $val){
            if($type == 'content'){
                $val['title'][0]   = isset($val['title'][0])?$val['title'][0]:'';
                $val['content'][0] = isset($val['content'][0])?$val['content'][0]:'';
                $arrRet['response']['docs'][$key]['search_type']  = $val['search_type'][0];
                $arrRet['response']['docs'][$key]['title']    = isset($arrRet['highlighting'][$val['unique_id']]['title'][0])?$arrRet['highlighting'][$val['unique_id']]['title'][0]:$val['title'][0]; 
                $arrRet['response']['docs'][$key]['content']  = isset($arrRet['highlighting'][$val['unique_id']]['content'][0])?$arrRet['highlighting'][$val['unique_id']]['content'][0]:$val['content'][0];
                unset($arrRet['response']['docs'][$key]['unique_id']);
            }else{
                $arrRet['response']['docs'][$key]['name']  = isset($arrRet['highlighting'][$val['id']]['name'][0])?$arrRet['highlighting'][$val['id']]['name'][0]:'';
            }          
        }
        return array('num' => strval($arrRet['response']['numFound']),'data' => $arrRet['response']['docs']);
    }
}
