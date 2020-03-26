Ext.define('OA.view.core.role.UpdateUser4ImportantRoleDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.updateuser4importantroledialog',
	title : '配置用户',
	width : 280,
	record : null,
	items : [ {
		xtype : 'form',
		border : false,
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70
		},
		items : [ {
			xtype : 'importantrole4usercombo'
		} ]
	} ],
	buttons : [ {
		text : '确定',
		scale : 'medium',
		action : 'update_user_4important_role'
	}, {
		text : '取消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});