package vip.toby.cms.core.controller.user;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.user.*;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.IModuleService;
import vip.toby.cms.core.service.IRoleUserService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;
import vip.toby.cms.core.util.ExportExcel;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static vip.toby.cms.core.util.FinalVariables.ERROR_MSG;
import static vip.toby.cms.core.util.FinalVariables.USER_SESSION;

/**
 * 处理用户的控制器.
 */
@RestController
@RequestMapping("user")
public class UserController {

    @Resource
    private IUserService userService;
    @Resource
    private IModuleService moduleService;
    @Resource
    private IRoleUserService roleUserService;
    @Resource
    private ILogService logService;

    private static final String MODULE = "User";
    private static final String MODULE_NAME = "用户管理";

    /**
     * 获取用户的列表信息.
     *
     * @param limit  the limit 每页显示数目
     * @param start  the start 分页起始值
     * @param sort   the sort 排序条件
     * @param filter the query condition 查询条件
     * @return the user list
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET)
    @AuthRequired(module = MODULE)
    public JSONObject getUserList(@RequestParam Integer limit, @RequestParam Integer start, @RequestParam(required = false) String sort, @RequestParam(required = false) String filter) throws Exception {
        return userService.getUserList(start, limit, DataBaseUtil.filterAnalytic(filter).get("query"), sort);
    }

    /**
     * 获取某个用户.
     *
     * @param userId the user id 用户Id
     * @return the user 用户信息
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET, path = "{userId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject getUser(@PathVariable Long userId) throws Exception {
        return (JSONObject) JSON.toJSON(userService.getUser(userId));
    }

    /**
     * 添加用户.
     *
     * @param user the user 添加的用户信息
     * @return the JSON object 添加的用户的Id
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST)
    @AuthRequired(module = MODULE)
    public JSONObject addUser(HttpServletRequest request, @RequestBody User user) throws Exception {
        JSONObject json = userService.addUser(user);
        logService.addLog(request, MODULE_NAME, "添加用户: 【" + user.getUserName() + "】");
        return json;
    }

    /**
     * 修改用户.
     *
     * @param user the user 要修改的用户信息
     * @return the JSON object 修改后的用户信息
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.PUT, path = "{userId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject updateUser(HttpServletRequest request, @RequestBody UserUpdate user) throws Exception {
        UserUpdate userUpdate = userService.updateUser(user);
        if (user.isResetPwd()) {
            logService.addLog(request, MODULE_NAME, "重置用户密码: 【" + user.getUserName() + "】");
        } else {
            logService.addLog(request, MODULE_NAME, "编辑用户: 【" + user.getUserName() + "】");
        }
        return (JSONObject) JSON.toJSON(userUpdate);
    }

    /**
     * 删除用户.
     *
     * @param user the user 删除的用户信息
     * @return the JSON object 删除的用户Id
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.DELETE, path = "{userId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject deleteUser(HttpServletRequest request, @RequestBody User user) throws Exception {
        if (roleUserService.hasImportantRole(user.getUserId())) {
            JSONObject msg = new JSONObject();
            msg.put(ERROR_MSG, "当前用户为三员之一，  无法删除");
            return msg;
        }
        JSONObject json = userService.deleteUser(user.getUserId());
        logService.addLog(request, MODULE_NAME, "删除用户: 【" + user.getUserName() + "】");
        return json;
    }

    /**
     * 获取用户信息报表.
     *
     * @param limit      the limit 每页显示数目
     * @param start      the start 分页起始值
     * @param base64Sort the sort condition 排序条件
     * @param filter     the query condition 查询条件
     * @param response   the response
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST, path = "excel")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public void getUserListExcel(HttpServletResponse response, HttpServletRequest request, @RequestParam Integer limit, @RequestParam Integer start, @RequestParam String base64Sort, @RequestParam(required = false) String filter) throws Exception {
        ExportExcel.exportExcel(response, "用户信息报表", userService.getUserList4Excel(start, limit, filter, CommonUtil.base64Decode(base64Sort)), UserGrid.class);
        logService.addLog(request, MODULE_NAME, "导出: 【用户信息报表】");
    }

    /**
     * 重置密码.
     *
     * @param session     the session 会话对象
     * @param oldPassword the old password 旧密码
     * @param newPassword the new password 新密码
     * @return the JSON object 修改是否成功的标识
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST, path = "resetPwd")
    public JSONObject postResetPwd(HttpServletRequest request, HttpSession session, @RequestParam String oldPassword, @RequestParam String newPassword) throws Exception {
        JSONObject result = new JSONObject();
        UserSession userSession = (UserSession) session.getAttribute(USER_SESSION);
        UserBase userBase = userService.getUserBaseInfo(userSession.getLoginName());
        if (userBase != null && userBase.getLoginPassword().equals(CommonUtil.sha512(oldPassword.concat(userBase.getSalt())))) {
            Long userId = userBase.getUserId();
            userService.resetUserPwd(newPassword, userId, true);
            result.put("success", true);
        } else {
            result.put("error", true);
        }
        JSONObject json = new JSONObject();
        json.put("result", result);
        logService.addLog(request, MODULE_NAME, "修改密码");
        return json;
    }

    /**
     * 检查登录名是否重复.
     *
     * @param loginName the login name 登录名
     * @return the integer 存在的个数
     */
    @RequestMapping(method = RequestMethod.POST, path = "checkLoginName")
    @AuthRequired(module = MODULE)
    public Integer checkLoginName(@RequestParam String loginName) {
        return userService.checkLoginName(loginName);
    }

    /**
     * 改变用户状态.
     *
     * @param userId the user id 用户Id
     * @return the JSON object 要改变的用户Id
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST, path = "changeUserStatus")
    @AuthRequired(module = MODULE)
    public JSONObject changeUserStatus(HttpServletRequest request, @RequestParam Long userId) throws Exception {
        UserGrid userGrid = userService.getUser(userId);
        Integer status = userGrid.getStatus();
        if (status == 1) {
            if (roleUserService.hasImportantRole(userGrid.getUserId())) {
                JSONObject msg = new JSONObject();
                msg.put(ERROR_MSG, "当前用户为三员之一， 无法锁定");
                return msg;
            }
            userService.changeUserStatus(2, userId); // 锁定用户
            logService.addLog(request, MODULE_NAME, "锁定用户: " + userGrid.getUserName());
            UserSessionListener.STATUS_MAP.remove(userId);
        } else if (status == 2) {
            userService.changeUserStatus(1, userId); // 解锁用户
            logService.addLog(request, MODULE_NAME, "解锁用户: " + userGrid.getUserName());
        }
        return JSONObject.parseObject("{id : " + userId + "}");
    }

    /**
     * 查看权限时获取模块树.
     *
     * @param moduleId the parent id 父节点Id
     * @param userId   the user id 用户Id
     * @param sort     the sort 排序条件
     * @return the module tree 树信息
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET, path = "auth/{moduleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONArray getModuleTree(@PathVariable Long moduleId, @RequestParam(required = false) Long userId, @RequestParam(required = false) String sort) throws Exception {
        return moduleService.getModule4TreeList(moduleId, sort.toString(), userService.getUserAuth(userId));
    }

    @RequestMapping(method = RequestMethod.GET, path = "deptusertree/root")
    @AuthRequired(module = MODULE)
    public JSONObject getDeptUserTree(@RequestParam String sort, @RequestParam String selectedIds) throws Exception {
        return userService.getDeptUserTree(sort, selectedIds);
    }

}
