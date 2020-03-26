package vip.toby.cms.core.model.module;


import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;

@Table(name = "t_module")
public class ModuleDir {

    @Id
    @Column(name = "module_id")
    private Long moduleId;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "view_type")
    private Integer viewType;

    @Column(name = "index_number")
    private Integer indexNumber;

    public ModuleDir() {

    }

    public ModuleDir(Long moduleId, String moduleName, int viewType, int indexNumber) {
        this.moduleId = moduleId;
        this.moduleName = moduleName;
        this.viewType = viewType;
        this.indexNumber = indexNumber;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Integer getViewType() {
        return viewType;
    }

    public void setViewType(Integer viewType) {
        this.viewType = viewType;
    }

    public Integer getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Integer indexNumber) {
        this.indexNumber = indexNumber;
    }

}
