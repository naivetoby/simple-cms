/**
 * 信件小工具
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.StoreTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.storetool',
    text: '图表视图',
    scale: 'small',
    iconCls: 'default_btn_icon_plus',
    handler: function (button, event) {
        window.location = "/storestatistic"
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});