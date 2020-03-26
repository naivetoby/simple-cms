Ext.define('OA.view.core.role.RoleAuthDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.roleauthdialog',
	frame : true,
	width : 450,
	height : 550,
	layout : 'fit',
	record : null,
	bodyPadding : 0,
	initComponent : function() {
		var self = this;
		self.items = [ {
			id : 'role_auth_tree_panel',
			xtype : 'roleauthtreepanel',
			roleId : self.record.get('roleId')
		} ];
		this.callParent(arguments);
	},
	buttons : [ {
		text : '确定',
		scale : 'medium',
		action : 'save_Role_Auth'
	}, {
		text : '关闭',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});