<?php
class Search_Api{
    
    /**
     * 接口1:Search_Api::addLabel($objId, $type, $labelId)
     * 为城市或景点添加上搜索标签
     * @param integer $objId
     * @param integer $type
     * @param integer $labelId
     * @return boolean
     */
    public static function addLabel($objId, $type, $labelId){
        $logic = new Search_Logic_Label();
        return $logic->addLabel($objId, $type, $labelId);
    }
    
    /**
     * 接口2:Search_Api::delLabel($labelId, $objId)
     * 删除搜索标签
     * @param integer $objId
     * @param integer $labelId
     * @return boolean
     */
    public static function delLabel($labelId, $objId){
        $logic = new Search_Logic_Label();
        return $logic->delLabel($labelId, $objId);
    }
    
    /**
     * 接口3:Search_Api::listLabel($page, $pageSize, $arrInfo = array())
     * 查询搜索标签列表
     * @param integer $page
     * @param integer $pageSize
     * @param array $arrInfo
     * @return array
     */
    public static function listLabel($page, $pageSize, $arrInfo = array()){
        $logic = new Search_Logic_Label();
        return $logic->listLabel($page, $pageSize, $arrInfo);
    }
    
    /**
     * 接口4:Search_Api::getLabel($labelId, $page, $pageSize)
     * 获取某个搜索标签信息
     * @param integer $labelId
     * @param integer $page,标签数据的页码
     * @param integer $pageSize,标签对应对象数据的页面大小
     */
    public static function getLabel($labelId, $page, $pageSize){
        $logic = new Search_Logic_Label();
        return $logic->getLabel($labelId, $page, $pageSize);
    }
    
    /**
     * 接口5:Search_Api::addNewTag($name,$type = '', $arrObjIds = array())
     * 添加搜索标签
     * @param string $name
     * @param string $type
     * @param array $arrObjIds
     * @return boolean
     */
    public static function addNewTag($name,$type = '', $arrObjIds = array()){
        $logic = new Search_Logic_Label();
        return $logic->addNewTag($name, $type, $arrObjIds);
    }
}