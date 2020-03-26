package vip.toby.cms.core.model.user;


import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Table;

@Table(name = "t_user")
public class User extends UserGrid {

    @Column(name = "login_password", unique = false, nullable = false, insertable = true, updatable = true)
    private String loginPassword;

    @Column(name = "salt", unique = false, nullable = false, insertable = true, updatable = true)
    private String salt;

    public String getLoginPassword() {
        return loginPassword;
    }

    public void setLoginPassword(String loginPassword) {
        this.loginPassword = loginPassword;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

}
