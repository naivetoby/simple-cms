Ext.define('OA.view.core.user.UserAuthTreePanel', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.userauthtreepanel',
	hideHeaders : true,
	rootVisible : false,
	border : false,
	columns : [ {
		xtype : 'treecolumn',
		text : '模块',
		dataIndex : 'text',
		menuDisabled : true,
		sortable : false,
		flex : 4
	}, {
		text : '权限',
		dataIndex : 'authValue',
		flex : 1,
		menuDisabled : true,
		sortable : false,
		renderer : function(value, cellmeta, record) {
			if (record.get('leaf')) {
				return record.get('authValue') == 1 ? '<span style="font-size:13px;background-color:#47a2e9;color:white;padding:3px 4px;">读写</span>' : '<span style="font-size:13px;background-color:orange;color:white;padding:3px 4px;">只读</span>';
			}
			return '';
		}
	} ],
	initComponent : function() {
		var self = this;
		self.store = Ext.create('OA.store.core.user.UserAuths', {
			extraParams : {
				_rest : 'rest',
				userId : self.userId
			}
		});
		self.callParent(arguments);
	}
});