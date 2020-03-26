package vip.toby.cms.core.model.department;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.dao.View;
import vip.toby.cms.core.annotation.excel.ExcelRequired;


@Table(name = "t_department")
@View(name = "v_department")
public class Department {

    public Department() {

    }

    public Department(Long deptId, String deptName, Integer indexNumber) {
        this.deptId = deptId;
        this.deptName = deptName;
        this.indexNumber = indexNumber;
    }

    @Id
    @ExcelRequired(title = "部门ID", width = 10)
    @Column(name = "dept_id", unique = true, insertable = false, updatable = false)
    private Long deptId;

    @Column(name = "dept_pid", unique = false, insertable = true, updatable = true)
    private Long deptPid;

    @ExcelRequired(title = "部门名称", width = 50)
    @Column(name = "dept_name", unique = false, insertable = true, updatable = true)
    private String deptName;

    @ExcelRequired(title = "上级部门", width = 50)
    @Column(name = "parent_name", unique = false, insertable = false, updatable = false)
    private String parentName;

    @Column(name = "remark", unique = false, insertable = true, updatable = true)
    private String remark;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Integer indexNumber;

    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public Long getDeptPid() {
        return deptPid;
    }

    public void setDeptPid(Long deptPid) {
        this.deptPid = deptPid;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Integer indexNumber) {
        this.indexNumber = indexNumber;
    }

}
