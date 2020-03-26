/**
 * 查询工具，grid专用
 *
 * @author 彭嘉辉
 */
Ext.define('OA.parts.core.gridtools.FilterTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.filtertool',
    requires: ['OA.parts.core.gridtools.filter.FilterDialog'],
    text: '查询',
    scale: 'small',
    iconCls: 'default_btn_icon_search',
    handler: function (button, event) {
        var grid = button.up('grid');
        // 数据源
        var store = grid.store;
        // 所有字段
        var fields = store.model.getFields();
        // 字段样式默认设置
        var fieldDefaults = null;

        // 生成查询表单元素
        var items = new Array();
        var datefieldNum = 0;
        // 判断日期类型的查询字段有多少个，暂时无法解决多个日期查询时出现的错误
        Ext.Array.forEach(fields, function (field) {
            if (field.queryAble && 'date' == field.type.type) {
                datefieldNum++;
            }
        });
        Ext.Array.each(fields, function (field) {
            if (field.name == 'fieldDefaults') {// 判断是否配置的字段默认样式
                fieldDefaults = field.config;
                return;
            }
            if (field.queryAble) {
                var type = field.type.type;
                if (field.combobox) {
                    var fieldLabel = field.label;
                    var combo = {
                        xtype: field.combobox,
                        name: field.name,
                        comboConfig: field.comboConfig,
                        dataType: type
                    };
                    if (!Ext.isEmpty(fieldLabel)) {
                        combo.fieldLabel = fieldLabel;
                    }
                    items.push(combo);
                    return;
                }
                if ('int' == type || 'float' == type || 'long' == type) {// 判断数据类型
                    // 插入表单元素
                    items.push({
                        xtype: 'numberfield',// 文本框
                        name: field.name,
                        dataType: type,
                        fieldLabel: field.label
                    });
                } else if ('string' == type) {
                    // 插入表单元素
                    items.push({
                        xtype: 'textfield',// 文本框
                        name: field.name,
                        dataType: type,
                        fieldLabel: field.label
                    });
                } else if ('date' == type) {
                    // 日期查询
                    items.push({
                        xtype: 'fieldcontainer',
                        itemId: 'field_container_' + field.name,
                        fieldLabel: field.label,
                        dataType: type,
                        name: field.name,
                        anchor: '100%',
                        fieldDefaults: {
                            format: 'Y-m-d H:i:s',
                            editable: true
                        },
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            xtype: 'datefield',
                            itemId: 'startdt_' + field.name,
                            endDateField: 'enddt_' + field.name,
                            flex: 1
                        }, {
                            xtype: 'displayfield',
                            margin: '0 10',
                            value: '至'
                        }, {
                            xtype: 'datefield',
                            itemId: 'enddt_' + field.name,
                            startDateField: 'startdt_' + field.name,
                            flex: 1
                        }]
                    });
                }
            }
        });

        // 显示查询对话框
        var dialogForm = [{
            xtype: 'form',
            border: false,
            fieldDefaults: fieldDefaults ? fieldDefaults : {
                anchor: '100%',
                labelWidth: 70
            },
            items: items
        }];
        Ext.create('OA.parts.core.gridtools.filter.FilterDialog', {
            items: dialogForm,
            store: store,
            showButton: button,
            dataGrid: grid
        });
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});