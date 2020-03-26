package vip.toby.cms.core.dao;

import net.paoding.rose.jade.annotation.DAO;
import net.paoding.rose.jade.annotation.SQL;
import vip.toby.cms.core.model.user.UserBase;

import java.util.List;

@DAO
public interface CommonDAO {

    @SQL("SELECT module_id FROM t_module WHERE module = :1")
    Long getModuleId(String module);

    @SQL("SELECT u.user_id, u.user_name, u.login_password, u.dept_id, d.dept_name, u.salt, u.status, u.phones FROM t_user u LEFT JOIN t_department d ON d.dept_id = u.dept_id WHERE u.login_name = :1")
    UserBase getUserBase(String loginName);

    @SQL("SELECT r.auth_info FROM t_role_user u LEFT JOIN t_role r ON u.role_id = r.role_id WHERE u.user_id = :1 AND r.auth_info IS NOT NULL")
    List<String> getUserRoleAuth(Long userId);

    @SQL("SELECT r.role_name FROM t_role_user u LEFT JOIN t_role r ON u.role_id = r.role_id WHERE u.user_id = :1 ORDER BY r.index_number ASC")
    List<String> getUserRoleName(Long userId);

    @SQL("SELECT auth_info FROM t_role WHERE role_id = :1")
    String getRoleAuth(Long roleId);

    @SQL("SELECT role_type FROM t_role WHERE role_id = :1")
    Integer getRoleType(Long roleId);

    @SQL("SELECT user_id FROM t_role_user WHERE role_id = :1")
    List<Long> getUserIdsByRoleId(Long roleId);

    @SQL("SELECT COUNT(*) FROM t_user WHERE login_name = :1")
    Integer checkLoginName(String loginName);

    @SQL("UPDATE t_user SET status = :1 WHERE user_id = :2")
    void changeUserStatus(Integer status, Long userId);

    @SQL("UPDATE t_user SET login_password = :1, salt = :2, status = :3 WHERE user_id = :4")
    void resetUserPwd(String password, String salt, int status, Long userId);

    @SQL("SELECT view_type FROM t_module WHERE module_id = :1")
    Long getModuleViewType(Long moduleId);

    @SQL("UPDATE t_module SET index_number = :2 WHERE module_id = :1")
    void updateModuleIndexNumber(Long moduleId, Integer indexNumber);

    @SQL("UPDATE t_role SET index_number = :2 WHERE role_id = :1")
    void updateRoleIndexNumber(Long roleId, Integer indexNumber);

    @SQL("SELECT COUNT(*) FROM t_module WHERE module = :1")
    Integer checkModule(String module);

}
