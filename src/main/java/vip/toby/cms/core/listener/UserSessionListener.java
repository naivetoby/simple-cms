package vip.toby.cms.core.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.service.impl.LogService;
import vip.toby.cms.core.util.FinalVariables;
import vip.toby.cms.core.util.SpringContextUtil;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserSessionListener implements HttpSessionListener {

    private final static Logger logger = LoggerFactory.getLogger(UserSessionListener.class);

    /**
     * The auth map.
     */
    public static Map<Long, String> AUTH_MAP = new ConcurrentHashMap<>();

    /**
     * The status map.
     */
    public static Map<Long, Integer> STATUS_MAP = new ConcurrentHashMap<>();

    /**
     * The session map.
     */
    public static Map<Long, String> SESSION_MAP = new ConcurrentHashMap<>();

    @Override
    public void sessionCreated(HttpSessionEvent event) {

    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        HttpSession session = event.getSession();
        UserSession user = (UserSession) session.getAttribute(FinalVariables.USER_SESSION);
        if (user != null) {
            Long userId = user.getUserId();
            String loginName = user.getLoginName();
            String userName = user.getUserName();
            String clientIp = user.getClientIp();
            // SESSION_ID与当前用户的一致
            if (session.getId().equals(SESSION_MAP.get(userId))) {
                AUTH_MAP.remove(userId);
                STATUS_MAP.remove(userId);
                SESSION_MAP.remove(userId);
                try {
                    ILogService logService = (LogService) SpringContextUtil.getBean("logService");
                    logService.addLog(clientIp, loginName, userName, "注销", "退出系统");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                logger.debug("用户:【" + userName + "】 会话已过期, 需要重新登录");
            } else {
                logger.debug("用户:【" + userName + "】 已经再次重新登录, 此会话过期");
            }
        }
    }

}
