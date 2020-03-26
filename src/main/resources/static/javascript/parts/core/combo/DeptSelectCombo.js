/**
 * 部門选择下列框
 * 
 * 可选，可填，可查
 */
Ext.define('OA.parts.core.combo.DeptSelectCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.deptselectcombo',
	requires : [ 'OA.store.core.department.Departments' ],
	displayField : 'deptName',
	anyMatch : true,
	// delimiter:'，',
	store : Ext.create('OA.store.core.department.Departments', {
		remoteFilter : false,
		pageSize : 10000
	}),
	initComponent : function() {
		var self = this;
		self.store.load();
		self.callParent();
	},
	queryMode : 'local'
});