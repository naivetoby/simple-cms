package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.log.Log;
import vip.toby.cms.core.model.user.UserSession;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.util.FinalVariables;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

@Service
public class LogService implements ILogService {

    @Resource
    private IDataBaseService coreDataBaseService;

    @Override
    public Object addLog(String clientIp, String loginName, String userName, String moduleName, String action) throws NoSuchFieldException, SecurityException, InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException, IntrospectionException {
        if (StringUtils.isBlank(clientIp)) {
            clientIp = "未知IP";
        }
        if (StringUtils.isBlank(loginName)) {
            loginName = "未知登录名";
        }
        if (StringUtils.isBlank(userName)) {
            userName = "未知用户";
        }
        if (StringUtils.isBlank(action)) {
            action = "未知操作";
        }
        Log log = new Log();
        log.setAction(action.replaceAll("'", "''").replaceAll(":", "\\:\\:"));
        log.setUserName(userName);
        log.setClientIp(clientIp);
        log.setLoginName(loginName);
        log.setModuleName(moduleName);
        return JSON.toJSON("{id : " + coreDataBaseService.add(log, Log.class) + "}");
    }

    @Override
    public Object addLog(HttpServletRequest request, String moduleName, String action) throws NoSuchFieldException, SecurityException, InvocationTargetException, InstantiationException, IllegalAccessException, NoSuchMethodException, IntrospectionException {
        UserSession userSession = (UserSession) request.getSession().getAttribute(FinalVariables.USER_SESSION);
        return addLog(userSession.getClientIp(), userSession.getLoginName(), userSession.getUserName(), moduleName, action);
    }

    @Override
    public JSONObject getLogList(Integer limit, Integer start, String sort, String queryCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
        JSONObject json = new JSONObject();

        json.put("total", coreDataBaseService.getTotal(Log.class, queryCondition));
        json.put("rows", JSON.toJSON(coreDataBaseService.list(start, limit, queryCondition, sort, Log.class)));
        return json;
    }

    @Override
    public List<Log> getLogList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
        return coreDataBaseService.list(start, limit, queryCondition, sortCondition, Log.class);
    }

}
