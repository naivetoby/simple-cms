Ext.define('Ext.ux.JCDateFormat', {
    statics: {
        format: function (value, format) {
            value = new Date(value);
            var o = {
                "M+": value.getMonth() + 1,
                "d+": value.getDate(),
                "h+": value.getHours(),
                "m+": value.getMinutes(),
                "s+": value.getSeconds(),
                "q+": Math.floor((value.getMonth() + 3) / 3),
                "S": value.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        },
        dataRenderer: function (format) {
            var _this = this;
            return function (v) {
                if (!v) {
                    return "";
                }
                return _this.format(v, format);
            };
        }
    }
});