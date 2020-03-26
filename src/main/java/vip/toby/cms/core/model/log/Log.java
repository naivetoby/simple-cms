package vip.toby.cms.core.model.log;

import vip.toby.cms.core.annotation.dao.Column;
import vip.toby.cms.core.annotation.dao.Id;
import vip.toby.cms.core.annotation.dao.Table;
import vip.toby.cms.core.annotation.excel.ExcelRequired;

@Table(name = "t_log")
public class Log {

    @Id
    @Column(name = "log_id", unique = true, insertable = false, updatable = false)
    private Long logId;

    @ExcelRequired(title = "客户端IP", width = 30)
    @Column(name = "client_ip", unique = false, insertable = true, updatable = false)
    private String clientIp;

    @ExcelRequired(title = "用户名", width = 30)
    @Column(name = "user_name", unique = false, insertable = true, updatable = false)
    private String userName;

    @ExcelRequired(title = "登录名", width = 30)
    @Column(name = "login_name", unique = false, insertable = true, updatable = false)
    private String loginName;

    @ExcelRequired(title = "模块", width = 30)
    @Column(name = "module_name", unique = false, insertable = true, updatable = false)
    private String moduleName;

    @ExcelRequired(title = "日志信息", width = 30)
    @Column(name = "action", unique = false, insertable = true, updatable = false)
    private String action;

    @ExcelRequired(title = "日志时间", width = 30)
    @Column(name = "log_time", unique = false, insertable = false, updatable = false)
    private String logTime;

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

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getLogTime() {
        return logTime;
    }

    public void setLogTime(String logTime) {
        this.logTime = logTime;
    }

}