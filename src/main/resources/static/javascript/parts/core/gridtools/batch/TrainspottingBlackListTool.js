/**
 * 猜火车状态审核
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.batch.TrainspottingBlackListTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.trainspottingblacklisttool',
    text: '(猜火车)黑名单',
    scale: 'small',
    iconCls: 'default_btn_icon_plus',
    handler: function (button, event) {
        var grid = button.up('grid');
        var ids = [];
        var selModel = grid.getSelectionModel();
        if (!selModel.hasSelection()) {
            BaseUtil.briefdialog('您没有选择任何数据', FinalVariables.WARNING_ICON);
            return;
        }
        Ext.Array.each(selModel.getSelection(), function (item) {
            if (item.data['status'] === -2) {
                ids.push(item.getId());
            }
        });
        Ext.Msg.confirm('提示框', '您确定将这些电影的审核状态标记为：黑名单？', function (btn) {
            if (btn === 'yes') {
                BaseUtil.request({
                    url: 'trainspotting/changeTrainspottingStatus',
                    params: {
                        ids: ids.join(','),
                        status: -3
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