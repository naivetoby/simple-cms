Ext.define('OA.model.core.department.Department', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'deptId',
		type : 'long',
		convert : null
	}, {
		name : 'deptName',
		type : 'string',
		label : '部门名称',
		queryAble : true
	}, {
		name : 'deptPid',
		type : 'long',
		combobox : 'deptcombo',
		queryAble : true,
		convert : null
	}, {
		name : 'parentName',
		type : 'string'
	}, {
		name : 'remark',
		type : 'string'
	}, {
		name : 'indexNumber',
		type : 'int',
		convert : null
	} ],
	idProperty : 'deptId'
});