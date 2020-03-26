Ext.define('OA.view.core.department.DeptCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.deptcombo',
	name : 'deptPid',
	displayField : 'deptName',
	valueField : 'deptId',
	fieldLabel : '上级部门',
	emptyText : '请选择部门',
	autoScroll : true,
	editable : false,
	listConfig : {
		maxHeight : 192
	},
	listeners : {
		// 初始化下拉框的默认数据
		beforerender : function(obj, eOpts) {
			var record = obj.up('window').down('form').getRecord();
			if (record) {
				// 设置默认值
				obj.setValue(Ext.create('OA.model.core.department.Department', {
					deptId : record.get('deptPid'),
					deptName : record.get('parentName')
				}));
			} else if (obj.notEmpty) {
				obj.setValue(Ext.create('OA.model.core.department.Department', {
					deptId : -1,
					deptName : '公司'
				}));
			}
		}
	},
	initComponent : function() {
		var self = this;
		self.store = Ext.create('OA.store.core.department.DepartmentCombos', {
			extraParams : {
				_rest : 'rest',
				deptId : self.deptId
			}
		});
		self.callParent(arguments);
	}
});