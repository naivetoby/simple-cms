package vip.toby.cms.core.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import net.sf.cglib.reflect.FastClass;
import org.apache.commons.lang.StringUtils;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 数据库操作工具栏
 *
 * @author 彭嘉辉
 */
public class DataBaseUtil {

    /**
     * 数据库字段名转换成java驼峰式命名
     *
     * @param dbName 数据库字段名
     * @return 驼峰式命名
     */
    public static String dbNameToPropertyName(String dbName) {
        String propertyName = "";

        StringBuffer buffer = new StringBuffer(dbName);
        for (int j = 0; j < buffer.length(); j++) {
            if ("_".equals(Character.toString(buffer.charAt(j)))) {
                buffer.setCharAt(j + 1, Character.toUpperCase(buffer.charAt(j + 1)));
                buffer.delete(j, j + 1);
            }
        }
        propertyName = buffer.toString();

        return propertyName;
    }

    /**
     * 将list对象转换成用给定分隔符隔开的字符串
     *
     * @param list      要转换的list对象
     * @param splitChar 分隔符
     * @return 隔开的字符串
     */
    public static String listToString(List<String> list, String splitChar) {
        if (list == null) {
            return null;
        }
        StringBuffer buffer = new StringBuffer();

        for (int i = 0; i < list.size(); i++) {
            buffer.append(list.get(i));

            if (i < list.size() - 1) {
                buffer.append(splitChar);
            }
        }

        return buffer.toString();
    }

    /**
     * 获取实体成员变量的值
     *
     * @param entity    实体对象
     * @param fieldName 实体成员变量名
     * @return 实体成员变量的值
     * @throws IntrospectionException
     * @throws InvocationTargetException
     */
    @SuppressWarnings("unchecked")
    public static <T> T getValue(Object entity, String fieldName) {
        // 各字段值
        Object value = null;
        try {
            // 获取bean类型
            Class<?> entityType = entity.getClass();

            // 执行getter方法获取值
            FastClass fastClass = FastClass.create(entityType);
            PropertyDescriptor propertyDescriptor = new PropertyDescriptor(fieldName, entityType);
            Method getter = propertyDescriptor.getReadMethod();
            value = fastClass.invoke(getter.getName(), new Class[]{}, entity, new Object[]{});
        } catch (Exception e) {
            return null;
        }

        return (T) value;
    }

    /**
     * 获取UUID
     *
     * @return UUID
     */
    public static String getUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 解析ExtJS前台发送的排序请求
     *
     * @param sortStr 排序请求
     * @return 解析后的排序条件
     */
    public static String sortAnalytic(String sortStr) {
        if (StringUtils.isBlank(sortStr)) {// 判断是否存在排序条件
            sortStr = "";
        } else {
            sortStr = buildSortCondition(sortStr);
        }

        return sortStr;
    }

    /**
     * 解析查询条件
     *
     * @param queryCondition 查询条件
     * @return 解析后的查询条件
     */
    public static Map<String, String> filterAnalytic(String queryCondition) {
        Map<String, String> filterMap = new HashMap<>();
        if (StringUtils.isNotBlank(queryCondition)) {
            JSONArray filters = JSONArray.parseArray(queryCondition);
            filters.stream().forEach(obj -> {
                JSONObject condition = (JSONObject) JSON.toJSON(obj);
                filterMap.put(condition.getString("property"), condition.getString("value"));
            });
        }
        return filterMap;
    }

    /*
     * 凭借排序条件
     *
     * @param sortStr String 排序条件json字符串
     */
    private static String buildSortCondition(String sortStr) {
        // 排序条件
        StringBuffer sortCondition = new StringBuffer("ORDER BY ");

        // 解析排序请求
        JSONArray sorters = JSONArray.parseArray(sortStr);
        for (int i = 0; i < sorters.size(); i++) {
            JSONObject sortItem = (JSONObject) sorters.get(i);
            String property = fieldNameHandle(sortItem);
            String direction = sortItem.getString("direction");
            sortCondition.append(property + " " + direction);
            if (i < sorters.size() - 1) {
                sortCondition.append(",");
            }
        }
        if (sorters.size() == 0) {
            return "";
        }
        return sortCondition.toString();
    }

    /*
     * 处理前台驼峰式变量名
     *
     * @param JSONObject sortItem 排序请求json对象
     */
    private static String fieldNameHandle(JSONObject sortItem) {
        String property = sortItem.getString("property");
        // 将前台驼峰式变量名转换成数据库下划线分割变量名
        if ("index".equals(property)) {// 默认顺序号
            property = "index_number";
        } else {
            property = propertyNameToDBName(property);
        }
        return property;
    }

    /*
     * 将前台驼峰式变量名转换成数据库下划线分割变量名
     *
     * @param property String 前台驼峰式变量名
     */
    private static String propertyNameToDBName(String property) {
        StringBuffer buffer = new StringBuffer(property);
        for (int j = 0; j < buffer.length(); j++) {
            Character c = buffer.charAt(j);
            if (Character.isUpperCase(buffer.charAt(j))) {
                buffer.setCharAt(j, Character.toLowerCase(c));
                buffer.insert(j, "_");
            }
        }
        property = buffer.toString();
        return property;
    }

}
