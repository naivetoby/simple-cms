Ext.define('OA.model.core.module.Module4Tree', {
	extend : 'Ext.data.TreeModel',
	fields : [ {
		name : 'moduleId',
		type : 'long',
		convert : null
	}, {
		name : 'text',
		type : 'string'
	}, {
		name : 'parentId',
		type : 'long',
		convert : null
	}, {
		name : 'viewType',
		type : 'int',
		convert : null
	}, {
		name : 'leaf',
		type : 'boolean'
	}, {
		name : 'module',
		type : 'string'
	}, {
		name : 'viewInfo',
		type : 'string'
	}, {
		name : 'authValue',
		type : 'int'
	}, {
		name : 'icon',
		type : 'string'
	}, {
		name : 'index',
		type : 'int',
		convert : null
	} ],
	idProperty : 'moduleId'
});