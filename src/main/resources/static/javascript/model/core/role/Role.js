Ext.define('OA.model.core.role.Role', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'roleId',
		type : 'long',
		convert : null
	}, {
		name : 'roleName',
		type : 'string',
		label : '角色名称',
		queryAble : true
	}, {
		name : 'roleDescription',
		type : 'string',
		label : '角色说明',
		queryAble : true
	}, {
		name : 'indexNumber',
		type : 'int',
		convert : null
	}, {
		name : 'roleType',// 角色类型
		type : 'int',
		convert : null
	}, {
		name : 'authInfo',
		type : 'string'
	} ],
	idProperty : 'roleId'
});