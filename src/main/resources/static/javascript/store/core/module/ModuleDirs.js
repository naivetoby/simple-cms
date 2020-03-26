Ext.define('OA.store.core.module.ModuleDirs', {
	extend : 'OA.store.core.BaseStore',
	model : 'OA.model.core.module.Module',
	url : 'module/dirs',
	sorters : [{
		property : 'indexNumber',
		direction : 'ASC'
	} ]
});