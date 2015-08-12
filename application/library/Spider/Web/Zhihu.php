<?php
/**
 * 知乎网数据采集器
 * @author huwei
 *
 */
class Spider_Web_Zhihu extends Spider_Web_Base{
    
    public function __construct($url,$type){
        parent::__construct($url,$type);
    }
    
    /**
     * 获取正文
     * @see Spider_Base::getBody()
     */
    public function getBody(){
        $strData = '';
        $element = $this->objDom->find('div[itemprop="topAnswer"] div.zm-item-rich-text',0);
        $strData = $this->preProcess($this->url,$element->innertext); 
        //过滤掉多余的白色图片
        $strData= preg_replace('/<img src=\"http:\/\/s1.zhimg.com\/misc\/whitedot.jpg\">/i', '', $strData);
        return $strData;        
    }    
}