package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.role.Role;

import java.util.List;

/**
 * 角色业务接口.
 */
public interface IRoleService {

    /**
     * 获取某个角色.
     *
     * @param roleId the role id 角色Id
     * @return the role
     * @throws Exception the exception
     */
    Role getRole(Long roleId) throws Exception;

    /**
     * 修改角色.
     *
     * @param role the role 修改后的角色对象
     * @return the role
     * @throws Exception the exception
     */
    Role updateRole(Role role) throws Exception;

    /**
     * 删除角色.
     *
     * @param roleId the role id 角色Id
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject deleteRole(Long roleId) throws Exception;

    /**
     * 添加角色.
     *
     * @param role the role 添加的角色信息
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject addRole(Role role) throws Exception;

    /**
     * 获取角色列表.
     *
     * @param start          the start 分页开始值
     * @param limit          the limit 每页显示数目
     * @param queryCondition the query condition 查询条件
     * @param sortCondition  the sort condition 排序条件
     * @return the role list
     * @throws Exception the exception
     */
    JSONObject getRoleList(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception;//

    /**
     * 获取某角色的所有用户Id.
     *
     * @param roleId the role id 角色Id
     * @return the user ids by role id
     */
    List<Long> getUserIdsByRoleId(Long roleId);

    /**
     * 获取某角色的权限信息.
     *
     * @param roleId the role id 角色Id
     * @return the role auth
     */
    String getRoleAuth(Long roleId);

    /**
     * 获取角色报表信息.
     *
     * @param start          the start 分页开始值
     * @param limit          the limit 每页显示数目
     * @param queryCondition the query condition 查询条件
     * @param sortCondition  the sort condition 排序条件
     * @return the role list4 excel
     * @throws Exception the exception
     */
    List<Role> getRoleList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception;

    /**
     * 获取某角色的类型.
     *
     * @param roleId the role id 角色Id
     * @return the role type
     * @throws Exception the exception
     */
    Integer getRoleType(Long roleId) throws Exception;

    /**
     * 判断某角色是否为重要角色（3员）.
     *
     * @param roleId the role id 角色Id
     * @return the boolean
     * @throws Exception the exception
     */
    Boolean isImportantRole(Long roleId) throws Exception;

    /**
     * 修改角色顺序.
     *
     * @param role the role 角色对象
     * @return the role
     * @throws Exception the exception
     */
    Role updateRoleIndexNumber(Role role) throws Exception;

}
