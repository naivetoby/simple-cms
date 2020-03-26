Ext.define('OA.view.core.role.AddUserItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.adduseritem',
	text : '配置用户',
	handler : function(item, e) {
		var me = this;
		var roleType = me.record.get('roleType');
		var dialog;
		if (BaseUtil.isImportantRole(roleType)) {
			dialog = Ext.widget({
				xtype : 'updateuser4importantroledialog',
				record : me.record
			});
			var form = dialog.down('form');
			form.loadRecord(me.record);
		} else {
			dialog = Ext.widget({
				id : 'role_user_dialog',
				xtype : 'roleuserdialog',
				title : '角色管理 ——【 ' + me.record.get('roleName') + ' 】',
				record : me.record
			});
		}
		dialog.show();
		var gridHeight = Ext.getCmp('grid_view_Role').getHeight();
		// 控制编辑dialog的高度
		if (dialog.getHeight() >= gridHeight - 100) {
			dialog.setHeight(gridHeight - 100);
		}
	},
	record : null
});