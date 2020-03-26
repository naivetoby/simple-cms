Ext.define('OA.view.core.role.RoleDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.roledialog',
	title : '新建角色',
	items : [ {
		xtype : 'form',
		border : false,
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70
		},
		items : [ {
			xtype : 'textfield',
			name : 'roleName',
			fieldLabel : "角色名称",
			allowBlank : false
		}, {
			xtype : 'textarea',
			name : 'roleDescription',
			fieldLabel : '角色说明',
			minHeight : 100
		} ]
	} ],
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		action : 'save_Role'
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});