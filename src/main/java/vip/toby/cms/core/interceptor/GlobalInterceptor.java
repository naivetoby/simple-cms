package vip.toby.cms.core.interceptor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 全局变量拦截器
 *
 * @author TKJ
 */
@Component
public class GlobalInterceptor implements HandlerInterceptor {

    private static Map<String, Object> GLOBAL = new ConcurrentHashMap<>();

    @Value("${isDevelopment:false}")
    private String isDevelopment;
    @Value("${saveLabel:false}")
    private String saveLabel;
    @Value("${tipTime:7}")
    private int tipTime;

    @Override
    public boolean preHandle(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull Object handler) throws Exception {
        if (!GLOBAL.containsKey("basePath")) {
            GLOBAL.put("basePath", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/");
        }
        if (!GLOBAL.containsKey("isDevelopment")) {
            GLOBAL.put("isDevelopment", isDevelopment);
        }
        if (!GLOBAL.containsKey("saveLabel")) {
            GLOBAL.put("saveLabel", saveLabel);
        }
        if (!GLOBAL.containsKey("tipTime")) {
            GLOBAL.put("tipTime", tipTime);
        }
        request.setAttribute("global", GLOBAL);
        return true;
    }

}
