Ext.define('OA.store.core.log.Logs', {
	extend : 'OA.store.core.BaseStore',
	model : 'OA.model.core.log.Log',
	url : 'log',
	sorters : [ {
		property : 'logTime',
		direction : 'DESC'
	} ]
});