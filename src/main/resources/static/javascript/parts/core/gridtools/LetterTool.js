/**
 * 信件小工具
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.LetterTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.lettertool',
    text: '信件管理',
    scale: 'small',
    iconCls: 'default_btn_icon_plus',
    handler: function (button, event) {
        // if (parent && parent.window) {
        //     parent.window.location = "/myletterrecord";
        // } else {
        //     window.location = "/myletterrecord"
        // }
        window.location = "/myletterrecord"
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});