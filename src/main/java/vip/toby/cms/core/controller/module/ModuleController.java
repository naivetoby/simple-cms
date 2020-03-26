package vip.toby.cms.core.controller.module;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.module.Module;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.IModuleService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;
import vip.toby.cms.core.util.ExportExcel;
import vip.toby.cms.core.util.FinalVariables.ERRRO_CODE;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static vip.toby.cms.core.util.FinalVariables.SUPER_AUTH;
import static vip.toby.cms.core.util.FinalVariables.USER_SESSION;

/**
 * The Class ModuleController.
 */
@RestController
@RequestMapping("module")
public class ModuleController {

    @Resource
    private IModuleService moduleService;
    @Resource
    private ILogService logService;

    @Value("${isDevelopment:false}")
    private String isDevelopment;

    private static final String MODULE = "Module";
    private static final String MODULE_NAME = "模块管理";

    /**
     * 获取模块列表.
     */
    @RequestMapping(method = RequestMethod.GET)
    @AuthRequired(module = MODULE)
    public JSONObject getModuleList(@RequestParam Integer start, @RequestParam Integer limit, @RequestParam(required = false) String filter, @RequestParam(required = false) String sort) throws Exception {
        return moduleService.getModuleList(start, limit, DataBaseUtil.filterAnalytic(filter).get("query"), sort);
    }

    /**
     * 获取某一个模块信息.
     */
    @RequestMapping(method = RequestMethod.GET, path = "{moduleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject getModule(@RequestParam Long moduleId) throws Exception {
        return (JSONObject) JSONObject.toJSON(moduleService.getModule(moduleId));
    }

    /**
     * 添加模块信息.
     */
    @RequestMapping(method = RequestMethod.POST)
    @AuthRequired(module = MODULE)
    public JSONObject addModule(HttpServletRequest request, HttpServletResponse response, @RequestBody Module module) throws Exception {
        response.setStatus(ERRRO_CODE.MODULE_CHANGED.getErrorCode());
        logService.addLog(request, MODULE_NAME, "添加模块: 【" + module.getModuleName() + "】");
        return moduleService.addModule(module);
    }

    /**
     * 编辑模块信息.
     */
    @RequestMapping(method = RequestMethod.PUT, path = "{moduleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject updateModule(HttpServletRequest request, HttpServletResponse response, @RequestBody Module module) throws Exception {
        Long moduleId = module.getModuleId();
        // 发布版不允许编辑模块
        if (!Boolean.parseBoolean(isDevelopment) && moduleService.isSystemModule(moduleId)) {
            return (JSONObject) JSONObject.toJSON(moduleService.updateModuleIndexNumber(module));
        }
        logService.addLog(request, MODULE_NAME, "编辑模块: 【" + module.getModuleName() + "】");
        response.setStatus(ERRRO_CODE.MODULE_CHANGED.getErrorCode());
        return (JSONObject) JSONObject.toJSON(moduleService.updateModule(module));
    }

    /**
     * 删除模块信息.
     */
    @RequestMapping(method = RequestMethod.DELETE, path = "{moduleId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject deleteModule(HttpServletRequest request, HttpServletResponse response, @RequestBody Module module) throws Exception {
        Long moduleId = module.getModuleId();
        // 不允许删除重要模块
        if (moduleService.isSystemModule(moduleId)) {
            response.setStatus(ERRRO_CODE.NO_AUTH.getErrorCode());
            return (JSONObject) JSONObject.toJSON("{id : " + moduleId + "}");
        }
        logService.addLog(request, MODULE_NAME, "删除模块: 【" + module.getModuleName() + "】");
        response.setStatus(ERRRO_CODE.MODULE_CHANGED.getErrorCode());
        return moduleService.deleteModule(moduleId);
    }

    /**
     * 获取模块信息部门Excel报表.
     */
    @RequestMapping(method = RequestMethod.POST, path = "excel")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public void getModuleListExcel(HttpServletRequest request, HttpServletResponse response, @RequestParam Integer limit, @RequestParam Integer start, @RequestParam String base64Sort, @RequestParam(required = false) String filter) throws Exception {
        ExportExcel.exportExcel(response, "模块信息报表", moduleService.getModuleList4Excel(start, limit, base64Sort, CommonUtil.base64Decode(filter)), Module.class);
        logService.addLog(request, MODULE_NAME, "导出: 【模块信息报表】");
    }

    /**
     * 检查 module 名是否重复.
     */
    @RequestMapping(method = RequestMethod.POST, path = "checkModule")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public Integer checkModule(@RequestParam String module) {
        return moduleService.checkModule(module);
    }

    /**
     * 获取模块目录列表.
     */
    @RequestMapping(method = RequestMethod.GET, path = "dirs")
    @AuthRequired(module = MODULE)
    public JSONObject getModuleDirList(@RequestParam String sort) throws Exception {
        return moduleService.getModuleDirList(sort);
    }

    /**
     * 验证用户是否可以打开tab页的接口.
     */
    @RequestMapping(method = RequestMethod.POST, path = "tabs")
    public JSONObject postTabs(HttpSession session, @RequestParam String moduleNames) throws Exception {
        JSONObject json = new JSONObject();
        if (StringUtils.isBlank(moduleNames)) {
            return json;
        }
        // 当前用户
        UserSession userSession = (UserSession) session.getAttribute(USER_SESSION);
        // 当前用户权限
        String auth = UserSessionListener.AUTH_MAP.get(userSession.getUserId());
        boolean isSuperAdmin = false;
        // 超级管理员
        if (StringUtils.isNotBlank(auth) && auth.equals(SUPER_AUTH)) {
            isSuperAdmin = true;
        }
        String[] modules = moduleNames.split(",");
        for (String module : modules) {
            Long moduleId = moduleService.getModuleId(module);
            // 模块不存在，直接跳过
            if (moduleId == null) {
                json.put(module, "");
                continue;
            }
            // 当前用户对当前模块的权限值
            Integer authValue = null;
            // 如果不是超级管理员
            if (isSuperAdmin) {
                authValue = USER_AUTH.WRITABLE.getAuth();
            } else {
                authValue = CommonUtil.findAuthValue(moduleId.toString(), auth, null);
            }
            if (authValue != null) {
                Module m = moduleService.getModule(moduleId);
                json.put(module, "grid?moduleName=".concat(CommonUtil.escape((CommonUtil.escape(m.getModuleName())))).concat("&module=").concat(module).concat("&viewType=").concat(m.getViewType().toString()).concat("&authValue=").concat(authValue.toString()).concat("&viewInfo=").concat(m.getViewInfo()));
            } else {
                json.put(module, "");
            }
        }
        return json;
    }

}
