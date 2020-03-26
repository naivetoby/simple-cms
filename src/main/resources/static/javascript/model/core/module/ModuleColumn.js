Ext.define('OA.model.core.module.ModuleColumn', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'text',
		type : 'string'
	}, {
		name : 'dataIndex',
		type : 'string'
	}, {
		name : 'renderer',
		type : 'string'
	}, {
		name : 'sortable',
		type : 'boolean'
	}, {
		name : 'flex',
		type : 'int',
		convert : null
	},{
		name : 'extraParam',
		type : 'string'
	} ]
});