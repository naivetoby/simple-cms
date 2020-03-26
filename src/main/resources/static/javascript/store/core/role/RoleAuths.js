Ext.define('OA.store.core.role.RoleAuths', {
	extend : 'OA.store.core.BaseTreeStore',
	model : 'OA.model.core.role.RoleAuth',
	url : 'role/auth',
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
	listeners : {
		load : function(store, node, records, successful, e0pts) {
			if (successful) {
				var child = node.firstChild || node;
				var tree = node.getOwnerTree();
				if (tree) {
					tree.fireEvent('checkchange', child, child.get('checked'));
				}
			}
		}
	},
	sorters : [ {
		property : 'index',
		direction : 'ASC'
	} ]
});