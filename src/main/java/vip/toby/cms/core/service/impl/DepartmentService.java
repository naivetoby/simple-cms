package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;
import vip.toby.cms.core.model.department.Department;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.IDepartmentService;
import vip.toby.cms.core.util.CommonUtil;

import javax.annotation.Resource;
import java.util.List;

@Service
public class DepartmentService implements IDepartmentService {

    @Resource
    private IDataBaseService coreDataBaseService;

    @Override
    public JSONObject getDeptList(Integer limit, Integer start, String queryCondition, String sortCondition) throws Exception {
        JSONObject json = new JSONObject();
        json.put("total", coreDataBaseService.getTotal(Department.class, queryCondition));
        json.put("rows", JSON.toJSON(coreDataBaseService.list(start, limit, queryCondition, sortCondition, Department.class)));
        return json;
    }

    @Override
    public List<Department> getDeptList4Excel(Integer limit, Integer start, String queryCondition, String sortCondition) throws Exception {
        return coreDataBaseService.list(start, limit, queryCondition, sortCondition, Department.class);
    }

    @Override
    public JSONObject getDeptList4Dept(Long deptId, String sortCondition) throws Exception {
        JSONObject json = new JSONObject();
        json.put("rows", JSON.toJSON(CommonUtil.getRemovedChildDeptList(coreDataBaseService.list(null, sortCondition, Department.class), deptId)));
        return json;
    }

    @Override
    public JSONObject getDeptList4Other(String sortCondition) throws Exception {
        JSONObject json = new JSONObject();
        json.put("rows", JSON.toJSON(coreDataBaseService.list(null, sortCondition, Department.class)));
        return json;
    }

    @Override
    public Department getDept(Long deptId) throws Exception {
        return coreDataBaseService.getEntity(deptId, Department.class);
    }

    @Override
    public JSONObject addDept(Department department) throws Exception {
        return JSONObject.parseObject("{id : " + coreDataBaseService.add(department, Department.class) + "}");
    }

    @Override
    public Department updateDept(Department department) throws Exception {
        return coreDataBaseService.save(department, Department.class);
    }

    @Override
    public JSONObject deleteDept(Long deptId) throws Exception {
        return JSONObject.parseObject("{id : " + coreDataBaseService.delete(deptId, Department.class) + "}");
    }

}
