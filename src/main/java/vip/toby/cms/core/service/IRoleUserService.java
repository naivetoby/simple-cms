package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONObject;

/**
 * 处理角色用户关联业务接口.
 */
public interface IRoleUserService {

    /**
     * 解除角色与用户的关系
     *
     * @param roleId Long 角色Id
     * @param userId Long 用户Id
     * @throws Exception
     */
    void delete(Long roleId, Long userId) throws Exception;

    /**
     * 为普通角色添加用户
     *
     * @param roleId Long 角色Id
     * @param userId Long 用户Id
     * @throws Exception
     */
    void addUser4CommonRole(Long roleId, Long userId) throws Exception;

    /**
     * 修改重要角色里的用户（3员）
     *
     * @param roleId Long 角色Id
     * @param userId Long 用户Id
     * @throws Exception
     */
    void updateUser4ImportantRole(Long roleId, Long userId) throws Exception;

    /**
     * （只限普通角色） 得到绑定了该角色的用户
     *
     * @param json   JSONObject json对象
     * @param roleId Long 角色Id
     * @return JSONObject json对象
     */
    JSONObject getBindRole4User(JSONObject json, Long roleId);

    /**
     * （只限普通角色） 得到未绑定该角色的用户
     *
     * @param json   JSONObject json对象
     * @param roleId Long 角色Id
     * @return JSONObject json对象
     * @throws Exception
     */
    JSONObject getUnBoundRole4User(JSONObject json, Long roleId) throws Exception;

    /**
     * 判断某用户是否拥有重要角色（3员）
     *
     * @param userId Long 用户Id
     * @return Boolean
     */
    boolean hasImportantRole(Long userId);

    /**
     * 专为重要角色（3员角色）处理的，得到的用户有以下几种情况：
     * 一：当该角色是系统管理员或者安全保密管理员，那么用户为绑定了该角色的用户加上没有日志审计员角色的其他用户。
     * 二：当该角色是日志审计员，那么用户为绑定了该角色的用户加上没有系统管理员和安全保密管理员角色的其他用户。
     *
     * @param json   JSONObject json对象
     * @param roleId Long 角色Id
     * @return JSONObject json对象
     * @throws Exception
     */
    JSONObject getUser4ImportantRole(JSONObject json, Long roleId) throws Exception;

    /**
     * 只处理重要角色（3员） 当前角色为日志审计员时，要判断当前的用户没有系统管理员和安全保密管理员这两个角色。
     * 当前角色为系统管理员或者安全保密管理员时，要判断当前的用户没有日志审计员这个角色。
     *
     * @param roleId
     * @param userId
     * @return 是否允许修改
     * @throws Exception
     */
    boolean isAllowUpdate(Long roleId, Long userId) throws Exception;

}
