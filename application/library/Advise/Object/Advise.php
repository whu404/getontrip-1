<?php
/**
 * 意见反馈
 * @author huwei
 */
class Advise_Object_Advise extends Base_Object {
    /**
     * 数据表名
     * @var string
     */
    protected $table = 'advise';

    /**
     * 主键
     * @var string
     */
    protected $prikey = 'id';

    /**
     * 类名
     * @var string
     */
    const CLASSNAME = 'Advise_Object_Advise';

    /**
     * 对象包含的所有字段
     * @var array
     */
    protected $fields = array('id', 'userid', 'content', 'status', 'create_time', 'update_time', 'create_user', 'update_user', 'type');

    /**
     * 字段与属性隐射关系
     * @var array
     */
    public $properties = array(
        'id'          => 'id',
        'userid'      => 'userid',
        'content'     => 'content',
        'status'      => 'status',
        'create_time' => 'createTime',
        'update_time' => 'updateTime',
        'create_user' => 'createUser',
        'update_user' => 'updateUser',
        'type'        => 'type',
    );

    /**
     * 整数类型的字段
     * @var array
     */
    protected $intProps = array(
        'id'          => 1,
        'status'      => 1,
        'create_time' => 1,
        'update_time' => 1,
        'create_user' => 1,
        'update_user' => 1,
        'type'        => 1,
    );

    /**
     * @param array $data
     * @return Advise_Object_Advise
     */
    public static function init($data) {
        return parent::initObject(self::CLASSNAME, $data);
    }

    /**
     *  ID
     * @var integer
     */
    public $id;

    /**
     * 发送人
     * @var string
     */
    public $userid;

    /**
     * 意见内容
     * @var string
     */
    public $content;

    /**
     * 状态:0未处理，1已处理
     * @var integer
     */
    public $status;

    /**
     * 发送时间
     * @var integer
     */
    public $createTime;

    /**
     * 更新时间
     * @var integer
     */
    public $updateTime;

    /**
     * 创建人
     * @var integer
     */
    public $createUser;

    /**
     * 更新人
     * @var integer
     */
    public $updateUser;

    /**
     * 类型，1:提问,2:回答
     * @var integer
     */
    public $type;

}
