package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.IRoleService;
import vip.toby.cms.core.service.IRoleUserService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.FinalVariables;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoleUserService implements IRoleUserService {

    @Resource
    private IDataBaseService coreDataBaseService;
    @Resource
    private IRoleService roleService;
    @Resource
    private IUserService userService;

    @Override
    public void delete(Long roleId, Long userId) throws Exception {
        coreDataBaseService.update("DELETE FROM t_role_user WHERE user_id= " + userId + " AND role_id = " + roleId);
    }

    @Override
    public void addUser4CommonRole(Long roleId, Long userId) throws Exception {
        coreDataBaseService.update("INSERT INTO t_role_user(user_id, role_id) values(" + userId + ", " + roleId + ")");
    }

    @Override
    public boolean isAllowUpdate(Long roleId, Long userId) throws Exception {
        // 三员之一
        if (roleService.isImportantRole(roleId)) {
            int toRoleType = roleService.getRoleType(roleId);
            if ((!isSecret(userId) && !isAdmin(userId) && toRoleType == FinalVariables.RoleTypeEnum.AUDIT.getType()) || (!isAudit(userId) && (toRoleType == FinalVariables.RoleTypeEnum.ADMIN.getType() || toRoleType == FinalVariables.RoleTypeEnum.SECRET.getType()))) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void updateUser4ImportantRole(Long roleId, Long userId) throws Exception {
        Map<Integer, Object> inParams = new HashMap<Integer, Object>();
        inParams.put(1, roleId);
        inParams.put(2, userId);
        coreDataBaseService.execute("pro_important_role", inParams, null);
    }

    @Override
    public JSONObject getBindRole4User(JSONObject json, Long roleId) {
        List<Map<String, Object>> list = coreDataBaseService.query("SELECT user_id, user_name FROM v_user_grid WHERE status != " + FinalVariables.USER_STATUS.LOCKED.getStatus() + " AND user_id IN (SELECT user_id FROM t_role_user WHERE role_id = " + roleId + ") ORDER BY index_number ASC");
        json.put("rows", JSON.toJSON(list));
        return json;
    }

    @Override
    public JSONObject getUnBoundRole4User(JSONObject json, Long roleId) throws Exception {
        if (roleId == null) {
            json.put(FinalVariables.ERROR_MSG, "角色未知");
            return json;
        }
        json.put("rows", JSON.toJSON(coreDataBaseService.query("SELECT user_id, user_name FROM v_user_grid WHERE status != " + FinalVariables.USER_STATUS.LOCKED.getStatus() + " AND (user_id NOT IN (SELECT user_id FROM t_role_user) OR user_id NOT IN (SELECT user_id FROM t_role_user WHERE role_id = " + roleId + ")) ORDER BY index_number ASC")));
        return json;
    }

    @Override
    public JSONObject getUser4ImportantRole(JSONObject json, Long roleId) throws Exception {
        if (roleId == null) {
            json.put(FinalVariables.ERROR_MSG, "角色未知");
            return json;
        }
        // 当前角色类型
        int roleType = roleService.getRoleType(roleId);
        if (roleType == FinalVariables.RoleTypeEnum.ADMIN.getType() || roleType == FinalVariables.RoleTypeEnum.SECRET.getType()) {
            json.put("rows", coreDataBaseService.query("SELECT user_id, user_name FROM v_user_grid WHERE status != " + FinalVariables.USER_STATUS.LOCKED.getStatus() + " AND (user_id NOT IN (SELECT user_id FROM t_role_user JOIN t_role USING(role_id) WHERE role_type = " + FinalVariables.RoleTypeEnum.AUDIT.getType() + ")) ORDER BY index_number ASC"));
        } else if (roleType == FinalVariables.RoleTypeEnum.AUDIT.getType()) {
            json.put("rows", coreDataBaseService.query("SELECT user_id, user_name FROM v_user_grid WHERE status != " + FinalVariables.USER_STATUS.LOCKED.getStatus() + " AND (user_id NOT IN (SELECT user_id FROM t_role_user JOIN t_role USING(role_id) WHERE role_type IN (" + FinalVariables.RoleTypeEnum.ADMIN.getType() + "," + FinalVariables.RoleTypeEnum.SECRET.getType() + "))) ORDER BY index_number ASC"));
        }
        return json;
    }

    @Override
    public boolean hasImportantRole(Long userId) {
        return isAdmin(userId) || isAudit(userId) || isSecret(userId);
    }

    // 是否为安全保密管理员
    private boolean isSecret(Long userId) {
        List<Integer> list = userService.getRoleTypesByUserId(userId);
        if (list == null)
            return false;
        for (Integer i : list) {
            if (i == FinalVariables.RoleTypeEnum.SECRET.getType()) {
                return true;
            }
        }
        return false;
    }

    // 是否为日志审计员
    private boolean isAudit(Long userId) {
        List<Integer> list = userService.getRoleTypesByUserId(userId);
        if (list == null)
            return false;
        for (Integer i : list) {
            if (i == FinalVariables.RoleTypeEnum.AUDIT.getType()) {
                return true;
            }
        }
        return false;
    }

    // 是否为系统管理员
    private boolean isAdmin(Long userId) {
        List<Integer> list = userService.getRoleTypesByUserId(userId);
        if (list == null)
            return false;
        for (Integer i : list) {
            if (i == FinalVariables.RoleTypeEnum.ADMIN.getType()) {
                return true;
            }
        }
        return false;
    }

}
