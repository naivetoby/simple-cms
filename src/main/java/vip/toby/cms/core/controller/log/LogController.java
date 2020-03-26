package vip.toby.cms.core.controller.log;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.model.log.Log;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;
import vip.toby.cms.core.util.ExportExcel;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;

/**
 * The Class LogController.
 */

@RestController
@RequestMapping("log")
public class LogController {

    @Resource
    private ILogService logService;

    private static final String MODULE = "Log";
    private static final String MODULE_NAME = "日志审计";

    /**
     * 获取日志列表.
     *
     * @param limit  the limit 每页显示数目
     * @param start  the start 分页起始值
     * @param sort   the sort 排序条件
     * @param filter the query condition 查询条件
     * @return the log list 日志数据集合
     * @throws NoSuchFieldException      the no such field exception
     * @throws SecurityException         the security exception
     * @throws InvocationTargetException the invocation target exception
     * @throws IntrospectionException    the introspection exception
     */
    @RequestMapping(method = RequestMethod.GET)
    @AuthRequired(module = MODULE)
    public JSONObject getLogList(@RequestParam Integer limit, @RequestParam Integer start, @RequestParam(required = false) String sort, @RequestParam(required = false) String filter) throws NoSuchFieldException, SecurityException, InvocationTargetException, IntrospectionException {
        return logService.getLogList(limit, start, sort, DataBaseUtil.filterAnalytic(filter).get("query"));
    }

    /**
     * 获取日志信息Excel报表.
     *
     * @param limit      the limit 分页偏移量
     * @param start      the start 分页起始值
     * @param base64Sort the sort condition 排序条件
     * @param filter     the query condition 查询条件
     * @param response   the response
     * @return the log list4 excel 文件流
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST, path = "excel")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public void getLogList4Excel(HttpServletResponse response, HttpServletRequest request, @RequestParam Integer limit, @RequestParam Integer start, @RequestParam String base64Sort, @RequestParam(required = false) String filter) throws Exception {
        ExportExcel.exportExcel(response, "日志信息报表", logService.getLogList4Excel(start, limit, filter, CommonUtil.base64Decode(base64Sort)), Log.class);
        logService.addLog(request, MODULE_NAME, "导出: 【日志信息报表】");
    }

}
