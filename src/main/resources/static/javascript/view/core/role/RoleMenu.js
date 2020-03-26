Ext.define('OA.view.core.role.RoleMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.rolemenu',
	requires : [ 'OA.view.core.role.AddUserItem', 'OA.view.core.role.ConfigAuthItem' ],
	plain : true,
	bodyStyle : {
		border : 'none'
	},
	style : {
		borderColor : '#aaa'
	},
	initComponent : function() {
		var self = this;
		var roleType = self.record.get('roleType');
		var disabled = self.authValue == 1 ? false : true;// 判断权限
		self.items = [ {
			xtype : 'adduseritem',
			record : self.record,
			disabled : disabled
		}, {
			xtype : 'configauthitem',
			record : self.record,
			disabled : disabled || (!isDevelopment && BaseUtil.isImportantRole(roleType))
		} ];
		this.callParent();
	},
	record : null
});