<?php
/**
 * 话题信息表 列表类
 * @author huwei
 */
class Topic_List_Topic extends Base_List {
    /**
     * 数据表名
     * @var string
     */
    protected $table = 'topic';

    /**
     * 主键
     * @var string
     */
    protected $prikey = 'id';

    /**
     * 对象包含的所有字段
     * @var array
     */
    protected $fields = array('id', 'title', 'content', 'desc', 'image', 'user_id', 'status', 'x', 'y', 'create_time', 'update_time');

    /**
     * 整数类型的字段
     * @var array
     */
    protected $intProps = array(
        'id'          => 1,
        'status'      => 1,
        'create_time' => 1,
        'update_time' => 1,
    );

    /**
     * 获取数据的对象数组
     * @return array|Topic_Object_Topic[]
     * 返回的是一个数组，每个元素是一个Loan_Object_Attach对象
     */
    public function getObjects() {
        return parent::getObjects('Topic_Object_Topic');
    }

}