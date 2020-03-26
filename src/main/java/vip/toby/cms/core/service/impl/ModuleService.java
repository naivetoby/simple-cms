package vip.toby.cms.core.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import vip.toby.cms.core.dao.CommonDAO;
import vip.toby.cms.core.model.module.Module;
import vip.toby.cms.core.model.module.Module4Tree;
import vip.toby.cms.core.model.module.ModuleDir;
import vip.toby.cms.core.model.role.RoleModule4Tree;
import vip.toby.cms.core.service.IDataBaseService;
import vip.toby.cms.core.service.IModuleService;
import vip.toby.cms.core.util.CommonUtil;
import vip.toby.cms.core.util.FinalVariables;

import javax.annotation.Resource;
import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.Iterator;
import java.util.List;

@Service
public class ModuleService implements IModuleService {

    @Resource
    private IDataBaseService coreDataBaseService;
    @Resource
    private CommonDAO commonDAO;

    @Override
    public JSONObject getModuleList(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception {
        JSONObject responseObj = new JSONObject();
        if (StringUtils.isBlank(queryCondition)) {
            queryCondition = "module_id > 0";
        } else {
            queryCondition += " AND module_id > 0";
        }
        responseObj.put("total", coreDataBaseService.getTotal(Module.class, queryCondition));
        responseObj.put("rows", JSON.toJSON(coreDataBaseService.list(start, limit, queryCondition, sortCondition, Module.class)));
        return responseObj;
    }

    @Override
    public Module getModule(Long moduleId) throws Exception {
        return coreDataBaseService.getEntity(moduleId, Module.class);
    }

    @Override
    public JSONObject addModule(Module module) throws Exception {
        return JSON.parseObject("{id : " + coreDataBaseService.add(module, Module.class) + "}");
    }

    @Override
    public Module updateModule(Module module) throws Exception {
        return coreDataBaseService.save(module, Module.class);
    }

    @Override
    public JSONObject deleteModule(Long moduleId) throws Exception {
        return JSON.parseObject("{id : " + coreDataBaseService.delete(moduleId, Module.class) + "}");
    }

    @Override
    public JSONArray getModule4TreeList(Long modulePid, Long roleId, String sortCondition) throws Exception {
        String authJson = commonDAO.getRoleAuth(roleId);
        if (StringUtils.isBlank(authJson)) {
            return null;
        }
        JSONObject children = CommonUtil.findLeafChildren(JSON.parseObject(CommonUtil.base64Decode(authJson)), modulePid.toString());
        List<RoleModule4Tree> modules = coreDataBaseService.list("parent_id = " + modulePid + " AND module_id > 9", sortCondition, RoleModule4Tree.class);
        if (children != null) {
            Iterator<RoleModule4Tree> iter1 = modules.iterator();
            while (iter1.hasNext()) {
                RoleModule4Tree module = iter1.next();
                Object[] keys = children.keySet().toArray();
                for (int i = 0; i < keys.length; i++) {
                    String key = (String) keys[i];
                    if (module.getLeaf() && module.getModuleId().toString().equals(key)) {
                        module.setChecked(true);
                        module.setAuthValue(children.getIntValue(key));
                        children.remove(key);
                    }
                }
            }
        }
        return (JSONArray) JSON.toJSON(modules);
    }

    @Override
    public JSONArray getModule4TreeList(Long modulePid, String sortCondition, String authJson) throws Exception {
        JSONObject children = CommonUtil.findLeafChildren(JSON.parseObject(authJson), modulePid.toString());
        List<Module4Tree> modules = coreDataBaseService.list("parent_id = " + modulePid, sortCondition, Module4Tree.class);
        if (children != null) {
            Iterator<Module4Tree> iter1 = modules.iterator();
            while (iter1.hasNext()) {
                Module4Tree module = iter1.next();
                String hasKey = null;
                Object[] keys = children.keySet().toArray();
                for (int i = 0; i < keys.length; i++) {
                    String key = (String) keys[i];
                    if (module.getModuleId().toString().equals(key)) {
                        hasKey = key;
                        break;
                    }
                }
                if (StringUtils.isNotBlank(hasKey)) {
                    if (module.getLeaf()) {
                        module.setAuthValue(children.getIntValue(hasKey));
                    }
                    children.remove(hasKey);
                } else {
                    iter1.remove();
                }
            }
        }
        return (JSONArray) JSON.toJSON(modules);
    }

    @Override
    public JSONArray getModule4TreeList(Long modulePid, String sortCondition) throws Exception {
        List<Module4Tree> module4Trees = coreDataBaseService.list("parent_id = " + modulePid, sortCondition, Module4Tree.class);
        for (Module4Tree module4Tree : module4Trees) {
            module4Tree.setAuthValue(1);
        }
        return (JSONArray) JSON.toJSON(module4Trees);
    }

    @Override
    public Long getModuleId(String module) {
        return commonDAO.getModuleId(module);
    }

    @Override
    public List<Module> getModuleList4Excel(Integer start, Integer limit, String queryCondition, String sortCondition) throws Exception {
        return coreDataBaseService.list(start, limit, queryCondition, sortCondition, Module.class);
    }

    public Boolean isSystemModule(Long moduleId) {
        Long viewType = commonDAO.getModuleViewType(moduleId);
        return viewType == FinalVariables.MODULE_VIEWTYPE.SYS_DIR.getViewType() || viewType == FinalVariables.MODULE_VIEWTYPE.SYS_GRID.getViewType() || viewType == FinalVariables.MODULE_VIEWTYPE.SYS_DEFAULT.getViewType();
    }

    @Override
    public Module updateModuleIndexNumber(Module module) throws InvocationTargetException, NoSuchFieldException, SecurityException, IntrospectionException {
        commonDAO.updateModuleIndexNumber(module.getModuleId(), module.getIndexNumber());
        return coreDataBaseService.getEntity(module.getModuleId(), Module.class);
    }

    @Override
    public Integer checkModule(String module) {
        return commonDAO.checkModule(module);
    }

    @Override
    public JSONObject getModuleDirList(String sortCondition) throws Exception {
        // 查询模块目录
        String qureyCondition = "view_type = 1 OR view_type = -1";
        // 总数
        int total = coreDataBaseService.getTotal(ModuleDir.class, qureyCondition);
        // 查询结果
        List<ModuleDir> moduleDirs = coreDataBaseService.list(0, total, qureyCondition, sortCondition, ModuleDir.class);
        moduleDirs.add(0, new ModuleDir(0l, "项目", FinalVariables.MODULE_VIEWTYPE.SYS_DIR.getViewType(), 0));
        // 返回结果
        JSONObject responseObj = new JSONObject();
        responseObj.put("total", total);
        responseObj.put("rows", JSON.toJSON(moduleDirs));
        return responseObj;
    }

}
