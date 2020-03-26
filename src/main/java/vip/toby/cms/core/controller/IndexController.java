package vip.toby.cms.core.controller;

import com.alibaba.fastjson.JSONArray;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.IModuleService;
import vip.toby.cms.core.util.FinalVariables;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

/**
 * The Class BootController.
 */
@Controller
@RequestMapping("")
public class IndexController {

    @Resource
    private IModuleService moduleService;

    /**
     * 登录渲染页面.
     */
    @RequestMapping(method = RequestMethod.GET)
    public String getIndex(ModelMap model, HttpSession session) {
        UserSession userSession = (UserSession) session.getAttribute(FinalVariables.USER_SESSION);
        if (userSession != null) {
            Long userId = userSession.getUserId();
            Integer status = UserSessionListener.STATUS_MAP.get(userId);
            if (status != null && (status == FinalVariables.USER_STATUS.UN_ACTIVE.getStatus() || status == FinalVariables.USER_STATUS.ACTIVE.getStatus()) && StringUtils.isNotBlank(UserSessionListener.AUTH_MAP.get(userId))) {
                model.put("isLogin", true);
                return "index";
            }
            // 当状态值异常,被锁定或者权限值异常时,退出当前系统
            UserSessionListener.STATUS_MAP.remove(userId);
            UserSessionListener.AUTH_MAP.remove(userId);
            session.invalidate();
        }
        return "index";
    }

    /**
     * 获取登录以后的模块树.
     */
    @RequestMapping(method = RequestMethod.GET, path = "index/module/{moduleId}")
    @ResponseBody
    public JSONArray getModule4TreeList(HttpSession session, @PathVariable Long moduleId, @RequestParam String sort) throws Exception {
        String authJson = UserSessionListener.AUTH_MAP.get(((UserSession) session.getAttribute(FinalVariables.USER_SESSION)).getUserId());
        if (authJson.equals(FinalVariables.SUPER_AUTH)) {
            return moduleService.getModule4TreeList(moduleId, sort.toString());
        }
        return moduleService.getModule4TreeList(moduleId, sort.toString(), authJson);
    }

}
