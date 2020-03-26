package vip.toby.cms.core.model.role;


import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.excel.ExcelRequired;
import vip.toby.cms.core.util.CommonUtil;

import java.util.List;

@Table(name = "t_role")
public class Role {

    @Id
    @ExcelRequired(title = "角色ID", width = 10)
    @Column(name = "role_id", unique = true, insertable = false, updatable = false)
    private Long roleId;

    @ExcelRequired(title = "角色名", width = 30)
    @Column(name = "role_name", unique = false, insertable = true, updatable = true)
    private String roleName;

    @ExcelRequired(title = "角色描述", width = 30)
    @Column(name = "role_description", unique = false, insertable = true, updatable = true)
    private String roleDescription;

    @Column(name = "auth_info", unique = false, insertable = false, updatable = true)
    private String authInfo;

    @Column(name = "role_type", unique = false, insertable = true, updatable = false)
    private Integer roleType;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Integer indexNumber;

    private List<Long> userIds;

    public List<Long> getUsers() {
        return userIds;
    }

    public String getUsers4Render() {
        return CommonUtil.listToString(userIds);
    }

    public void setUsers(List<Long> users) {
        this.userIds = users;
    }

    public Integer getRoleType() {
        return roleType;
    }

    public void setRoleType(Integer roleType) {
        this.roleType = roleType;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public String getAuthInfo() {
        return authInfo;
    }

    public void setAuthInfo(String authInfo) {
        this.authInfo = authInfo;
    }

    public Integer getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Integer indexNumber) {
        this.indexNumber = indexNumber;
    }
}
