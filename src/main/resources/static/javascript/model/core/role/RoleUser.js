Ext.define('OA.model.core.role.RoleUser', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'userId',
		type : 'long',
		convert : null
	}, {
		name : 'roleId',
		type : 'long',
		convert : null
	}, {
		name : 'userName',
		type : 'string'
	} ],
	idProperty : 'userId'
});