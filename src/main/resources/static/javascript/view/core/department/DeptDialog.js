Ext.define('OA.view.core.department.DeptDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.deptdialog',
	title : '新增部门',
	initComponent : function() {
		var self = this;
		self.items = [ {
			xtype : 'form',
			border : false,
			fieldDefaults : {
				anchor : '100%',
				labelWidth : 70
			},
			items : [ {
				xtype : 'textfield',
				name : 'deptName',
				fieldLabel : "部门名称",
				allowBlank : false
			}, {
				xtype : 'deptcombo',
				allowBlank : false,
				notEmpty : true,
				// 当添加部门时,当前没有部门数据
				deptId : self.record ? self.record.get('deptId') : 0
			}, {
				xtype : 'textareafield',
				name : 'remark',
				fieldLabel : '备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注'
			} ]
		} ];
		this.callParent(arguments);
	},
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		action : 'save_Department'
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});