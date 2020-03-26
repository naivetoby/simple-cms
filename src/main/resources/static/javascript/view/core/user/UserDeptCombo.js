Ext.define('OA.view.core.user.UserDeptCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.userdeptcombo',
	name : 'deptId',
	displayField : 'deptName',
	valueField : 'deptId',
	fieldLabel : '所属部门',
	emptyText : '请选择部门',
	autoScroll : true,
	store : Ext.create('OA.store.core.user.UserDepartmentCombos',{
		autoLoad:true
	}),
	editable : false,
	listConfig : {
		maxHeight : 192
	}
});