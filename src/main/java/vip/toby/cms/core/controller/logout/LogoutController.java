package vip.toby.cms.core.controller.logout;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vip.toby.cms.core.model.user.UserSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static vip.toby.cms.core.util.FinalVariables.USER_SESSION;

/**
 * The Class LogoutController.
 */
@Controller
@RequestMapping("logout")
public class LogoutController {

    private final static Logger logger = LoggerFactory.getLogger(LogoutController.class);

    /**
     * 退出系统.
     *
     * @param request  the request
     * @param response the response
     */
    @RequestMapping(method = RequestMethod.GET)
    public String getLogout(HttpServletRequest request, HttpServletResponse response) {
        try {
            UserSession currentUser = ((UserSession) request.getSession().getAttribute(USER_SESSION));
            if (currentUser != null) {
                request.getSession().invalidate();
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return "redirect:" + request.getContextPath() + "/";
    }
}
