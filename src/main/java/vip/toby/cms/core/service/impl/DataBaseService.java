package vip.toby.cms.core.service.impl;

import net.sf.cglib.reflect.FastClass;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.dao.View;
import vip.toby.cms.core.dao.IDAO;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.util.DataBaseUtil;

import javax.sql.DataSource;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mysql数据库服务
 */
public abstract class DataBaseService implements IDataBaseService {

    private final static Logger logger = LoggerFactory.getLogger(DataBaseService.class);

    public IDAO getDAO() {
        return null;
    }

    public DataSource getDataSource() {
        return null;
    }

    @Override
    public Long add(Object entity, Class<?> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        Object bean;
        if (entity.getClass().getName().equals(entityType.getName())) {
            bean = entity;
        } else {
            bean = entityType.newInstance();
            BeanUtils.copyProperties(bean, entity);
        }
        // 数据表表名
        String tableName = getTableName(entityType);
        // 处理列名与值
        Map<String, List<String>> map = insertHandle(bean);

        // 添加数据
        logger.debug("INSERT INTO " + tableName + "(" + DataBaseUtil.listToString(map.get("columnList"), ", ") + ") values(" + DataBaseUtil.listToString(map.get("valueList"), ", ") + ")");
        return this.getDAO().add(tableName, DataBaseUtil.listToString(map.get("columnList"), ", "), DataBaseUtil.listToString(map.get("valueList"), ", "));
    }

    @Override
    public <T> T delete(T id, Class<?> entityType) throws Exception {
        // 数据表表名
        String tableName = this.getTableName(entityType);
        // 唯一标识
        Field idProperty = this.getIdProperty(entityType);
        logger.debug("DELETE FROM " + tableName + " WHERE " + idProperty.getAnnotation(Column.class).name().toLowerCase() + " = " + id);
        this.getDAO().delete(tableName, idProperty.getAnnotation(Column.class).name().toLowerCase(), id);
        return id;
    }

    @SuppressWarnings("unchecked")
    @Override
    public <T> T save(T entity, Class<?> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException {
        Object bean;
        if (entity.getClass().getName().equals(entityType.getName())) {
            bean = entity;
        } else {
            bean = entityType.newInstance();
            BeanUtils.copyProperties(bean, entity);
        }
        // 数据表表名
        String tableName = this.getTableName(entityType);
        // 更新数据字符串集合(column=value)
        List<String> setValueList = this.updateHandle(bean);
        // 实体唯一标识成员变量
        Field idProperty = this.getIdProperty(entityType);
        Object id = DataBaseUtil.getValue(bean, idProperty.getName());
        logger.debug("UPDATE " + tableName + " SET " + DataBaseUtil.listToString(setValueList, ", ") + " WHERE " + idProperty.getAnnotation(Column.class).name().toLowerCase() + " = " + id);
        this.getDAO().save(tableName, DataBaseUtil.listToString(setValueList, ", "), idProperty.getAnnotation(Column.class).name().toLowerCase(), id);
        return (T) bean;
    }

    @Override
    public <T> List<T> list(String query, String sort, Class<T> entityType) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException {
        // 数据表表名
        String tableName;
        // 结果集
        List<Map<String, Object>> list;
        // 实体对象集合
        List<T> entityList = new ArrayList<>();
        // 处理排序条件
        String sortCondition = DataBaseUtil.sortAnalytic(sort);
        // 查询条件及排序条件
        String condition = "";
        if (StringUtils.isBlank(query)) {
            condition = sortCondition;
        } else {
            condition = "WHERE " + query + " " + sortCondition;
        }

        if (entityType.isAnnotationPresent(View.class)) {// 判断是否有视图
            tableName = this.getViewName(entityType);
        } else {
            tableName = this.getTableName(entityType);
        }

        if (StringUtils.isBlank(condition)) {
            condition = null;
        }
        String debugCondition = "";
        if (condition != null) {
            debugCondition = condition;
        }
        logger.debug("SELECT " + DataBaseUtil.listToString(this.getColumnList(entityType), ", ") + " FROM " + tableName + " " + debugCondition);
        list = this.getDAO().list(tableName, DataBaseUtil.listToString(this.getColumnList(entityType), ", "), condition);

        // 将map结果集反射成bean集合
        for (Map<String, Object> map : list) {
            T entity = this.mapToEntity(map, entityType);
            entityList.add(entity);
        }

        return entityList;
    }

    @Override
    public <T> List<T> list(Integer start, Integer offset, String query, String sort, Class<T> entityType) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
        // 数据表表名
        String tableName;
        // 结果集
        List<Map<String, Object>> list;
        // 实体对象集合
        List<T> entityList = new ArrayList<>();
        // 处理排序条件
        String sortCondition = DataBaseUtil.sortAnalytic(sort);
        // 查询条件及排序条件
        String condition = "";
        if (StringUtils.isBlank(query)) {
            condition = sortCondition;
        } else {
            condition = "WHERE " + query + " " + sortCondition;
        }
        // 判断是否有视图
        if (entityType.isAnnotationPresent(View.class)) {
            tableName = this.getViewName(entityType);
        } else {
            tableName = this.getTableName(entityType);
        }

        if (StringUtils.isBlank(condition)) {
            condition = null;
        }
        if (start == null) {
            start = 0;
        }
        if (offset == null) {
            offset = 20;
        }
        String conditionAndLimit = "LIMIT " + start + ", " + offset;
        if (condition != null) {
            conditionAndLimit = condition + " LIMIT " + start + ", " + offset;
        }
        logger.debug("SELECT " + DataBaseUtil.listToString(this.getColumnList(entityType), ", ") + " FROM " + tableName + " " + conditionAndLimit);
        list = this.getDAO().list(tableName, DataBaseUtil.listToString(this.getColumnList(entityType), ", "), condition, start, offset);

        // 将map结果集反射成bean集合
        for (Map<String, Object> map : list) {
            T entity = this.mapToEntity(map, entityType);
            entityList.add(entity);
        }

        return entityList;
    }

    @Override
    public <T> T getEntity(Object id, Class<T> entityType) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException {
        // 数据表表名
        String tableName;
        // 唯一标准成员变量名
        Field idProperty = this.getIdProperty(entityType);
        // 数据库对应字段名集合
        List<String> columnList = getColumnList(entityType);

        if (entityType.isAnnotationPresent(View.class)) {// 判断是否有视图
            tableName = this.getViewName(entityType);
        } else {
            tableName = this.getTableName(entityType);
        }

        logger.debug("SELECT " + DataBaseUtil.listToString(columnList, ", ") + " FROM " + tableName + " WHERE " + idProperty.getAnnotation(Column.class).name().toLowerCase() + " = " + id);

        List<Map<String, Object>> list = this.getDAO().getEntity(tableName, DataBaseUtil.listToString(columnList, ", "), idProperty.getAnnotation(Column.class).name().toLowerCase(), id);
        if (list.size() > 0) {
            Map<String, Object> map = this.getDAO().getEntity(tableName, DataBaseUtil.listToString(columnList, ", "), idProperty.getAnnotation(Column.class).name().toLowerCase(), id).get(0);
            return this.mapToEntity(map, entityType);
        } else {
            return null;
        }
    }

    @Override
    public Integer getTotal(Class<?> entityType, String query) {
        // 数据表表名
        String tableName;

        if (entityType.isAnnotationPresent(View.class)) {// 判断是否有视图
            tableName = this.getViewName(entityType);
        } else {
            tableName = this.getTableName(entityType);
        }

        // 处理查询条件
        if (StringUtils.isBlank(query)) {
            query = null;
        } else {
            query = "WHERE " + query;
        }
        logger.debug("SELECT COUNT(*) as total FROM " + tableName + " " + (query != null ? query : ""));
        return this.getDAO().getTotal(query, tableName);
    }

    @Override
    public List<Map<String, Object>> query(String querySql) {
        logger.debug(querySql);
        return this.getDAO().query(querySql);
    }

    @Override
    public void update(String updateSql) {
        logger.debug(updateSql);
        this.getDAO().update(updateSql);
    }

    @Override
    public Map<Integer, Object> execute(String procName, Map<Integer, Object> inParams, Map<Integer, Integer> outParams) {
        if (StringUtils.isBlank(procName)) {
            return null;
        }
        Map<Integer, Object> resultMap = null;
        StringBuffer sql = new StringBuffer("{ call " + procName + "(");
        int paramCount = 0;
        if (inParams != null) {
            paramCount += inParams.size();
        }
        if (outParams != null) {
            paramCount += outParams.size();
        }
        if (paramCount > 0) {
            List<String> paramCountList = new ArrayList<>();
            for (int i = 0; i < paramCount; i++) {
                paramCountList.add("?");
            }
            sql.append(DataBaseUtil.listToString(paramCountList, ", "));
        }
        sql.append(") }");
        logger.debug(sql.toString());
        Connection conn = null;
        CallableStatement proc = null;
        try {
            conn = this.getDataSource().getConnection();
            // 关闭自动提交
            conn.setAutoCommit(false);
            proc = conn.prepareCall(sql.toString());
            if (inParams != null) {
                for (Integer key : inParams.keySet()) {
                    proc.setString(key, inParams.get(key).toString());
                }
            }
            if (outParams != null) {
                for (Integer key : outParams.keySet()) {
                    proc.registerOutParameter(key, Integer.parseInt(outParams.get(key).toString()));
                }
            }
            proc.execute();
            if (outParams != null) {
                resultMap = new HashMap<>();
                for (Integer key : outParams.keySet()) {
                    resultMap.put(key, proc.getObject(key));
                }
            }
            conn.commit();
        } catch (SQLException e) {
            e.printStackTrace();
            try {
                conn.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        } finally {
            if (proc != null) {
                try {
                    proc.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return resultMap;
    }

    /*
     * 获取表名
     *
     * @param entityType 实体类型
     *
     * @return 数据表的表名
     */
    private String getTableName(Class<?> entityType) {
        // 表名
        String tableName = "";

        // 获取类的Table注解
        Table table = entityType.getAnnotation(Table.class);
        if (null != table) {
            // 获取表名
            tableName = table.name();
        }

        return tableName;
    }

    /*
     * 处理新增数据时的列名和数据，使其转换成insert语句的列和值部分
     *
     * @param entity 实体对象
     *
     * @return 处理后的列名和数据
     *
     * @throws NoSuchFieldException
     *
     * @throws IntrospectionException
     *
     * @throws InvocationTargetException
     */
    private Map<String, List<String>> insertHandle(Object entity) throws NoSuchFieldException, IntrospectionException, InvocationTargetException {
        Map<String, List<String>> map = new HashMap<>();
        Class<?> entityType = entity.getClass();
        // 列名集合
        List<String> columnList = new ArrayList<>();
        // 值集合
        List<String> valueList = new ArrayList<>();
        // 实体所有成员变量
        Field[] fields = entityType.getDeclaredFields();

        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class) && field.getAnnotation(Column.class).insertable()) {// 判断是否可插入数据字段
                // 获取数据库字段
                columnList.add(this.getColumnName(entityType, field.getName(), true));
                // 获取值
                Object value = DataBaseUtil.getValue(entity, field.getName());
                valueList.add(insertValueHandler(field, value));
            }
        }

        // 获取从父类继承的Column注解
        fields = entityType.getSuperclass().getDeclaredFields();
        // 获取数据库对应字段名
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class) && field.getAnnotation(Column.class).insertable()) {// 判断是否数据库映射成员变量
                columnList.add(this.getColumnName(entityType, field.getName(), true));
                // 获取值
                Object value = DataBaseUtil.getValue(entity, field.getName());
                valueList.add(insertValueHandler(field, value));
            }
        }

        map.put("columnList", columnList);
        map.put("valueList", valueList);

        return map;
    }

    /*
     * 处理实体成员变量的值，转换成insert语句能识别的数据
     *
     * @param field 成员变量
     *
     * @param value 成员变量的值
     *
     * @return 与数据库类型匹配的值
     */
    private String insertValueHandler(Field field, Object value) {
        // 与数据库类型匹配的值，以","隔开的字符串
        String valueStr;
        if (field.isAnnotationPresent(Id.class)) {// 判断是否唯一标识
            if (null != value && StringUtils.isNotBlank(value.toString())) {
                valueStr = "'" + value + "'";
            } else {
                valueStr = "'" + DataBaseUtil.getUUID() + "'";
            }
        } else if (null != value) {
            if (String.class == field.getType() || Boolean.class == field.getType()) {// 判断是否字符串
                valueStr = "'" + value.toString() + "'";
            } else {
                valueStr = value.toString();
            }
        } else {
            valueStr = "''";
        }
        return valueStr;
    }

    /*
     * 获取实体唯一标识变量名
     *
     * @param entityType 实体类型
     *
     * @return Field 实体唯一标识变量对象
     */
    private Field getIdProperty(Class<?> entityType) {
        // 唯一标识变量对象
        Field idProperty = null;
        Field[] fields = entityType.getDeclaredFields();
        Field[] supFields = entityType.getSuperclass().getDeclaredFields();
        List<Field> fieldList = new ArrayList<>();
        for (Field field : fields) {
            fieldList.add(field);
        }
        for (Field field : supFields) {
            fieldList.add(field);
        }
        for (Field field : fieldList) {
            if (field.isAnnotationPresent(Id.class)) {// 判断是否是主键
                idProperty = field;
                break;
            }
        }

        return idProperty;
    }

    /*
     * 处理新增更新时的列名和数据，使其转换成update语句的列和值部分
     *
     * @param entity 实体对象
     *
     * @return 处理后的列名和数据
     *
     * @throws IntrospectionException
     *
     * @throws InvocationTargetException
     *
     * @throws NoSuchFieldException
     */
    private List<String> updateHandle(Object entity) throws IntrospectionException, InvocationTargetException, NoSuchFieldException {
        Class<?> entityType = entity.getClass();
        // 更新数据字符串集合(column=value)
        List<String> setValueList = new ArrayList<>();
        // 实体所有成员变量
        Field[] fields = entityType.getDeclaredFields();

        // 拼接column=value字符串集合
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class) && field.getAnnotation(Column.class).updatable()) {// 判断是否可更新数据字段
                Object value = DataBaseUtil.getValue(entity, field.getName());
                String setValueStr = this.getColumnName(entityType, field.getName(), true) + " = " + this.insertValueHandler(field, value);
                setValueList.add(setValueStr);
            }
        }

        // 获取从父类继承的Column注解
        fields = entityType.getSuperclass().getDeclaredFields();
        // 获取数据库对应字段名
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class) && field.getAnnotation(Column.class).updatable()) {// 判断是否数据库映射成员变量
                Object value = DataBaseUtil.getValue(entity, field.getName());
                String setValueStr = this.getColumnName(entityType, field.getName(), true) + " = " + this.insertValueHandler(field, value);
                setValueList.add(setValueStr);
            }
        }

        return setValueList;
    }

    /*
     * 获取数据库映射字段集合
     *
     * @param entityType 实体类型
     *
     * @return 数据库映射字段集合
     *
     * @throws SecurityException
     *
     * @throws NoSuchFieldException
     */
    private List<String> getColumnList(Class<?> entityType) throws NoSuchFieldException, SecurityException {
        // 数据库映射字段名集合
        List<String> columnList = new ArrayList<>();
        // 所有成员变量
        Field[] fields = entityType.getDeclaredFields();

        // 获取数据库对应字段名
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class)) {// 判断是否数据库映射成员变量
                columnList.add(this.getColumnName(entityType, field.getName(), true));
            }
        }

        // 获取从父类继承的Column注解
        fields = entityType.getSuperclass().getDeclaredFields();
        // 获取数据库对应字段名
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class)) {// 判断是否数据库映射成员变量
                columnList.add(this.getColumnName(entityType, field.getName(), true));
            }
        }

        return columnList;
    }

    /*
     * 将map反射成entity
     *
     * @param map beanMap
     *
     * @param entityType 实体类型
     *
     * @return 实体对象
     *
     * @throws InvocationTargetException
     *
     * @throws IntrospectionException
     *
     * @throws NoSuchFieldException
     *
     * @throws SecurityException
     */
    @SuppressWarnings("unchecked")
    protected <T> T mapToEntity(Map<String, ?> map, Class<T> entityType) throws InvocationTargetException, IntrospectionException, NoSuchFieldException, SecurityException {
        FastClass fastClass = FastClass.create(entityType);
        // 实体对象
        Object entity = fastClass.newInstance();
        // 获取所有成员变量
        Field[] fields = entityType.getDeclaredFields();

        for (Field field : fields) {
            if (!field.isAnnotationPresent(Column.class)) {
                continue;
            }
            String fieldName = field.getName();
            String columnName = this.getColumnName(entityType, fieldName, false);

            // 获取setter方法
            PropertyDescriptor propertyDescriptor = new PropertyDescriptor(fieldName, entityType);
            Method setter = propertyDescriptor.getWriteMethod();

            // 数据类型
            Class<?> type = field.getType();

            // 值
            Object value = map.get(columnName);
            // 调用setter方法给成员变量赋值
            if (null != value) {
                if (String.class == type) {
                    // String类型直接赋值
                    fastClass.invoke(setter.getName(), new Class<?>[]{type}, entity, new Object[]{value.toString()});
                } else {
                    // 其他类型需要转换
                    FastClass typeClass = FastClass.create(type);
                    fastClass.invoke(setter.getName(), new Class<?>[]{type}, entity, new Object[]{typeClass.newInstance(new Class[]{String.class}, new Object[]{value.toString()})});
                }
            }
        }

        // 获取父类有Column注解字段的值
        fields = entityType.getSuperclass().getDeclaredFields();
        for (Field field : fields) {
            if (!field.isAnnotationPresent(Column.class)) {
                continue;
            }
            String fieldName = field.getName();
            String columnName = this.getColumnName(entityType, fieldName, false);

            // 获取setter方法
            PropertyDescriptor propertyDescriptor = new PropertyDescriptor(fieldName, entityType);
            Method setter = propertyDescriptor.getWriteMethod();

            // 数据类型
            Class<?> type = field.getType();

            // 值
            Object value = map.get(columnName);
            // 调用setter方法给成员变量赋值
            if (null != value) {
                if (String.class == type) {
                    // String类型直接赋值
                    fastClass.invoke(setter.getName(), new Class<?>[]{type}, entity, new Object[]{value.toString()});
                } else {
                    // 其他类型需要转换
                    FastClass typeClass = FastClass.create(type);
                    fastClass.invoke(setter.getName(), new Class<?>[]{type}, entity, new Object[]{typeClass.newInstance(new Class[]{String.class}, new Object[]{value.toString()})});
                }
            }
        }
        return (T) entity;
    }

    /*
     * 获取数据库视图名称
     *
     * @param entityType 实体类型
     *
     * @return 数据库视图名称
     */
    private String getViewName(Class<?> entityType) {
        // 数据库视图名称
        String viewName = "";

        // 获取类的View注解
        View view = entityType.getAnnotation(View.class);
        if (null != view) {
            viewName = view.name();
        }

        return viewName;
    }

    /*
     * 获取与数据库映射的字段名
     *
     * @param fieldName 实体成员变量名称
     *
     * @param entityType 实体类型
     *
     * @return 与数据库映射的字段名
     *
     * @throws SecurityException
     *
     * @throws NoSuchFieldException
     */
    private String getColumnName(Class<?> entityType, String fieldName, boolean escape) throws SecurityException {
        // 与数据库映射的字段名
        String columnName = "";
        Field field;
        try {
            field = entityType.getDeclaredField(fieldName);
            Column column = field.getAnnotation(Column.class);
            columnName = column.name().toLowerCase();
        } catch (NoSuchFieldException e) {
            try {
                field = entityType.getSuperclass().getDeclaredField(fieldName);
                Column column = field.getAnnotation(Column.class);
                columnName = column.name().toLowerCase();
            } catch (NoSuchFieldException e1) {
                e1.printStackTrace();
            }
        }
        return escape ? "`" + columnName + "`" : columnName;
    }
}
