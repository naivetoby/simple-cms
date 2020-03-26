package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.user.User;
import vip.toby.cms.core.model.user.UserBase;
import vip.toby.cms.core.model.user.UserGrid;
import vip.toby.cms.core.model.user.UserUpdate;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.List;

/**
 * The Interface IGkUserService.
 */
public interface IUserService {

    /**
     * Gets the user list.
     *
     * @param start          the start
     * @param limit          the limit
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the user list
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     */
    JSONObject getUserList(Integer start, Integer limit, String queryCondition, String sortCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException;

    /**
     * Gets the user.
     *
     * @param userId the user id
     * @return the user
     * @throws InvocationTargetException the invocation target exception
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws IntrospectionException    the introspection exception
     */
    UserGrid getUser(Long userId) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException;

    /**
     * 添加 user.
     *
     * @param user the user
     * @return the JSON object
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     * @throws InstantiationException    the instantiation exception
     * @throws IllegalAccessException    the illegal access exception
     * @throws NoSuchMethodException     the no such method exception
     */
    JSONObject addUser(User user) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException, NoSuchMethodException;

    /**
     * Update user.
     *
     * @param user the user
     * @return the user update
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     * @throws InstantiationException    the instantiation exception
     * @throws IllegalAccessException    the illegal access exception
     */
    UserUpdate updateUser(UserUpdate user) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException;

    /**
     * Delete user.
     *
     * @param userId the user id
     * @return the JSON object
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     * @throws SQLException
     */
    JSONObject deleteUser(Long userId) throws InvocationTargetException, IntrospectionException, SQLException;

    /**
     * Gets the user base info.
     *
     * @param loginName the login name
     * @return the user base info
     */
    UserBase getUserBaseInfo(String loginName);

    /**
     * Gets the user auth.
     *
     * @param userId the user id
     * @return the user auth
     */
    String getUserAuth(Long userId);

    /**
     * Check login name.
     *
     * @param loginName the login name
     * @return the integer
     */
    Integer checkLoginName(String loginName);

    /**
     * Change user status.
     *
     * @param status the status
     * @param userId the user id
     */
    void changeUserStatus(Integer status, Long userId);

    /**
     * Reset user pwd.
     *
     * @param password the password
     * @param userId   the user id
     * @param isSelf   the is self
     */
    void resetUserPwd(String password, Long userId, boolean isSelf);

    /**
     * Gets the user list4 excel.
     *
     * @param start          the start
     * @param limit          the limit
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the user list4 excel
     * @throws Exception the exception
     */
    List<UserGrid> getUserList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception;

    /**
     * Gets the role types by user id.
     *
     * @param userId the user id
     * @return the role types by user id
     */
    List<Integer> getRoleTypesByUserId(Long userId);

    /**
     * 生成带复选框部门用户树数据
     *
     * @param sortCondition
     * @return
     * @throws Exception
     */
    JSONObject getDeptUserTree(String sortCondition) throws Exception;

    /**
     * 生成带复选框部门用户树数据,并判断是否已选中
     *
     * @param sortCondition
     * @param selectedIds   已选中的id,以逗号隔开的字符串
     * @return
     * @throws Exception
     */
    JSONObject getDeptUserTree(String sortCondition, String selectedIds) throws Exception;

}
