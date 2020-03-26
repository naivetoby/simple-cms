package vip.toby.cms.core.controller.role;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.role.Role;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.IModuleService;
import vip.toby.cms.core.service.IRoleService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;
import vip.toby.cms.core.util.ExportExcel;
import vip.toby.cms.core.util.FinalVariables.ERRRO_CODE;
import vip.toby.cms.core.util.FinalVariables.RoleTypeEnum;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 角色控制器.
 */
@RestController
@RequestMapping("role")
public class RoleController {

    @Resource
    private IRoleService roleService;
    @Resource
    private IModuleService moduleService;
    @Resource
    private IUserService userService;
    @Resource
    private ILogService logService;

    private static final String MODULE = "Role";
    private static final String MODULE_NAME = "角色管理";

    /**
     * 获取所以角色信息 .
     */
    @RequestMapping(method = RequestMethod.GET)
    @AuthRequired(module = MODULE)
    public JSONObject getRoleList(@RequestParam Integer start, @RequestParam Integer limit, @RequestParam(required = false) String filter, @RequestParam(required = false) String sort) throws Exception {
        return roleService.getRoleList(start, limit, DataBaseUtil.filterAnalytic(filter).get("query"), sort);
    }

    /**
     * 获取某个角色.
     */
    @RequestMapping(method = RequestMethod.GET, path = "{roleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject getRole(@PathVariable Long roleId) throws Exception {
        return (JSONObject) JSON.toJSON(roleService.getRole(roleId).toString());
    }

    /**
     * 获取角色的所有用户Id.
     */
    @RequestMapping(method = RequestMethod.GET, path = "user")
    @AuthRequired(module = MODULE)
    public JSONObject getUserIds(@RequestParam Long roleId) throws Exception {
        JSONObject json = new JSONObject();
        json.put("userIds", roleService.getUserIdsByRoleId(roleId));
        return json;
    }

    /**
     * 添加某个角色.
     */
    @RequestMapping(method = RequestMethod.POST)
    @AuthRequired(module = MODULE)
    public JSONObject addRole(HttpServletRequest request, HttpServletResponse response, @RequestBody Role role) throws Exception {
        role.setRoleType(RoleTypeEnum.NORMAL.getType());
        logService.addLog(request, MODULE_NAME, "添加角色: 【" + role.getRoleName() + "】");
        return roleService.addRole(role);
    }

    /**
     * 修改角色.
     */
    @RequestMapping(method = RequestMethod.PUT, path = "{roleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject updateRole(HttpServletRequest request, HttpServletResponse response, @RequestBody Role role) throws Exception {
        // 先判断当前角色的权限是否被改掉
        if (!role.getAuthInfo().equals(roleService.getRoleAuth(role.getRoleId()))) {
            // 重要角色只能改排序号
            Long roleId = role.getRoleId();
            // 不允许编辑重要角色
            if (roleService.isImportantRole(roleId)) {
                return (JSONObject) JSON.toJSON(roleService.updateRoleIndexNumber(role).toString());
            }
            // 普通角色(包含修改权限)
            JSONObject returnJson = (JSONObject) JSON.toJSON(roleService.updateRole(role));
            logService.addLog(request, MODULE_NAME, "修改角色权限: 【" + role.getRoleName() + "】");
            // 判断所属用户的权限是否被修改,如果被修改,必须用户强制退出
            List<Long> userIds = roleService.getUserIdsByRoleId(roleId);
            for (Long userId : userIds) {
                // 获得用户当前权限
                String auth = userService.getUserAuth(userId);
                // 获得用户未修改前的权限(内存中)
                String lastAuth = UserSessionListener.AUTH_MAP.get(userId);
                if (StringUtils.isNotBlank(auth) && StringUtils.isNotBlank(lastAuth) && !auth.equals(lastAuth)) {
                    UserSessionListener.AUTH_MAP.remove(userId);
                }
            }
            return returnJson;
        }
        // 普通角色(不包含修改权限)
        logService.addLog(request, MODULE_NAME, "编辑角色: 【" + role.getRoleName() + "】");
        return (JSONObject) JSON.toJSON(roleService.updateRole(role));
    }

    /**
     * 删除角色.
     */
    @RequestMapping(method = RequestMethod.DELETE, path = "{roleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject deleteRole(HttpServletRequest request, HttpServletResponse response, @RequestBody Role role) throws Exception {
        Long roleId = role.getRoleId();
        // 不允许删除重要角色
        if (roleService.isImportantRole(roleId)) {
            response.setStatus(ERRRO_CODE.NO_AUTH.getErrorCode());
            return (JSONObject) JSON.toJSON("{id : " + roleId + "}");
        }
        List<Long> userIds = roleService.getUserIdsByRoleId(roleId);
        for (Long userId : userIds) {
            String lastAuth = UserSessionListener.AUTH_MAP.get(userId);
            if (StringUtils.isNotBlank(lastAuth)) {
                String auth = userService.getUserAuth(userId);
                if (StringUtils.isNotBlank(auth) && !auth.equals(lastAuth)) {
                    UserSessionListener.AUTH_MAP.remove(userId);
                }
            }
        }
        logService.addLog(request, MODULE_NAME, "删除角色: 【" + role.getRoleName() + "】");
        return roleService.deleteRole(roleId);
    }

    /**
     * 获取角色信息报表.
     */
    @RequestMapping(method = RequestMethod.POST, path = "excel")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public void getRoleListExcel(HttpServletRequest request, HttpServletResponse response, @RequestParam Integer limit, @RequestParam Integer start, @RequestParam String base64Sort, @RequestParam(required = false) String filter) throws Exception {
        ExportExcel.exportExcel(response, "角色信息报表", roleService.getRoleList4Excel(start, limit, filter, CommonUtil.base64Decode(base64Sort)), Role.class);
        logService.addLog(request, MODULE_NAME, "导出: 【角色信息报表】");
    }

    /**
     * 查看模块树.
     */
    @RequestMapping(method = RequestMethod.GET, path = "auth/{moduleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONArray getModuleTree(@PathVariable Long moduleId, @RequestParam(required = false) Long roleId, @RequestParam String sort) throws Exception {
        return moduleService.getModule4TreeList(moduleId, roleId, sort);
    }

}
