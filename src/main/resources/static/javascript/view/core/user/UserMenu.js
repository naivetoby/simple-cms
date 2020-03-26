Ext.define('OA.view.core.user.UserMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.usermenu',
	requires : [ 'OA.view.core.user.ChangeStatusItem', 'OA.view.core.user.ViewAuthItem' ],
	plain : true,
	bodyStyle : {
		border : 'none'
	},
	style : {
		borderColor : '#aaa'
	},
	initComponent : function() {
		var self = this;
		var disabled = self.authValue == 1 ? false : true;// 判断权限
		var status = self.record.get('status');
		self.items = [ {
			xtype : 'viewauthitem',
			record : self.record,
			disabled : status != 1 // 非正常状态
		}, {
			xtype : 'changestatusitem',
			record : self.record,
			disabled : disabled || status == -1 // 未激活状态
		} ];
		this.callParent();
	},
	record : null
});