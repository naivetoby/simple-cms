Ext.define('OA.store.core.department.DepartmentCombos', {
	extend : 'Ext.data.Store',
	model : 'OA.model.core.department.Department',
	remoteFilter : true,
	remoteSort : true,
	proxy : {
		type : 'rest',
		url : 'department/dept_combo',
		reader : {
			root : 'rows'
		},
		extraParams : {
			_rest : 'rest'
		}
	},
	sorters : [ {
		property : 'indexNumber',
		direction : 'ASC'
	} ],
	constructor : function(config) {
		config = config || {};
		var self = this;
		if (config.extraParams) {
			self.proxy.extraParams = config.extraParams;
		}
		this.callParent(arguments);
	}
});