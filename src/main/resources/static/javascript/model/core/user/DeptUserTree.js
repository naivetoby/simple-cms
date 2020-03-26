Ext.define('OA.model.core.user.DeptUserTree', {
	extend : 'Ext.data.TreeModel',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'itemId',
		type : 'long'
	}, {
		name : 'text',
		type : 'string'
	} ],
	idProperty : 'id'
});