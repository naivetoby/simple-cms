package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.module.Module;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

/**
 * The Interface IModuleService.
 */
public interface IModuleService {

    /**
     * Gets the module list.
     *
     * @param start          the start
     * @param limit          the limit
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the module list
     * @throws Exception the exception
     */
    JSONObject getModuleList(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception;

    /**
     * Gets the module.
     *
     * @param moduleId the module id
     * @return the module
     * @throws Exception the exception
     */
    Module getModule(Long moduleId) throws Exception;

    /**
     * Gets the module id.
     *
     * @param module the module
     * @return the module id
     */
    Long getModuleId(String module);

    /**
     * 添加 module.
     *
     * @param module the module
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject addModule(Module module) throws Exception;

    /**
     * Update module.
     *
     * @param module the module
     * @return the module
     * @throws Exception the exception
     */
    Module updateModule(Module module) throws Exception;

    /**
     * Delete module.
     *
     * @param moduleId the module id
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject deleteModule(Long moduleId) throws Exception;

    /**
     * Gets the module4 tree list.
     *
     * @param modulePid     the module pid
     * @param roleId        the role id
     * @param sortCondition the sort condition
     * @return the module4 tree list
     * @throws Exception the exception
     */
    JSONArray getModule4TreeList(Long modulePid, Long roleId, String sortCondition) throws Exception;

    /**
     * Gets the module4 tree list.
     *
     * @param modulePid     the module pid
     * @param sortCondition the sort condition
     * @param authJson      the auth json
     * @return the module4 tree list
     * @throws Exception the exception
     */
    JSONArray getModule4TreeList(Long modulePid, String sortCondition, String authJson) throws Exception;

    /**
     * Gets the module4 tree list.
     *
     * @param modulePid     the module pid
     * @param sortCondition the sort condition
     * @return the module4 tree list
     * @throws Exception the exception
     */
    JSONArray getModule4TreeList(Long modulePid, String sortCondition) throws Exception;

    /**
     * Gets the module list4 excel.
     *
     * @param start          the start
     * @param limit          the limit
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the module list4 excel
     * @throws Exception the exception
     */
    List<Module> getModuleList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception;

    /**
     * 检查是否 system module.
     *
     * @param moduleId the module id
     * @return the boolean
     */
    Boolean isSystemModule(Long moduleId);

    /**
     * Update module index number.
     *
     * @param module the module
     * @return the module
     * @throws InvocationTargetException the invocation target exception
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws IntrospectionException    the introspection exception
     */
    Module updateModuleIndexNumber(Module module) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException;

    /**
     * Check module.
     *
     * @param module the module
     * @return the integer
     */
    Integer checkModule(String module);

    /**
     * Gets the module dir list.
     *
     * @param sort the sort
     * @return the module dir list
     * @throws Exception the exception
     */
    JSONObject getModuleDirList(String sort) throws Exception;

}
