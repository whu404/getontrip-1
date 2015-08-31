<?php
/**
 * 黑名单信息表 列表类
 * @author huwei
 */
class Black_List_Black extends Base_List {
    /**
     * 数据表名
     * @var string
     */
    protected $table = 'black';

    /**
     * 主键
     * @var string
     */
    protected $prikey = 'id';

    /**
     * 对象包含的所有字段
     * @var array
     */
    protected $fields = array('id', 'type', 'obj_id', 'create_time', 'update_time', 'create_user', 'update_user');

    /**
     * 整数类型的字段
     * @var array
     */
    protected $intProps = array(
        'id'          => 1,
        'type'        => 1,
        'create_time' => 1,
        'update_time' => 1,
        'create_user' => 1,
        'update_user' => 1,
    );

    /**
     * 获取数据的对象数组
     * @return array|Black_Object_Black[]
     * 返回的是一个数组，每个元素是一个Loan_Object_Attach对象
     */
    public function getObjects() {
        return parent::getObjects('Black_Object_Black');
    }

}