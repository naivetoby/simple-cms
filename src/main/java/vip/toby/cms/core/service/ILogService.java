package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.log.Log;

import javax.servlet.http.HttpServletRequest;
import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * 日志业务接口.
 */
public interface ILogService {

    /**
     * 添加日志
     *
     * @param clientIp
     * @param loginName
     * @param userName
     * @param moduleName
     * @param action
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws NoSuchFieldException
     * @throws SecurityException
     * @throws IntrospectionException
     */
    Object addLog(String clientIp, String loginName, String userName, String moduleName, String action) throws InstantiationException, IllegalAccessException, NoSuchMethodException, InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException;

    /**
     * 添加日志.
     *
     * @param moduleName the module name 模块名
     * @param action     the action 操作
     * @return the JSON object
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws InstantiationException    the instantiation exception
     * @throws IllegalAccessException    the illegal access exception
     * @throws NoSuchMethodException     the no such method exception
     * @throws IntrospectionException    the introspection exception
     */
    Object addLog(HttpServletRequest request, String moduleName, String action) throws NoSuchFieldException, SecurityException, InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException, IntrospectionException;

    /**
     * †
     * 获取日志列表.
     *
     * @param limit          the limit 每页显示数目
     * @param start          the start 分页开始值
     * @param sort           the sort 排序条件
     * @param queryCondition the query condition 查询条件
     * @return the log list
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     */
    JSONObject getLogList(Integer limit, Integer start, String sort, String queryCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException;

    /**
     * 获取日志报表信息.
     *
     * @param start          the start 分页开始值
     * @param limit          the limit 每页显示数目
     * @param queryCondition the query condition 查询条件
     * @param sortCondition  the sort condition 排序条件
     * @return the log list4 excel
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     */
    List<Log> getLogList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException;

}
