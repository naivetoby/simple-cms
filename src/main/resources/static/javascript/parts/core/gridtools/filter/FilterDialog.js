/**
 * grid查询对话框
 *
 * @author 彭嘉辉
 */
Ext.define('OA.parts.core.gridtools.filter.FilterDialog', {
    extend: 'OA.view.core.BaseDialog',
    alias: 'widget.filterdialog',
    title: '查 询',
    width: 480,
    autoShow: true,
    initComponent: function () {
        this.callParent(arguments);
    },
    /**
     * 对话框中的元素，单元素数组[{xtype : form,items : array}]，必须传入
     *
     * @type array{Object}
     */
    items: [],
    /**
     * 网格数据源，必须传入
     *
     * @type Ext.data.Store
     */
    store: null,
    buttons: [{
        text: '查 询',
        scale: 'medium',
        handler: function (button) {
            button.up('filterdialog').dataGrid.down('backtool').setVisible(true);
            // 对话框对象
            var dialog = button.up('window');
            // grid的数据源
            var store = dialog.store;
            // 表单对象
            var form = dialog.down('form');
            // 表单所有元素
            var fields = form.items.items;
            // 表单各元素的值
            var values = form.getValues();
            // 查询条件sql语句条件
            var queryCondition = "";
            // 查询条件json数组
            var conditionArr = new Array();

            Ext.Array.each(fields, function (field, i) {
                // 数据类型
                var dataType = field.dataType;
                // 字段名
                var fieldName = field.name;
                var startDate = '', endDate = '';
                if ('date' == dataType || 'datatime' == dataType) {
                    // 日期条件查询
                    var containerId = "field_container_" + fieldName;
                    var fieldcontainer = dialog.down('fieldcontainer[itemId=' + containerId + ']');
                    startDate = fieldcontainer.down('datefield[itemId=startdt_' + fieldName + ']').getValue();// 开始日期
                    endDate = fieldcontainer.down('datefield[itemId=enddt_' + fieldName + ']').getValue();// 结束日期
                    startDate = Ext.isEmpty(startDate) ? startDate : startDate.getTime();
                    endDate = Ext.isEmpty(endDate) ? endDate : endDate.getTime() + 24 * 60 * 60 * 1000;// datefield默认是从0点，所以加一天
                }
                if (!Ext.isEmpty(values[fieldName]) || !Ext.isEmpty(startDate) || !Ext.isEmpty(endDate)) {
                    // 生成查询json
                    var conditionObj = {};
                    conditionObj.fieldName = fieldName;
                    conditionObj.dataType = dataType;
                    conditionObj.value = values[fieldName];
                    conditionArr.push(conditionObj);

                    if (queryCondition) {// 判断是否已经有查询条件
                        queryCondition += ' AND ';
                    }

                    var dbFieldName = dialog.toDBFieldName(fieldName);

                    // 判断数据类型
                    if ('int' == dataType || 'auto' == dataType || 'float' == dataType || 'long' == dataType) {
                        queryCondition += dbFieldName + ' = ' + values[fieldName];
                    } else if ('string' == dataType) {
                        queryCondition += dbFieldName + ' like \'%' + values[fieldName] + '%\'';
                    }
                    else if ('date' == dataType) {
                        if (Ext.isEmpty(endDate)) {
                            queryCondition += dbFieldName + ' >= ' + Ext.ux.JCDateFormat.format(new Date(startDate), '\'yyyy-MM-dd hh::mm::ss\'');
                        } else if (Ext.isEmpty(startDate)) {
                            queryCondition += dbFieldName + ' <' + Ext.ux.JCDateFormat.format(new Date(endDate), '\'yyyy-MM-dd hh::mm::ss\'');
                        } else {
                            queryCondition += dbFieldName + ' >= ' + Ext.ux.JCDateFormat.format(new Date(startDate), '\'yyyy-MM-dd hh::mm::ss\'') + ' AND ' + dbFieldName + ' < ' + Ext.ux.JCDateFormat.format(new Date(endDate), '\'yyyy-MM-dd hh::mm::ss\'');
                        }
                    }
                }
            });
            // 查询
            if (form.isValid()) {
                if (!Ext.isEmpty(queryCondition)) {
                    store.filter([{
                        property: 'query',
                        value: queryCondition
                    }]);
                }
                dialog.close();
            }
        }
    }, {
        text: '取 消',
        scale: 'medium',
        handler: function (button) {
            button.up('window').close();
        }
    }],
    /**
     * 将前端模型对象字段名转换成后台数据库字段名
     *
     * @param {String}
     *            fieldName 前端模型对象字段名
     * @return {String} 后台数据库字段名
     */
    toDBFieldName: function (fieldName) {
        // 后台数据库字段名
        var dbFieldName = null;

        // 字符串转字符数组
        var charArr = fieldName.match(/./g);
        for (var i = 0; i < charArr.length; i++) {
            if ((charArr[i].charCodeAt(0) >= 65) && (charArr[i].charCodeAt(0) <= 90)) {// 判断是否大写
                charArr[i] = charArr[i].toLowerCase();
                charArr.splice(i, 0, '_');
            }
        }
        // 字符数组转字符串
        dbFieldName = charArr.join('');

        return dbFieldName;
    }
});