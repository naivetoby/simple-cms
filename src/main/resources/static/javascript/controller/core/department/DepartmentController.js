Ext.define('OA.controller.core.department.DepartmentController', {
	extend : 'Ext.app.Controller',
	init : function() {
		var self = this;
		self.control({
			'datagrid[id=grid_view_Department]' : {
				itemdblclick : self.showEditDialog
			},
			'deptdialog button[action=save_Department]' : {
				click : self.submitData
			}
		});
	},
	requires : [ 'OA.store.core.department.DepartmentCombos' ],
	models : [ 'core.department.Department' ],
	stores : [ 'core.department.Departments', 'core.department.DepartmentCombos' ],
	views : [ 'core.DataGrid', 'core.department.DeptDialog', 'core.department.DeptCombo' ],
	showEditDialog : function(grid, record) {
		// 只读标识
		var formReadOnly = !grid.panel.authValue || grid.panel.authValue != 1;
		var dialog = Ext.getCmp('edit_dialog_Department');
		if (dialog) {
			// 销毁旧窗口，不然下拉框赋值有时候会出错
			dialog.destroy();
		}

		// 创建新窗口
		dialog = Ext.widget({
			id : 'edit_dialog_Department',
			xtype : 'deptdialog',
			record : record,
			title : formReadOnly ? '查看部门' : '编辑部门',
			formReadOnly : formReadOnly
		});

		var form = dialog.down('form');
		form.isAdd = false;
		form.loadRecord(record);
		// 设置表单只读
		if (formReadOnly) {
			dialog.setFormReadOnly();
		}
		// 显示
		dialog.show();
	},
	submitData : function(button) {
		// 获取对话框对象
		var win = button.up('window');
		// 获取表单对象
		var form = win.down('form');
		if (form.isValid()) {// 判断表单是否通过验证
			var store = this.getCoreDepartmentDepartmentsStore();

			// 数据源对象
			if (form.isAdd) {// 新增
				store.add(Ext.create('OA.model.core.department.Department', form.getValues()));
			} else {// 编辑
				// 获取表单指向的部门信息
				var record = form.getRecord();
				// 获取表单当前值
				var values = form.getValues();
				// 更新部门信息
				record.set(values);
			}
			// 关闭对话框
			win.close();

			// 提交数据
			store.sync();
		}
	}
});