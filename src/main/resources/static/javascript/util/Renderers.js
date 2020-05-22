/**
 * renderer方法管理类，所有renderer方法在此注册
 */
var Renderers = null;
(function () {
    Renderers = {
        moduleViewTypeRenderer: function (v) {
            switch (v) {
                case -3:
                    return '系统自定义模块';
                case -2:
                    return '系统功能模块';
                case -1:
                    return '系统目录';
                case 1:
                    return '目录';
                case 2:
                    return '功能模块';
                case 3:
                    return '自定义模块';
                default:
                    return '未知类型';
            }
        },
        userStatusRenderer: function (v) {
            switch (v) {
                case -1:
                    return "未激活";
                case 1:
                    return "正常";
                case 2:
                    return "已锁定";
                default:
                    return "未知状态";
            }
        },
        // 日志审计的用户名显示
        logUserNameRenderer: function (v) {
            if (Ext.isEmpty(v)) {
                return "用户名不存在";
            } else {
                return v;
            }
        },
        // 日志审计的登录名显示
        logLoginNameRenderer: function (v) {
            if (Ext.isEmpty(v)) {
                return "登录名不存在";
            } else {
                return v;
            }
        },
        /**
         * grid小提示方法
         */
        commonTooltipRenderer: function (v, metaData) {
            metaData.tdAttr = 'data-qtip="' + v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"';
            return v;
        },
        /**
         * 解析日期时间
         */
        dateTimeRenderer: function (format) {
            return function (v, metaData) {
                var str = Ext.Date.format(v, format);
                metaData.tdAttr = 'data-qtip="' + str + '"';
                return str;
            };
        },
    };
})();