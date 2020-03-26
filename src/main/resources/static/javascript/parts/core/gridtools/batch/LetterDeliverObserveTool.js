/**
 * 信件投递审核
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.batch.LetterDeliverObserveTool', {
    extend: 'Ext.button.Button',
    alias: 'widget.letterdeliverobservetool',
    text: '(信件)待审核',
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
            ids.push(item.getId());
        });
        Ext.Msg.confirm('提示框', '您确定将这些信件的投递状态标记为：待审核？', function (btn) {
            if (btn == 'yes') {
                BaseUtil.request({
                    url: 'letterdeliver' + delivetype + '/changeLetterDeliverStatus',
                    params: {
                        lids: ids.join(','),
                        deliverStatus: 0
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