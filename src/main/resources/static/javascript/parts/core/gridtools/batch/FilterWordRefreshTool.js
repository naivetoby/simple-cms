/**
 * 强制刷新敏感词库小工具
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.batch.FilterWordRefreshTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.filterwordrefreshtool',
    text: '强制刷新词库',
    scale: 'small',
    iconCls: 'default_btn_icon_plus',
    handler: function (button, event) {
        var grid = button.up('grid');
        BaseUtil.request({
            url: 'filterword/refreshWordCache',
            params: {},
            success: function (response) {
                grid.store.load({
                    callback: function () {
                        BaseUtil.briefdialog('操作成功');
                    }
                });
            }
        });
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});