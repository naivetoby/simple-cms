package vip.toby.cms.core.controller.department;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.annotation.interceptor.AuthRequired;
import vip.toby.cms.core.model.department.Department;
import vip.toby.cms.core.service.IDepartmentService;
import vip.toby.cms.core.service.ILogService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.DataBaseUtil;
import vip.toby.cms.core.util.ExportExcel;
import vip.toby.cms.core.util.FinalVariables.USER_AUTH;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * The Class DepartmentController.
 */
@RestController
@RequestMapping("department")
public class DepartmentController {

    @Resource
    private IDepartmentService deptService;
    @Resource
    private ILogService logService;

    private static final String MODULE = "Department";
    private static final String MODULE_NAME = "部门管理";

    /**
     * 获取部门列表.
     *
     * @param limit  the limit 分页偏移量
     * @param start  the start 分页起始值
     * @param sort   the sort condition 排序条件
     * @param filter the query condition 查询条件
     * @return the dept list 部门数据集合
     * @throws Exception the exception
     */

    @RequestMapping(method = RequestMethod.GET)
    @AuthRequired(module = MODULE)
    public JSONObject getDeptList(@RequestParam Integer limit, @RequestParam Integer start, @RequestParam(required = false) String sort, @RequestParam(required = false) String filter) throws Exception {
        return deptService.getDeptList(limit, start, DataBaseUtil.filterAnalytic(filter).get("query"), sort);
    }

    /**
     * 获取某一部门.
     *
     * @param deptId the dept id 部门ID
     * @return the dept 部门信息JSON对象
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET, params = "{deptId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject getDept(@RequestParam Long deptId) throws Exception {
        return (JSONObject) JSON.toJSON(deptService.getDept(deptId));
    }

    /**
     * 添加部门信息.
     *
     * @param dept the dept 部门信息
     * @return the JSON object
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST)
    @AuthRequired(module = MODULE)
    public JSONObject addDept(HttpServletRequest request, @RequestBody Department dept) throws Exception {
        logService.addLog(request, MODULE_NAME, "新增部门: 【" + dept.getDeptName() + "】");
        return deptService.addDept(dept);
    }

    /**
     * 编辑部门信息.
     *
     * @param dept the dept 部门信息
     * @return the JSON object
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.PUT, path = "{deptId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public Object updateDept(HttpServletRequest request, @RequestBody Department dept) throws Exception {
        logService.addLog(request, MODULE_NAME, "编辑部门: 【" + dept.getDeptName() + "】");
        return JSON.toJSON(deptService.updateDept(dept));
    }

    /**
     * 删除部门信息.
     *
     * @param dept the dept 部门信息
     * @return the JSON object
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.DELETE, path = "{deptId:[0-9]+}")
    @AuthRequired(module = MODULE)
    public JSONObject deleteDept(HttpServletRequest request, @RequestBody Department dept) throws Exception {
        logService.addLog(request, MODULE_NAME, "删除部门: 【" + dept.getDeptName() + "】");
        return deptService.deleteDept(dept.getDeptId());
    }

    /**
     * 获取部门信息Excel报表.
     *
     * @param limit      the limit 分页偏移量
     * @param start      the start 分页起始值
     * @param base64Sort the sort condition 排序条件
     * @param filter     the query condition 查询条件
     * @param response   the response
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.POST, path = "excel")
    @AuthRequired(module = MODULE, value = USER_AUTH.READ_ONLY)
    public void getDeptListExcel(HttpServletResponse response, HttpServletRequest request, @RequestParam Integer limit, @RequestParam Integer start, @RequestParam String base64Sort, @RequestParam(required = false) String filter) throws Exception {
        ExportExcel.exportExcel(response, "部门信息报表", deptService.getDeptList4Excel(limit, start, filter, CommonUtil.base64Decode(base64Sort)), Department.class);
        logService.addLog(request, MODULE_NAME, "导出: 【部门信息报表】");
    }

    /**
     * 获取某一部门的上级部门列表.
     *
     * @param deptId the dept id 部门ID
     * @param sort   the sort condition 查询条件
     * @return the dept list 上级部门列表
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET, path = "dept_combo")
    @AuthRequired(module = MODULE)
    public JSONObject getDeptList4Dept(@RequestParam("deptId") Long deptId, @RequestParam String sort) throws Exception {
        return deptService.getDeptList4Dept(deptId, sort);
    }

    /**
     * 获取用户所属部门列表.
     *
     * @param sort the sort condition 排序条件
     * @return 所属部门列表
     * @throws Exception the exception
     */
    @RequestMapping(method = RequestMethod.GET, path = "user_combo")
    @AuthRequired(module = MODULE)
    public JSONObject getDeptList4User(@RequestParam String sort) throws Exception {
        return deptService.getDeptList4Other(sort);
    }

}
