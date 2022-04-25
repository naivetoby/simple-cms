package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import vip.toby.cms.core.dao.CommonDAO;
import vip.toby.cms.core.model.department.Department;
import vip.toby.cms.core.model.user.User;
import vip.toby.cms.core.model.user.UserBase;
import vip.toby.cms.core.model.user.UserGrid;
import vip.toby.cms.core.model.user.UserUpdate;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;

import javax.annotation.Resource;
import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static vip.toby.cms.core.listener.UserSessionListener.STATUS_MAP;


@Service
public class UserService implements IUserService {

    @Resource
    private IDataBaseService coreDataBaseService;
    @Resource
    private CommonDAO commonDAO;

    @Override
    public JSONObject addUser(User user) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException, NoSuchMethodException {
        String salt = CommonUtil.getRandString(64);
        user.setLoginPassword(CommonUtil.sha512("heart12345678".concat(salt)));
        user.setSalt(salt);
        return JSONObject.parseObject("{id : " + coreDataBaseService.add(user, User.class) + "}");
    }

    @Override
    public UserUpdate updateUser(UserUpdate user) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException, InstantiationException, IllegalAccessException {
        if (user.isResetPwd()) {
            resetUserPwd("heart12345678", user.getUserId(), false);
        }
        return coreDataBaseService.save(user, UserUpdate.class);
    }

    @Override
    public JSONObject deleteUser(Long userId) throws InvocationTargetException, IntrospectionException, SQLException {
        Map<Integer, Object> inParamMap = new HashMap<>();
        inParamMap.put(1, userId);
        coreDataBaseService.execute("pro_user", inParamMap, null);
        // 退出当前用户
        STATUS_MAP.remove(userId);
        return JSONObject.parseObject("{id : " + userId + "}");
    }

    @Override
    public UserGrid getUser(Long userId) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException {
        return coreDataBaseService.getEntity(userId, UserGrid.class);
    }

    @Override
    public JSONObject getUserList(Integer start, Integer limit, String queryCondition, String sortCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
        JSONObject responseObj = new JSONObject();
        responseObj.put("total", coreDataBaseService.getTotal(UserGrid.class, queryCondition));
        List<UserGrid> users = coreDataBaseService.list(start, limit, queryCondition, sortCondition, UserGrid.class);
        JSONArray array = new JSONArray();
        for (UserGrid user : users) {
            Long userId = user.getUserId();
            user.setRoles(StringUtils.join(commonDAO.getUserRoleName(userId), ","));
            array.add(JSON.toJSON(user));
        }
        responseObj.put("rows", array);
        return responseObj;
    }

    @Override
    public UserBase getUserBaseInfo(String loginName) {
        return commonDAO.getUserBase(loginName);
    }

    @Override
    public String getUserAuth(Long userId) {
        return CommonUtil.getMergedAuth(commonDAO.getUserRoleAuth(userId));
    }

    @Override
    public Integer checkLoginName(String loginName) {
        return commonDAO.checkLoginName(loginName);
    }

    @Override
    public void changeUserStatus(Integer status, Long userId) {
        commonDAO.changeUserStatus(status, userId);
    }

    @Override
    public List<UserGrid> getUserList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception {
        List<UserGrid> users = coreDataBaseService.list(start, limit, queryCondition, sortCondition, UserGrid.class);
        for (UserGrid user : users) {
            Long userId = user.getUserId();
            user.setRoles(StringUtils.join(commonDAO.getUserRoleName(userId), ","));
        }
        return users;
    }

    @Override
    public void resetUserPwd(String password, Long userId, boolean isSelf) {
        // 如果是自己修改密码,则将状态改为1(正常)，否则管理员重置密码，将状态改成-1(未激活)
        int status = isSelf ? 1 : -1;
        String salt = CommonUtil.getRandString(64);
        commonDAO.resetUserPwd(CommonUtil.sha512(password.concat(salt)), salt, status, userId);
        // 退出当前用户
        STATUS_MAP.remove(userId);
    }

    // 获取用户所拥有的角色类型
    @Override
    public List<Integer> getRoleTypesByUserId(Long userId) {
        List<Map> query = coreDataBaseService.query("SELECT r.role_type FROM t_role_user u LEFT JOIN t_role r ON r.role_id = u.role_id WHERE u.user_id = " + userId + "");
        if (query != null && query.size() > 0) {
            List<Integer> list = new ArrayList<>();
            for (Map map : query) {
                list.add(Integer.valueOf(map.get("roleType").toString()));
            }
            return list;
        }
        return null;
    }

    @Override
    public JSONObject getDeptUserTree(String sortCondition) throws Exception {
        JSONObject json = new JSONObject();
        json.put("id", DataBaseUtil.getUUID());
        json.put("itemId", 0);
        json.put("text", "users");
        json.put("leaf", false);
        json.put("checked", false);
        json.put("root", true);
        JSONArray response = new JSONArray();
        List<UserGrid> users = coreDataBaseService.list(null, sortCondition, UserGrid.class);
        List<Department> depts = coreDataBaseService.list(null, sortCondition, Department.class);
        for (Department dept : depts) {
            JSONObject deptJson = new JSONObject();
            deptJson.put("id", DataBaseUtil.getUUID());
            deptJson.put("itemId", dept.getDeptId());
            deptJson.put("text", dept.getDeptName());
            deptJson.put("leaf", false);
            deptJson.put("checked", false);
            if (!users.isEmpty()) {
                JSONArray userArr = new JSONArray();
                for (UserGrid user : users) {
                    if (user.getDeptId().equals(dept.getDeptId())) {
                        JSONObject userJson = new JSONObject();
                        deptJson.put("id", DataBaseUtil.getUUID());
                        deptJson.put("itemId", user.getUserId());
                        deptJson.put("text", user.getUserName());
                        deptJson.put("leaf", true);
                        deptJson.put("checked", false);
                        userArr.add(userJson);
                    }
                }
                deptJson.put("children", userArr);
            }
            response.add(deptJson);
        }
        json.put("children", response);
        return json;
    }

    @Override
    public JSONObject getDeptUserTree(String sortCondition, String selectedIds) throws Exception {
        JSONObject json = new JSONObject();
        json.put("id", DataBaseUtil.getUUID());
        json.put("itemId", 0);
        json.put("text", "users");
        json.put("leaf", false);
        json.put("checked", false);
        json.put("root", true);
        JSONArray response = new JSONArray();
        List<UserGrid> users = coreDataBaseService.list(null, sortCondition, UserGrid.class);
        List<Department> depts = coreDataBaseService.list(null, sortCondition, Department.class);
        String[] strs = null;
        if (StringUtils.isNotBlank(selectedIds)) {
            strs = selectedIds.split(",");
        }
        for (Department dept : depts) {
            boolean deptChecked = false;
            JSONObject deptJson = new JSONObject();
            deptJson.put("id", DataBaseUtil.getUUID());
            deptJson.put("itemId", dept.getDeptId());
            deptJson.put("text", dept.getDeptName());
            deptJson.put("leaf", false);
            if (!users.isEmpty()) {
                JSONArray userArr = new JSONArray();
                for (UserGrid user : users) {
                    if (user.getDeptId().equals(dept.getDeptId())) {
                        boolean userChecked = false;
                        String userId = user.getUserId().toString();
                        if (strs != null) {
                            for (String id : strs) {
                                if (id.equals(userId)) {
                                    userChecked = true;
                                    deptChecked = true;
                                    break;
                                }
                            }
                        }
                        JSONObject userJson = new JSONObject();
                        deptJson.put("id", DataBaseUtil.getUUID());
                        deptJson.put("itemId", userId);
                        deptJson.put("text", user.getUserName());
                        deptJson.put("leaf", true);
                        deptJson.put("checked", userChecked);
                        userArr.add(userJson);
                    }
                }
                deptJson.put("children", userArr);
            }
            deptJson.put("checked", deptChecked);
            deptJson.put("expanded", deptChecked);
            response.add(deptJson);
        }
        json.put("children", response);
        return json;
    }

}
