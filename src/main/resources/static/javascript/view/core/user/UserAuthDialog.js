Ext.define('OA.view.core.user.UserAuthDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.userauthdialog',
	frame : true,
	width : 450,
	height : 500,
	layout : 'fit',
	record : null,
	bodyPadding : 0,
	initComponent : function() {
		var self = this;
		self.items = [ {
			id : 'user_auth_tree_panel',
			xtype : 'userauthtreepanel',
			userId : self.record.get('userId')
		} ];
		this.callParent(arguments);
	},
	buttons : [ {
		text : '关闭',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});