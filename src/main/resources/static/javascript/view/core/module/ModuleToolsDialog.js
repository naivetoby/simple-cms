Ext.define('OA.view.core.module.ModuleToolsDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.moduletoolsdialog',
	items : [ {
		xtype : 'form',
		border : false,
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70
		},
		items : [ {
			xtype : 'textfield',
			name : 'text',
			fieldLabel : "组件名",
			allowBlank : false
		}, {
			xtype : 'textfield',
			name : 'name',
			fieldLabel : "组件类名",
			allowBlank : false
		}, {
			xtype : 'textfield',
			name : 'alias',
			fieldLabel : '组件别名',
			allowBlank : false
		}, {
			xtype : 'moduleauthcombo',
			value : 0,
			fieldLabel : '最低权限'
		} ]
	} ],
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		action : 'save_tools'
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});