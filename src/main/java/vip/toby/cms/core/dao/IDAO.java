package vip.toby.cms.core.dao;

import net.paoding.rose.jade.annotation.*;
import vip.toby.cms.core.dao.rowmapper.CommonRowMapper;
import vip.toby.cms.core.dao.rowmapper.CustomQueryRowMapper;

import java.util.List;
import java.util.Map;

/**
 * 数据操作接口（增删改查）
 */
public interface IDAO {

    /**
     * 新增数据
     *
     * @param tableName 表名
     * @param columns   字段名
     * @param values    值
     *                  主键名
     * @return 新增记录的id
     */
    @ReturnGeneratedKeys
    @SQL("INSERT INTO {:tableName}({:columns}) values({:values})")
    Long add(@SQLParam("tableName") String tableName, @SQLParam("columns") String columns, @SQLParam("values") String values);

    /**
     * 删除数据
     *
     * @param tableName  表名
     * @param idProperty id字段名
     * @param id         id值
     */
    @SQL("DELETE FROM {:tableName} WHERE {:idProperty} = :id")
    void delete(@SQLParam("tableName") String tableName, @SQLParam("idProperty") String idProperty, @SQLParam("id") Object id);

    /**
     * 更新数据
     *
     * @param tableName  表名
     * @param setValues  值
     * @param idProperty id字段名
     * @param id         id的值
     */
    @SQL("UPDATE {:tableName} SET {:setValues} WHERE {:idProperty} = :id")
    void save(@SQLParam("tableName") String tableName, @SQLParam("setValues") String setValues, @SQLParam("idProperty") String idProperty, @SQLParam("id") Object id);

    /**
     * 分页获取数据列表
     *
     * @param tableName 表名
     * @param columns   字段
     * @param condition 查询条件与排序条件
     * @param start     开始偏移量
     * @param offset    结束偏移量
     * @return 结果集
     */
    @SQL("SELECT {:columns} FROM {:tableName} #if(:condition!=null){{:condition}} LIMIT :start, :offset")
    @RowHandler(rowMapper = CommonRowMapper.class)
    List<Map<String, Object>> list(@SQLParam("tableName") String tableName, @SQLParam("columns") String columns, @SQLParam("condition") String condition, @SQLParam("start") int start, @SQLParam("offset") int offset);

    /**
     * 查询所有数据
     *
     * @param tableName 表名
     * @param columns   字段
     * @param condition 查询条件与排序条件
     * @return 结果集
     */
    @SQL("SELECT {:columns} FROM {:tableName} #if(:condition!=null){{:condition}}")
    @RowHandler(rowMapper = CommonRowMapper.class)
    List<Map<String, Object>> list(@SQLParam("tableName") String tableName, @SQLParam("columns") String columns, @SQLParam("condition") String condition);

    /**
     * 获取一个bean
     *
     * @param tableName  表名
     * @param columns    字段
     * @param idProperty id字段名
     * @param id         id值
     * @return 指定的数据
     */
    @SQL("SELECT {:columns} FROM {:tableName} WHERE {:idProperty} = :id")
    @RowHandler(rowMapper = CommonRowMapper.class)
    List<Map<String, Object>> getEntity(@SQLParam("tableName") String tableName, @SQLParam("columns") String columns, @SQLParam("idProperty") String idProperty, @SQLParam("id") Object id);

    /**
     * 获取总记录数
     *
     * @param condition 查询条件及排序条件
     * @param tableName 数据表名
     * @return 总记录数
     */
    @SQL("SELECT COUNT(1) as total FROM {:tableName} #if(:condition!=null){{:condition}}")
    Integer getTotal(@SQLParam("condition") String condition, @SQLParam("tableName") String tableName);

    /**
     * 自定义查询
     *
     * @param querySql sql语句
     * @return 结果集
     */
    @SQL(type = SQLType.READ, value = "{:querySql}")
    @RowHandler(rowMapper = CustomQueryRowMapper.class)
    List<Map<String, Object>> query(@SQLParam("querySql") String querySql);

    /**
     * 自定义更新
     *
     * @param updateSql sql语句
     */
    @SQL(type = SQLType.WRITE, value = "{:updateSql}")
    void update(@SQLParam("updateSql") String updateSql);

}