package vip.toby.cms.core.model.module;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.util.FinalVariables;
import org.apache.commons.lang3.StringUtils;

@Table(name = "t_module")
public class Module4Tree {

    @Id
    @Column(name = "module_id", unique = true, insertable = false, updatable = false)
    private Long moduleId;

    @Column(name = "parent_id", unique = false, insertable = true, updatable = true)
    private Long parentId;

    @Column(name = "module_name", unique = false, insertable = true, updatable = true)
    private String moduleName;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Integer indexNumber;

    @Column(name = "view_type", unique = false, insertable = true, updatable = true)
    private Integer viewType;

    @Column(name = "module", unique = true, insertable = true, updatable = true)
    private String module;

    @Column(name = "icon", unique = false, insertable = true, updatable = true)
    private String icon;

    @Column(name = "view_info", unique = false, insertable = true, updatable = true)
    private String viewInfo;

    private Integer authValue;

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

    public void setViewType(Integer viewType) {
        this.viewType = viewType;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getText() {
        return moduleName;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIcon() {
        // 是否有自定义图标
        if (StringUtils.isBlank(icon)) {
            // 是否只读
            return authValue != null && authValue == 0 ? "image/ext/tree/leaf-readonly.png" : "";
        }
        return icon;
    }

    public String getViewInfo() {
        return viewInfo;
    }

    public void setViewInfo(String viewInfo) {
        this.viewInfo = viewInfo;
    }

    public Integer getAuthValue() {
        return authValue;
    }

    public void setAuthValue(Integer authValue) {
        this.authValue = authValue;
    }

    public Boolean getLeaf() {
        return viewType != FinalVariables.MODULE_VIEWTYPE.SYS_DIR.getViewType() && viewType != FinalVariables.MODULE_VIEWTYPE.DIR.getViewType();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj != null && obj instanceof Module4Tree) {
            Module4Tree module = (Module4Tree) obj;
            if (module.getModuleId() == this.getModuleId()) {
                return true;
            }
        }
        return false;
    }

}
