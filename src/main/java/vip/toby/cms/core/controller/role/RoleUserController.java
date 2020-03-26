package vip.toby.cms.core.controller.role;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.role.Role;
import vip.toby.cms.core.model.user.UserGrid;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.IRoleService;
import vip.toby.cms.core.service.IRoleUserService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.FinalVariables.ERRRO_CODE;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 处理用户与角色关联关系的控制器.
 */
@RestController
@RequestMapping("role/roleUser")
public class RoleUserController {

    @Resource
    private IRoleUserService roleUserService;
    @Resource
    private IRoleService roleService;
    @Resource
    private IUserService userService;
    @Resource
    private ILogService logService;

    private static final String MODULE = "Role";
    private static final String MODULE_NAME = "角色管理";

    /**
     * 得到未绑定该角色的用户.
     */
    @RequestMapping(method = RequestMethod.GET, path = "unBoundUser")
    @AuthRequired(module = MODULE)
    public JSONObject getUnBoundUser(@RequestParam Long roleId) throws Exception {
        return roleUserService.getUnBoundRole4User(new JSONObject(), roleId);
    }

    /**
     * 得到绑定了该角色的用户.
     */
    @RequestMapping(method = RequestMethod.GET, path = "bindUser")
    @AuthRequired(module = MODULE)
    public JSONObject getBindUser(@RequestParam Long roleId) {
        return roleUserService.getBindRole4User(new JSONObject(), roleId);
    }

    /**
     * 专为重要角色（3员角色）处理的，得到的用户有以下几种情况：
     * 一：当该角色是系统管理员或者安全保密管理员，那么用户为绑定了该角色的用户加上没有日志审计员角色的其他用户。
     * 二：当该角色是日志审计员，那么用户为绑定了该角色的用户加上没有系统管理员和安全保密管理员角色的其他用户。
     */
    @RequestMapping(method = RequestMethod.GET, path = "user4ImportantRole")
    @AuthRequired(module = MODULE)
    public JSONObject getUser4ImportantRole(@RequestParam Long roleId) throws Exception {
        return roleUserService.getUser4ImportantRole(new JSONObject(), roleId);
    }

    /**
     * 修改重要角色（3员）里的用户.
     */
    @RequestMapping(method = RequestMethod.POST, path = "user4ImportantRole")
    @AuthRequired(module = MODULE)
    public void updateUser4ImportantRole(HttpServletRequest request, HttpServletResponse response, @RequestParam Long userId, @RequestParam Long roleId) throws Exception {
        if (!roleUserService.isAllowUpdate(roleId, userId)) {
            response.setStatus(ERRRO_CODE.NO_AUTH.getErrorCode());
            return;
        }
        roleUserService.updateUser4ImportantRole(roleId, userId);
        logService.addLog(request, MODULE_NAME, "将角色【" + roleService.getRole(roleId).getRoleName() + "】里的用户修改为【" + userService.getUser(userId).getUserName() + "】");
        resetUserAuth(userId);
    }

    /**
     * 建立用户角色关联关系.
     */
    @RequestMapping(method = RequestMethod.POST, path = "bindUser/{userId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public void bindUser(HttpServletRequest request, HttpServletResponse response, @PathVariable Long userId, @RequestParam Long roleId) throws Exception {
        roleUserService.addUser4CommonRole(roleId, userId);
        Role role = roleService.getRole(roleId);
        UserGrid userGrid = userService.getUser(userId);
        logService.addLog(request, MODULE_NAME, "将用户【" + userGrid.getUserName() + "】绑定到【" + role.getRoleName() + "】角色里");
        resetUserAuth(userId);
    }

    /**
     * 解除关联关系.
     */
    @RequestMapping(method = RequestMethod.DELETE, path = "bindUser/{userId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public void removeUser(HttpServletRequest request, HttpServletResponse response, @PathVariable Long userId, @RequestParam Long roleId) throws Exception {
        roleUserService.delete(roleId, userId);
        Role role = roleService.getRole(roleId);
        UserGrid userGrid = userService.getUser(userId);
        logService.addLog(request, MODULE_NAME, "将用户【" + userGrid.getUserName() + "】从【" + role.getRoleName() + "】角色里移除");
        resetUserAuth(userId);
    }

    /*
     * 当用户权限发生变化时强制退出该用户
     *
     */
    private void resetUserAuth(Long userId) {
        String auth = userService.getUserAuth(userId);
        String lastAuth = UserSessionListener.AUTH_MAP.get(userId);
        if (StringUtils.isNotBlank(auth) && StringUtils.isNotBlank(lastAuth) && !auth.equals(lastAuth)) {
            UserSessionListener.AUTH_MAP.remove(userId);
        }
    }

}
