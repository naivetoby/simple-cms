Ext.define('OA.model.core.module.ModuleTool', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'text',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'alias',
		type : 'string'
	}, {
		name : 'auth',
		type : 'int',
		convert : null,
		combobox : 'moduleauthcombo'
	} ]
});