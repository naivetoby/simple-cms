package vip.toby.cms.core.model.module;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.dao.View;
import vip.toby.cms.core.annotation.excel.ExcelRequired;
import vip.toby.cms.core.util.FinalVariables;

@Table(name = "t_module")
@View(name = "v_module")
public class Module {

    @Id
    @ExcelRequired(title = "模块ID", width = 10)
    @Column(name = "module_id", unique = true, insertable = false, updatable = false)
    private Long moduleId;

    @Column(name = "parent_id", unique = false, insertable = true, updatable = true)
    private Long parentId;

    @ExcelRequired(title = "模块名称", width = 30)
    @Column(name = "module_name", unique = false, insertable = true, updatable = true)
    private String moduleName;

    @ExcelRequired(title = "上级模块", width = 30)
    @Column(name = "parent_name", unique = false, insertable = false, updatable = false)
    private String parentName;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Integer indexNumber;

    @ExcelRequired(title = "模块类型", width = 30)
    @Column(name = "view_type", unique = false, insertable = true, updatable = true)
    private Integer viewType;

    @ExcelRequired(title = "Module", width = 30)
    @Column(name = "module", unique = true, insertable = true, updatable = true)
    private String module;

    @Column(name = "icon", unique = false, insertable = true, updatable = true)
    private String icon;

    @Column(name = "view_info", unique = false, insertable = true, updatable = true)
    private String viewInfo;

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Integer getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Integer indexNumber) {
        this.indexNumber = indexNumber;
    }

    public Integer getViewType() {
        return viewType;
    }

    public String getViewType4Render() {
        return FinalVariables.MODULE_VIEWTYPE.valueOf(viewType).getViewTypeName();
    }

    public void setViewType(Integer viewType) {
        this.viewType = viewType;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getViewInfo() {
        return viewInfo;
    }

    public void setViewInfo(String viewInfo) {
        this.viewInfo = viewInfo;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
