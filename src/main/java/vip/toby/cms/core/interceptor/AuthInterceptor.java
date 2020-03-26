package vip.toby.cms.core.interceptor;

import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.annotation.interceptor.LoginDeny;
import vip.toby.cms.core.dao.CommonDAO;
import vip.toby.cms.core.listener.UserSessionListener;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.FinalVariables.ERRRO_CODE;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static vip.toby.cms.core.util.FinalVariables.SUPER_AUTH;
import static vip.toby.cms.core.util.FinalVariables.USER_SESSION;

/**
 * 权限拦截器
 *
 * @author TKJ
 */
@Component
public class AuthInterceptor extends HandlerInterceptorAdapter {

    @Resource
    private CommonDAO commonDAO;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        HandlerMethod handlerMethod = ((HandlerMethod) handler);

        if (handlerMethod.hasMethodAnnotation(LoginDeny.class)) {
            return true;
        }

        AuthRequired authRequired = handlerMethod.getMethodAnnotation(AuthRequired.class);
        if (authRequired == null) {
            return true;
        }

        // 获取用户权限
        HttpSession session = request.getSession();
        UserSession user = (UserSession) session.getAttribute(USER_SESSION);
        String authJson = UserSessionListener.AUTH_MAP.get(user.getUserId());


        if (StringUtils.isNotBlank(authJson)) {
            if (authJson.equals(SUPER_AUTH)) {
                return true;
            }

            Integer authValue = null;
            for (String module : authRequired.module()) {
                Long moduleId = commonDAO.getModuleId(module);
                if (moduleId == null) {
                    throw new Exception("找不到模块【" + module + "】");
                }
                Integer value = CommonUtil.findAuthValue(moduleId.toString(), authJson, null);
                if (value != null) {
                    if (authValue == null) {
                        authValue = value;
                    } else {
                        authValue |= value;
                    }
                }
            }
            USER_AUTH auth = USER_AUTH.valueOf(authValue);
            USER_AUTH requireAuth = authRequired.value();
            // 非权限锁定
            if (!requireAuth.equals(USER_AUTH.FORBIDDEN)) {
                // 默认权限
                if (requireAuth.equals(USER_AUTH.DEFAULT)) {
                    requireAuth = getDefaultAuthValue(request);
                }
                // 可编辑权限 or 可读权限
                if ((requireAuth.equals(USER_AUTH.WRITABLE) && auth.equals(USER_AUTH.WRITABLE)) || (requireAuth.equals(USER_AUTH.READ_ONLY) && (auth.equals(USER_AUTH.READ_ONLY) || auth.equals(USER_AUTH.WRITABLE)))) {
                    return true;
                }
            }
        }
        response.setStatus(ERRRO_CODE.NO_AUTH.getErrorCode());
        return false;
    }

    private USER_AUTH getDefaultAuthValue(HttpServletRequest request) {
        String method = request.getMethod();
        if ("GET".equals(method.toUpperCase())) {
            return USER_AUTH.READ_ONLY;
        }
        return USER_AUTH.WRITABLE;
    }

}
