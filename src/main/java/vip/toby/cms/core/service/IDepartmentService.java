package vip.toby.cms.core.service;

import com.alibaba.fastjson.JSONObject;
import vip.toby.cms.core.model.department.Department;

import java.util.List;

/**
 * The Interface IDepartmentService.
 */
public interface IDepartmentService {

    /**
     * Gets the dept list.
     *
     * @param limit          the limit
     * @param start          the start
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the dept list
     * @throws Exception the exception
     */
    JSONObject getDeptList(Integer limit, Integer start, String queryCondition, String sortCondition) throws Exception;

    /**
     * Gets the dept list4 excel.
     *
     * @param limit          the limit
     * @param start          the start
     * @param queryCondition the query condition
     * @param sortCondition  the sort condition
     * @return the dept list4 excel
     * @throws Exception the exception
     */
    List<Department> getDeptList4Excel(Integer limit, Integer start, String queryCondition, String sortCondition) throws Exception;

    /**
     * Gets the dept list4 dept.
     *
     * @param deptId        the dept id
     * @param sortCondition the sort condition
     * @return the dept list4 dept
     * @throws Exception the exception
     */
    JSONObject getDeptList4Dept(Long deptId, String sortCondition) throws Exception;

    /**
     * Gets the dept list4 other.
     *
     * @param queryCondition the query condition
     * @return the dept list4 other
     * @throws Exception the exception
     */
    JSONObject getDeptList4Other(String queryCondition) throws Exception;

    /**
     * Gets the dept.
     *
     * @param deptId the dept id
     * @return the dept
     * @throws Exception the exception
     */
    Department getDept(Long deptId) throws Exception;

    /**
     * 添加 dept.
     *
     * @param dept the dept
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject addDept(Department dept) throws Exception;

    /**
     * Update dept.
     *
     * @param dept the dept
     * @return the department
     * @throws Exception the exception
     */
    Department updateDept(Department dept) throws Exception;

    /**
     * Delete dept.
     *
     * @param deptId the dept id
     * @return the JSON object
     * @throws Exception the exception
     */
    JSONObject deleteDept(Long deptId) throws Exception;

}
