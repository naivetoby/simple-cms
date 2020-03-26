Ext.define('OA.model.core.module.Module', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'moduleId',
		type : 'long',
		convert : null
	}, {
		name : 'module',
		type : 'string',
		label : 'Module',
		queryAble : true
	}, {
		name : 'moduleName',
		type : 'string',
		label : '模块名称',
		queryAble : true
	}, {
		name : 'parentId',
		type : 'int',
		combobox : 'modulecombo',
		queryAble : true,
		convert : null
	}, {
		name : 'parentName',
		type : 'string'
	}, {
		name : 'viewType',
		type : 'int',
		combobox : 'moduleviewtypecombo',
		queryAble : true,
		convert : null
	}, {
		name : 'viewInfo',
		type : 'string'
	}, {
		name : 'icon',
		type : 'string'
	}, {
		name : 'indexNumber',
		type : 'int',
		convert : null
	} ],
	idProperty : 'moduleId'
});