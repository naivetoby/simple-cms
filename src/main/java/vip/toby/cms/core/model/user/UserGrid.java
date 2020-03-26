package vip.toby.cms.core.model.user;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.dao.View;
import vip.toby.cms.core.annotation.excel.ExcelRequired;
import vip.toby.cms.core.util.FinalVariables.USER_STATUS;

@Table(name = "t_user")
@View(name = "v_user_grid")
public class UserGrid {

    @Id
    @ExcelRequired(title = "用户ID", width = 10)
    @Column(name = "user_id", unique = true, nullable = false, insertable = false, updatable = false)
    private Long userId;

    @ExcelRequired(title = "用户名", width = 30)
    @Column(name = "user_name", unique = false, nullable = false, insertable = true, updatable = true)
    private String userName;

    @ExcelRequired(title = "登录名", width = 30)
    @Column(name = "login_name", unique = false, nullable = false, insertable = true, updatable = true)
    private String loginName;

    @ExcelRequired(title = "用户状态", width = 30)
    @Column(name = "status", unique = false, nullable = false, insertable = false, updatable = false)
    private Integer status;

    @Column(name = "dept_id", unique = false, nullable = false, insertable = true, updatable = true)
    private Long deptId;

    @ExcelRequired(title = "所属部门", width = 30)
    @Column(name = "dept_name", unique = false, nullable = false, insertable = false, updatable = false)
    private String deptName;

    @ExcelRequired(title = "手机号", width = 30)
    @Column(name = "phones", unique = false, nullable = false, insertable = true, updatable = true)
    private String phones;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Long indexNumber;

    @ExcelRequired(title = "所属角色", width = 80)
    private String roles;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public Integer getStatus() {
        return status;
    }

    public String getStatus4Render() {
        return USER_STATUS.valueOf(status).getStatusName();
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public Long getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Long indexNumber) {
        this.indexNumber = indexNumber;
    }

    public String getPhones() {
        return phones;
    }

    public void setPhones(String phones) {
        this.phones = phones;
    }
}
