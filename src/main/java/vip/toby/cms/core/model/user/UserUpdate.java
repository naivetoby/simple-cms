package vip.toby.cms.core.model.user;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;

@Table(name = "t_user")
public class UserUpdate {

    @Id
    @Column(name = "user_id", unique = true, nullable = false, insertable = false, updatable = false)
    private Long userId;

    @Column(name = "user_name", unique = false, nullable = false, insertable = true, updatable = true)
    private String userName;

    @Column(name = "login_name", unique = false, nullable = false, insertable = true, updatable = true)
    private String loginName;

    @Column(name = "phones", unique = false, nullable = false, insertable = true, updatable = true)
    private String phones;

    @Column(name = "dept_id", unique = false, nullable = false, insertable = true, updatable = true)
    private Long deptId;

    @Column(name = "index_number", unique = false, insertable = true, updatable = true)
    private Long indexNumber;

    private Boolean resetPwd;

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

    public Long getDeptId() {
        return deptId;
    }

    public boolean isResetPwd() {
        if (resetPwd == null) {
            resetPwd = false;
        }
        return resetPwd;
    }

    public void setResetPwd(boolean resetPwd) {
        this.resetPwd = resetPwd;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
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
