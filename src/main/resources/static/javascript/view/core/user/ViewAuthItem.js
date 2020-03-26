Ext.define('OA.view.core.user.ViewAuthItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.viewauthitem',
	text : '查看权限',
	handler : function(item, e) {
		var self = this;
		var dialog = Ext.widget({
			id : 'user_auth_dialog',
			xtype : 'userauthdialog',
			title : '查看权限 ——【 ' + self.record.get('userName') + ' 】',
			record : self.record
		});
		dialog.show();
		var gridHeight = Ext.getCmp('grid_view_User').getHeight();
		// 控制编辑dialog的高度
		if (dialog.getHeight() >= gridHeight - 100) {
			dialog.setHeight(gridHeight - 100);
		}
	},
	record : null
});