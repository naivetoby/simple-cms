package vip.toby.cms.core.util;

/**
 * 专门保存普通常量的类
 */
public class FinalVariables {

    public final static String USER_SESSION = "user";

    public final static String USER_SESSION_JSON = "userjson";

    public final static String USER_SESSION_BASE64 = "userBase64";

    public final static String SUPER_AUTH = "**##@@";

    public final static String ERROR_MSG = "errorMsg";

    public final static Integer[] IMPORTANT_ROLE_TYPES = {RoleTypeEnum.ADMIN.getType(), RoleTypeEnum.AUDIT.getType(), RoleTypeEnum.SECRET.getType()};

    public enum USER_AUTH {
        /**
         * 权限未定
         */
        DEFAULT(-1),

        /**
         * 只读
         */
        READ_ONLY(0),

        /**
         * 读写
         */
        WRITABLE(1),

        /**
         * 禁止访问
         */
        FORBIDDEN(-10000);

        private int auth;

        USER_AUTH(int auth) {
            this.auth = auth;
        }

        public int getAuth() {
            return this.auth;
        }

        public static USER_AUTH valueOf(Integer auth) {
            if (auth == null) {
                auth = -1;
            }
            switch (auth) {
                case -1:
                    return DEFAULT;
                case 0:
                    return READ_ONLY;
                case 1:
                    return WRITABLE;
                case -10000:
                    return FORBIDDEN;
                default:
                    return DEFAULT;
            }
        }
    }

    public enum USER_STATUS {

        /**
         * 未激活
         */
        UN_ACTIVE(-1),

        /**
         * 正常
         */
        ACTIVE(1),

        /**
         * 锁定
         */
        LOCKED(2),

        /**
         * 未知
         */
        UNKNOW(0);

        private int status;

        USER_STATUS(int status) {
            this.status = status;
        }

        public int getStatus() {
            return this.status;
        }

        public static USER_STATUS valueOf(int status) {
            switch (status) {
                case -1:
                    return UN_ACTIVE;
                case 1:
                    return ACTIVE;
                case 2:
                    return LOCKED;
                default:
                    return UNKNOW;
            }
        }

        public String getStatusName() {
            String name = null;
            switch (this) {
                case UN_ACTIVE:
                    name = "未激活";
                    break;
                case ACTIVE:
                    name = "正常";
                    break;
                case LOCKED:
                    name = "已锁定";
                    break;
                case UNKNOW:
                    name = "未知状态";
                    break;
                default:
                    name = "未知状态";
                    break;
            }
            return name;
        }
    }

    public enum MODULE_VIEWTYPE {

        /**
         * 系统目录
         */
        SYS_DIR(-1),

        /**
         * 系统功能模块
         */
        SYS_GRID(-2),

        /**
         * 系统自定义模块
         */
        SYS_DEFAULT(-3),

        /**
         * 目录
         */
        DIR(1),

        /**
         * 功能模块
         */
        GRID(2),

        /**
         * 自定义模块
         */
        DEFAULT(3),

        /**
         * 未知类型
         */
        UNKNOW(0);

        private int viewType;

        MODULE_VIEWTYPE(int viewType) {
            this.viewType = viewType;
        }

        public int getViewType() {
            return this.viewType;
        }

        public static MODULE_VIEWTYPE valueOf(int viewType) {
            switch (viewType) {
                case -1:
                    return SYS_DIR;
                case -2:
                    return SYS_GRID;
                case -3:
                    return SYS_DEFAULT;
                case 1:
                    return DIR;
                case 2:
                    return GRID;
                case 3:
                    return DEFAULT;
                default:
                    return UNKNOW;
            }
        }

        public String getViewTypeName() {
            String name = null;
            switch (this) {
                case SYS_DIR:
                    name = "系统目录";
                    break;
                case SYS_GRID:
                    name = "系统功能模块";
                    break;
                case SYS_DEFAULT:
                    name = "系统自定义模块";
                    break;
                case DIR:
                    name = "目录";
                    break;
                case GRID:
                    name = "功能模块";
                    break;
                case DEFAULT:
                    name = "自定义模块";
                    break;
                case UNKNOW:
                    name = "未知类型";
                    break;
                default:
                    name = "未知类型";
                    break;
            }
            return name;
        }
    }

    public enum RoleTypeEnum {

        /**
         * 普通角色
         */
        NORMAL(1),

        /**
         * 系统管理员
         */
        ADMIN(2),

        /**
         * 安全保密管理员
         */
        SECRET(3),

        /**
         * 日志审计员
         */
        AUDIT(4),

        /**
         * 未知角色类型
         */
        UNKNOW(0);

        private int roleType;

        RoleTypeEnum(Integer roleType) {
            this.roleType = roleType;
        }

        public int getType() {
            return roleType;
        }

        public static RoleTypeEnum valueOf(Integer roleType) {
            switch (roleType) {
                case 1:
                    return NORMAL;
                case 2:
                    return ADMIN;
                case 3:
                    return SECRET;
                case 4:
                    return AUDIT;
                default:
                    return UNKNOW;
            }
        }

        public String getTypeName() {
            String name = null;
            switch (this) {
                case NORMAL:
                    name = "普通角色";
                    break;
                case ADMIN:
                    name = "系统管理员";
                    break;
                case SECRET:
                    name = "安全保密管理员";
                    break;
                case AUDIT:
                    name = "日志审计员";
                    break;
                default:
                    name = "未知角色类型";
                    break;
            }
            return name;
        }
    }

    /**
     * @author 彭嘉辉
     */
    public enum ERRRO_CODE {
        /**
         * 无权限访问
         */
        NO_AUTH(403),
        /**
         * 会话过期
         */
        NO_SESSION(408),
        /**
         * 权限被修改
         */
        AUTH_CHANGED(409),
        /**
         * 模块被修改
         */
        MODULE_CHANGED(410),
        /**
         * 数据库异常
         */
        DB_ERROR(420),
        /**
         * 其他错误
         */
        DEFAULT(500);

        private int errorCode;

        ERRRO_CODE(int errorCode) {
            this.errorCode = errorCode;
        }

        public int getErrorCode() {
            return this.errorCode;
        }

        public static ERRRO_CODE valueOf(Integer errorCode) {
            if (errorCode == null) {
                errorCode = 500;
            }
            switch (errorCode) {
                case 403:
                    return NO_AUTH;
                case 408:
                    return NO_SESSION;
                case 409:
                    return AUTH_CHANGED;
                case 410:
                    return MODULE_CHANGED;
                case 420:
                    return DB_ERROR;
                default:
                    return DEFAULT;
            }
        }
    }
}
