Ext.define('OA.view.core.role.ConfigAuthItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.configauthitem',
	text : '配置权限',
	handler : function(item, e) {
		var self = this;
		var dialog = Ext.widget({
			id : 'role_auth_dialog',
			xtype : 'roleauthdialog',
			title : '配置权限 ——【 ' + self.record.get('roleName') + ' 】',
			record : self.record
		});
		dialog.show();
		var gridHeight = Ext.getCmp('grid_view_Role').getHeight();
		// 控制编辑dialog的高度
		if (dialog.getHeight() >= gridHeight - 100) {
			dialog.setHeight(gridHeight - 100);
		}
	},
	record : null
});