package vip.toby.cms.core.controller.login;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.user.UserBase;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.IRoleUserService;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.CommonUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static vip.toby.cms.core.util.FinalVariables.*;

/**
 * The Class LoginController.
 */
@Controller
@RequestMapping("login")
public class LoginController {

    private static final Map<String, Map<String, Object>> errorMap = new ConcurrentHashMap<>();

    @Resource
    private IUserService userService;
    @Resource
    private ILogService logService;
    @Resource
    private IRoleUserService roleUserService;

    @RequestMapping
    public String login() {
        return "login";
    }

    @Value("${requireAdmin:0}")
    private boolean requireAdmin;

    @Value("${superUserName}")
    private String superUserName;

    @Value("${superUserPwd}")
    private String superUserPwd;

    @Value("${errorLoginCount:3}")
    private int errorLoginCount;

    @Value("${lockTime:3}")
    private int lockTime;

    //记录被锁住的账号解锁时间
    private Map<String, Long> lockMap = new ConcurrentHashMap<>();

    /**
     * 登录系统.
     *
     * @param request       the request
     * @param response      the response
     * @param loginName     the login name 用户名
     * @param loginPassword the login password 密码
     * @return the object
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public Object postLogin(HttpServletRequest request, HttpServletResponse response, @RequestParam String loginName, @RequestParam String loginPassword) throws Exception {
        JSONObject json = new JSONObject();
        HttpSession session = request.getSession();
        String clientIp = getClientIp(request);
        if (StringUtils.isBlank(loginName)) {
            json.put("error", "对不起，账号不能为空");
            return json;
        }
        if (StringUtils.isBlank(loginPassword)) {
            json.put("error", "对不起，密码不能为空");
            return json;
        }

        if (lockMap.containsKey(loginName) && System.currentTimeMillis() < lockMap.get(loginName)) {
            json.put("error", "登录失败次数过多，此账号已被锁定" + lockTime + "分钟");
            return json;
        } else if (lockMap.containsKey(loginName)) {
            lockMap.remove(loginName);
        }

        try {
            UserSession userSession = null;
            if (requireAdmin && loginName.equals(superUserName)) {
                if (loginPassword.equals(superUserPwd)) {
                    userSession = new UserSession();
                    userSession.setUserId(-1l);
                    userSession.setLoginName(loginName);
                    userSession.setUserName("超级管理员");
                    userSession.setClientIp(clientIp);
                    userSession.setIsImportantRole(true);
                    userSession.setPhones("");
                    UserSessionListener.AUTH_MAP.put(userSession.getUserId(), SUPER_AUTH);
                    UserSessionListener.STATUS_MAP.put(userSession.getUserId(), 1);
                    UserSessionListener.SESSION_MAP.put(userSession.getUserId(), session.getId());
                } else {
                    // 密码错误
                    json.put("error", errorMapHandle(loginName, clientIp, "超级管理员"));
                    return json;
                }
            } else {
                UserBase userBase = userService.getUserBaseInfo(loginName);
                if (userBase == null) {
                    logService.addLog(clientIp, loginName, null, "登录", "登录系统失败-账号不存在");
                    json.put("error", "对不起，账号或者密码错误");
                    return json;
                }
                userSession = new UserSession();
                userSession.setUserId(userBase.getUserId());
                userSession.setLoginName(loginName);
                userSession.setUserName(userBase.getUserName());
                userSession.setClientIp(clientIp);
                if (!userBase.getLoginPassword().equals(CommonUtil.sha512(loginPassword.concat(userBase.getSalt())))) {
                    json.put("error", errorMapHandle(loginName, clientIp, userBase.getUserName()));
                    return json;
                }
                // status==2时，用户被锁定
                if (userBase.getStatus() == 2) {
                    logService.addLog(clientIp, loginName, userBase.getUserName(), "登录", "登录系统失败-账号被管理员永久锁定");
                    json.put("error", "对不起，此账号已被管理员永久锁定");
                    return json;
                }
                Long userId = userSession.getUserId();
                // 设置权限
                UserSessionListener.STATUS_MAP.put(userId, userBase.getStatus());
                UserSessionListener.AUTH_MAP.put(userId, userService.getUserAuth(userId));
                UserSessionListener.SESSION_MAP.put(userId, session.getId());
                userSession.setDeptId(userBase.getDeptId());
                userSession.setDeptName(userBase.getDeptName());
                userSession.setStatus(userBase.getStatus());
                userSession.setPhones(userBase.getPhones());
                userSession.setIsImportantRole(roleUserService.hasImportantRole(userId));
            }
            // 缓存当前用户信息
            session.setAttribute(USER_SESSION, userSession);
            session.setAttribute(USER_SESSION_JSON, JSON.toJSONString(userSession));
            session.setAttribute(USER_SESSION_BASE64, CommonUtil.base64Encode(JSON.toJSONString(userSession)));
            logService.addLog(clientIp, loginName, userSession.getUserName(), "登录", "登录系统成功");
            errorMap.remove(loginName);
            json.put("success", "恭喜您，登录成功");
        } catch (Exception e) {
            e.printStackTrace();
            json.put("error", "对不起，服务器异常");
        }
        return json;
    }

    private String errorMapHandle(String loginName, String clientIp, String userName) {
        try {
            Map<String, Object> userMap = errorMap.get(loginName);
            // 没有登录错误过或者没有错误到指定次数
            if (userMap == null || (int) userMap.get("count") < errorLoginCount - 1) {
                if (userMap == null) {
                    userMap = new HashMap<>();
                    userMap.put("count", 1);
                } else {
                    userMap.put("count", (int) userMap.get("count") + 1);
                }
                errorMap.put(loginName, userMap);
                logService.addLog(clientIp, loginName, userName, "登录", "登录系统失败-密码错误");
                return "对不起，账号或者密码错误";
            }

            // 账号被锁定
            long currentTime = System.currentTimeMillis();
            errorMap.remove(loginName);
            userMap.put("loginName", loginName);
            userMap.put("userName", userName);
            userMap.put("clientIp", clientIp);

            // 设定定时器
            long unlockTime = currentTime + lockTime * 60 * 1000;
            lockMap.put(loginName, unlockTime);
            // 记录日志
            logService.addLog(clientIp, loginName, userName, "登录", "连续登录失败" + errorLoginCount + "次，账号被锁定" + lockTime + "分钟");
            return "登录失败次数过多，此账号已被锁定" + lockTime + "分钟";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "对不起，服务器异常";
    }


    private Date getDate(String time) {
        if (time != null && StringUtils.isNumeric(time)) {
            Calendar cal = Calendar.getInstance();
            cal.setTimeInMillis(Long.parseLong(time));
            return cal.getTime();
        }
        return null;
    }

    // 兼容nginx的ip获取
    private String getClientIp(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Real-IP");
        if (StringUtils.isBlank(clientIp) || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
            if (StringUtils.isBlank(clientIp)) {
                clientIp = "未知IP";
            }
            // 解决某些机器获取IP异常的bug
            if ("0:0:0:0:0:0:0:1".equals(clientIp)) {
                clientIp = "127.0.0.1";
            }
        }
        return clientIp;
    }

}
