package vip.toby.cms.core.service;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

/**
 * 数据操作业务逻辑接口（增删改查）
 */
public interface IDataBaseService {

    /**
     * 新增特殊数据，不需要指定起草人id
     *
     * @param entity     实体类
     * @param entityType 实体类型
     * @return
     * @throws NoSuchFieldException
     * @throws SecurityException
     * @throws InvocationTargetException
     * @throws IntrospectionException
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws NoSuchMethodException
     */
    Object add(Object entity, Class<?> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException, NoSuchMethodException;

    /**
     * 删除数据
     *
     * @param id         id
     * @param entityType 实体类型
     * @return 被删除的实体的id
     * @throws Exception
     */
    <T> T delete(T id, Class<?> entityType) throws Exception;

    /**
     * 更新数据
     *
     * @param entity     实体类
     * @param entityType 实体类型
     * @return 修改后的数据
     * @throws SecurityException
     * @throws NoSuchFieldException
     * @throws IntrospectionException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     * @throws InstantiationException
     */
    <T> T save(T entity, Class<?> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException;

    /**
     * 查询所有数据
     *
     * @param query      查询条件
     * @param sort       排序条件
     * @param entityType 实体类型
     * @return 实体对象集合
     * @throws IntrospectionException
     * @throws SecurityException
     * @throws NoSuchFieldException
     * @throws InvocationTargetException
     */
    <T> List<T> list(String query, String sort, Class<T> entityType) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException;

    /**
     * 分页查询数据
     *
     * @param start      分页开始位置
     * @param offset     分页偏移量
     * @param query      查询条件
     * @param sort       排序条件
     * @param entityType 实体类型
     * @return 实体对象集合
     * @throws SecurityException
     * @throws NoSuchFieldException
     * @throws IntrospectionException
     * @throws InvocationTargetException
     */
    <T> List<T> list(Integer start, Integer offset, String query, String sort, Class<T> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException;

    /**
     * 获取单个实体
     *
     * @param id         id
     * @param entityType 实体类型
     * @return 实体对象
     * @throws IntrospectionException
     * @throws SecurityException
     * @throws NoSuchFieldException
     * @throws InvocationTargetException
     */
    <T> T getEntity(Object id, Class<T> entityType) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException;

    /**
     * 获取总记录数
     *
     * @param entityType 实体类型
     * @param query      查询条件
     * @return 总记录数
     */
    Integer getTotal(Class<?> entityType, String query);

    /**
     * 自定义查询
     *
     * @param querySql sql语句
     * @return 结果集
     */
    List<Map> query(String querySql);

    /**
     * 自定义更新或删除
     *
     * @param updateSql sql语句
     */
    void update(String updateSql);

    /**
     * 调用存储过程
     *
     * @param procName  存储过程名称
     * @param inParams  输入参数，格式：Map<参数位置（从1开始）,参数值>
     * @param outParams 输出参数，格式：Map<参数位置（从1开始）,参数值>
     * @return 返回结果，格式：Map<参数位置（从1开始）,返回值>
     */
    Map<Integer, ?> execute(String procName, Map<Integer, Object> inParams, Map<Integer, Integer> outParams);

}
