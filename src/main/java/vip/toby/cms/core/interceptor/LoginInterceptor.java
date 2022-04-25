package vip.toby.cms.core.interceptor;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.IUserService;
import vip.toby.cms.core.util.FinalVariables.ERRRO_CODE;
import vip.toby.cms.core.util.FinalVariables.USER_STATUS;

import javax.annotation.Nonnull;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static vip.toby.cms.core.listener.UserSessionListener.*;
import static vip.toby.cms.core.util.FinalVariables.USER_SESSION;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Resource
    private IUserService userService;

    @Override
    public boolean preHandle(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull Object handler) throws Exception {
        HttpSession session = request.getSession();
        UserSession userSession = (UserSession) session.getAttribute(USER_SESSION);
        if (userSession == null) {
            response.setStatus(ERRRO_CODE.NO_SESSION.getErrorCode());
            return false;
        }
        Long userId = userSession.getUserId();
        // 验证此用户是否重复登录, 如果已被重新登录, 退出当前系统
        if (!session.getId().equals(SESSION_MAP.get(userId))) {
            session.invalidate();
            response.setStatus(ERRRO_CODE.NO_SESSION.getErrorCode());
            return false;
        }
        Integer status = STATUS_MAP.get(userId);
        // 当状态值异常或者是被锁定时,退出当前系统
        if (status == null || status == USER_STATUS.LOCKED.getStatus() || (status != USER_STATUS.UN_ACTIVE.getStatus() && status != USER_STATUS.ACTIVE.getStatus())) {
            session.invalidate();
            response.setStatus(ERRRO_CODE.NO_SESSION.getErrorCode());
            return false;
        }
        String authJson = AUTH_MAP.get(userId);
        // 验证权限值是否为空, 如果为空说明权限值已被修改, 需要刷新页面
        if (StringUtils.isBlank(authJson)) {
            AUTH_MAP.put(userId, userService.getUserAuth(userId));
            response.setStatus(ERRRO_CODE.AUTH_CHANGED.getErrorCode());
            return false;
        }
        return true;
    }

}
