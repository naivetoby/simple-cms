package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;
import vip.toby.cms.core.dao.CommonDAO;
import vip.toby.cms.core.model.role.Role;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.IRoleService;
import vip.toby.cms.core.util.FinalVariables;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RoleService implements IRoleService {

    @Resource
    private IDataBaseService coreDataBaseService;
    @Resource
    private CommonDAO commonDAO;

    @Override
    public Role getRole(Long roleId) throws Exception {
        return coreDataBaseService.getEntity(roleId, Role.class);
    }

    @Override
    public Role updateRole(Role role) throws Exception {
        return coreDataBaseService.save(role, Role.class);
    }

    @Override
    public Role updateRoleIndexNumber(Role role) throws Exception {
        commonDAO.updateRoleIndexNumber(role.getRoleId(), role.getIndexNumber());
        return getRole(role.getRoleId());
    }

    @Override
    public JSONObject deleteRole(Long roleId) throws Exception {
        if (isImportantRole(roleId) || roleId < 0) {//重要角色不能删除，小于0的一般设为流程角色
            return JSON.parseObject("{id : " + roleId + "}");
        }
        Map<Integer, Object> inParams = new HashMap<Integer, Object>();
        inParams.put(1, roleId);
        coreDataBaseService.execute("pro_role", inParams, null);
        return JSON.parseObject("{id : " + roleId + "}");
    }

    @Override
    public JSONObject addRole(Role role) throws Exception {
        return JSON.parseObject("{id : " + coreDataBaseService.add(role, Role.class) + "}");
    }

    @Override
    public JSONObject getRoleList(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception {
        JSONObject responseObj = new JSONObject();
        List<Role> roles = coreDataBaseService.list(start, start + limit, queryCondition, sortCondition, Role.class);
        JSONArray array = new JSONArray();
        for (Role role : roles) {
            Long roleId = role.getRoleId();
            role.setUsers(commonDAO.getUserIdsByRoleId(roleId));
            array.add(JSON.toJSON(role));
        }
        // 获取总条目数
        responseObj.put("total", coreDataBaseService.getTotal(Role.class, queryCondition));
        responseObj.put("rows", array);
        return responseObj;
    }

    @Override
    public List<Long> getUserIdsByRoleId(Long roleId) {
        return commonDAO.getUserIdsByRoleId(roleId);
    }

    @Override
    public String getRoleAuth(Long roleId) {
        return commonDAO.getRoleAuth(roleId);
    }

    @Override
    public List<Role> getRoleList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception {
        return coreDataBaseService.list(start, start + limit, queryCondition, sortCondition, Role.class);
    }

    @Override
    public Integer getRoleType(Long roleId) {
        return commonDAO.getRoleType(roleId);
    }

    @Override
    public Boolean isImportantRole(Long roleId) throws Exception {
        Role role = getRole(roleId);
        if (role != null) {
            for (Integer type : FinalVariables.IMPORTANT_ROLE_TYPES) {
                if (type.equals(role.getRoleType())) {
                    return true;
                }
            }
        }
        return false;
    }

}
