Ext.define('OA.store.core.user.UserAuths', {
	extend : 'OA.store.core.BaseTreeStore',
	model : 'OA.model.core.user.UserAuth',
	url : 'user/auth',
	root : {
		index : 0,
		moduleId : 0,
		text : '项目',
		expanded : true
	},
	constructor : function(config) {
		var self = this;
		config = config || {};
		Ext.apply(self, config);
		self.callParent([ config ]);
	},
	sorters : [ {
		property : 'index',
		direction : 'ASC'
	} ]
});