Ext.define('OA.view.core.define.DefineDialog', {
	extend : 'OA.view.core.BaseDialog',
	require : [ 'OA.view.core.define.DefineAuthDialog' ],
	alias : 'widget.definedialog',
	userId : null,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	items : [ {
		xtype : 'displayfield',
		margin : '',
		fieldLabel : '',
		labelWidth : 50
	}, {
		xtype : 'button',
		text : '修改密码',
		handler : function() {
			BaseUtil.resetPwd();
		}
	}, {
		xtype : 'displayfield',
		margin : '',
		fieldLabel : '',
		labelWidth : 50
	} ]
});