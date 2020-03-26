Ext.define('OA.store.core.home.IndexModules', {
	extend : 'OA.store.core.BaseTreeStore',
	storeId : 'module_tree_store',
	model : 'OA.model.core.module.Module4Tree',
	url : 'index/module',
	root : {
		index : 0,
		moduleId : 0,
		text : '项目',
		expanded : true
	},
	sorters : [ {
		property : 'index',
		direction : 'ASC'
	} ]
});