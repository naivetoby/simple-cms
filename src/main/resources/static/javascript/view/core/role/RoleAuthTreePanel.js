Ext.define('OA.view.core.role.RoleAuthTreePanel', {
	extend : 'OA.view.core.CheckboxTree',
	alias : 'widget.roleauthtreepanel',
	hideHeaders : true,
	rootVisible : false,
	cls : 'role_auth_tree_class',
	border : false,
	overflowX : 'hidden',
	overflowY : 'hidden',
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
		menuDisabled : true,
		sortable : false,
		flex : 1,
		renderer : function(value, cellmeta, record) {
			if (record.get('leaf') && record.get('checked')) {
				var id = record.get('moduleId');
				var checked = record.get('authValue') == 1 ? 'checked="checked"' : '';
				var html = '';
				if (Ext.isIE8m) {
					var labelClass = record.get('authValue') == 1 ? 'btn-switch-label-write' : 'btn-switch-label-read';
					html = '<div class="btn-switch"><input type="checkbox"' + checked + '" id="switch_' + id + '"><label class="' + labelClass + '" for="switch_' + id + '" onclick="var checked = document.getElementById(\'switch_' + id + '\').checked;if(checked){this.className=\'btn-switch-label-read\';}else{this.className=\'btn-switch-label-write\';}document.getElementById(\'switch_' + id + '\').checked=!checked;"><span></span></label></div>';
				} else {
					html = '<div class="btn-switch"><input type="checkbox"' + checked + '" id="switch_' + id + '"><label for="switch_' + id + '"><span></span></label></div>';
				}
				return html;
			}
			return '';
		}
	} ],
	initComponent : function() {
		var self = this;
		self.store = Ext.create('OA.store.core.role.RoleAuths', {
			extraParams : {
				_rest : 'rest',
				roleId : self.roleId
			}
		});
		self.callParent(arguments);
	}
});