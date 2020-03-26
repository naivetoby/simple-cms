/**
 * 信件投递审核
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.batch.UserDeliverNormalTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.userdelivernormaltool',
    text: '(用户)正常',
    scale: 'small',
    iconCls: 'default_btn_icon_plus',
    handler: function (button, event) {
        var grid = button.up('grid');
        var ids = [];
        var delivetype = null;
        var selModel = grid.getSelectionModel();
        if (!selModel.hasSelection()) {
            BaseUtil.briefdialog('您没有选择任何数据', FinalVariables.WARNING_ICON);
            return;
        }
        Ext.Array.each(selModel.getSelection(), function (item) {
            if (!delivetype) {
                delivetype = item.data['gkId'] ? 'reply' : 'new';
            }
            ids.push(item.data['uid']);
        });
        Ext.Msg.confirm('提示框', '您确定将这些用户的投递状态标记为：正常？', function (btn) {
            if (btn == 'yes') {
                BaseUtil.request({
                    url: 'letterdeliver' + delivetype + '/changeUserDeliverStatus',
                    params: {
                        uids: ids.join(','),
                        deliverStatus: 1
                    },
                    success: function (response) {
                        grid.store.load({
                            callback: function () {
                                BaseUtil.briefdialog('操作成功');
                            }
                        });
                    }
                });
            }
        });
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});