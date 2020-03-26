/**
 * 删除工具，grid专用
 * 
 * @author 彭嘉辉
 */
Ext.define('OA.parts.core.gridtools.DelTool', {
	extend : 'Ext.button.Button',
	id:'del_normal',
	alias : 'widget.deltool',
	text : '删除',
	scale : 'small',
	iconCls : 'default_btn_icon_minus',
	handler : function(button, event) {
		var grid = button.up('grid');
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {// 判断是否有选中
			Ext.MessageBox.confirm('提 示', '确认删除选中项吗？', function(answer) {
				if ('yes' == answer) {
					// 获取选中行
					var selected = selModel.getSelection();
					// 获取数据源
					var store = grid.store;
					Ext.Array.each(selected, function(item) {// 删除选择行
						store.remove(item);
					});
					// 提交数据
					store.sync({
						success : function() {
							BaseUtil.briefdialog('删除成功', FinalVariables.SUCCESS_ICON);
						}
					});
				}
			});
		} else {
			BaseUtil.briefdialog('您没有选择需要删除的信息', FinalVariables.WARNING_ICON);
		}
	},
	initComponent : function() {
		this.callParent(arguments);
	}
});