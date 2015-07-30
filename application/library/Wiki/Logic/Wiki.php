<?php
class Wiki_Logic_Wiki extends Base_Logic{
    
    const WIKI_CATALOG_NUM = 4;
    
    public function __construct(){
        
    }
    
    /**
     * 获取景点百科信息，并拼接上百科目录,供线上使用
     * @param integer $sightId
     * @param integer $page
     * @param integer $pageSize
     * @return array
     */
    public function getWikis($sightId,$page,$pageSize,$status=Wiki_Type_Status::PUBLISHED){
        $redis  = Base_Redis::getInstance();
        $from   = ($page-1)*$pageSize+1;
        $to     = $page*$pageSize;
        $ret    = array();
        $arrRet = array();
        if($status == Wiki_Type_Status::ALL){
            for($i = $from; $i<=$to; $i++){
                $arrItem = array();
                $ret = $redis->hGetAll(Wiki_Keys::getWikiInfoName($sightId, $i));
                if(empty($ret)){
                    break;
                }
                $arrKeys = $redis->keys(Wiki_Keys::getWikiCatalogName($sightId, $i, "*"));
                foreach ($arrKeys as $key){
                    $arrItem[] = $redis->hGetAll($key);
                }
                $ret['items']  = $arrItem;
                $arrRet[]      = $ret;
            }
        }else{
            $arrWikiKeys = $redis->keys(Wiki_Keys::getWikiInfoName($sightId, "*"));
            foreach ($arrWikiKeys as $index => $wikiKey){
                $ret = $redis->hGetAll($wikiKey);
                $num = $index + 1;
                if(($ret['status'] == $status)&&($num >= $from)&&($num <= $to)){
                    $arrKeys = $redis->keys(Wiki_Keys::getWikiCatalogName($sightId, $num, "*"));
                    foreach ($arrKeys as $key){
                        $arrItem[] = $redis->hGetAll($key);
                    }
                    $ret['items']  = $arrItem;
                    $arrRet[]      = $ret;
                }
            }
        }        
        return $arrRet;       
    }
    
    
    /**
     * 获取词条的百科信息,并将数据写入数据库
     * @param string $word
     * @return array
     */
    public function getWikiSource($sightId,$page,$pageSize){
        $arrItems  = array();
        $arrRet    = array();
        $arrTemp   = array();
        $hash      = '';
        require_once(APP_PATH."/application/library/Base/HtmlDom.php");
        $arrsight     = Keyword_Api::queryKeywords($sightId,$page,$pageSize);
        foreach ($arrsight['list'] as $key  => $sight){
            $redis       = Base_Redis::getInstance();
            $index       = ($page-1)*$pageSize+$key+1;    
            $word        = urlencode(trim($sight['name']));
            
            $url         = "http://baike.baidu.com/search/word?word=".$word;
            $html        = file_get_html($url);
            $image       = $html->find('img[alt=""]',0);
            $image       = $image->getAttribute('data-src');
            $hash        = $this->uploadPic(self::TYPE_WIKI,$sight['name'],$image);
            $content     = $html->find('div.card-summary-content div.para',0);
            if(empty($content)){
                $content = $html->find('div[class="lemmaWgt-lemmaSummary lemmaWgt-lemmaSummary-light"]',0);
                foreach($html->find('li[class^="title level1 column-"]') as $e){
                    $ret  = $e->find("a",0);
                    $url  = $ret->getAttribute("href")."\t";
                    $name = $ret->innertext."\r\n";
                    $arrItems[] = array(
                        'name' => $name,
                        'url'  => $url,
                    );  
                    if(count($arrItems) >= self::WIKI_CATALOG_NUM){
                        break;
                    }              
                }
            }else{
                $content     = strip_tags($content->innertext);
                foreach($html->find('dd[class^="catalog-item "]') as $e){
                    $ret  = $e->find("p a",0);
                    $url  = $ret->getAttribute("href")."\t";
                    $name = $ret->innertext."\r\n";
                    $arrItems[] = array(
                        'name' => $name,
                        'url'  => $url,
                    );
                    
                    if(count($arrItems) >= self::WIKI_CATALOG_NUM){
                        break;
                    }
                }
            }
            
            
            $arrTemp['word']    = $sight['name'];
            $arrTemp['content'] = $content;
            $arrTemp['images']  = $hash;
            $arrTemp['items']   = $arrItems;
            
            foreach ($arrItems as $id => $item){
                $num  = $id + 1;
                $redis->delete(Wiki_Keys::getWikiCatalogName($sightId, $index, $num));
                $redis->hset(Wiki_Keys::getWikiCatalogName($sightId, $index, $num),'name',$item['name']);
                $redis->hset(Wiki_Keys::getWikiCatalogName($sightId, $index, $num),'url',$item['url']);
                $redis->hset(Wiki_Keys::getWikiCatalogName($sightId, $index, $num),'create_time',time());
                $redis->setTimeout(Wiki_Keys::getWikiCatalogName($sightId, $index,$num),self::REDIS_TIME_OUT);
            }

            $redis->delete(Wiki_Keys::getWikiInfoName($sightId, $index));
            $redis->hset(Wiki_Keys::getWikiInfoName($sightId, $index),'title',$arrTemp['word']);
            $redis->hset(Wiki_Keys::getWikiInfoName($sightId, $index),'content',$arrTemp['content']);
            $redis->hset(Wiki_Keys::getWikiInfoName($sightId, $index),'image',$arrTemp['images']);
            $redis->hset(Wiki_Keys::getWikiInfoName($sightId, $index),'status',Wiki_Type_Status::NOTPUBLISHED);
            $redis->hset(Wiki_Keys::getWikiInfoName($sightId, $index),'create_time',time());
            $redis->setTimeout(Wiki_Keys::getWikiInfoName($sightId, $index),self::REDIS_TIME_OUT);
            
            $arrRet[] = $arrTemp;
            
            $html->clear();
        }
        return $arrRet;
    }
    
    public function editWiki($sightId,$keywordId,$arrInfo){
        
    }
}