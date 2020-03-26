Ext.define('OA.view.core.role.RUDRightGrid', {
	extend : 'OA.view.core.role.RUDBaseGrid',
	alias : 'widget.rudrightgrid',
	id : 'rud_right_grid',
	store : 'core.role.RoleBindUsers',
	features : [ {
		ftype : 'filters'
	} ],
	dockedItems : [ {
		xtype : 'toolbar',
		dock : 'top',
		layout : 'fit',
		padding : 2,
		items : [ {
			xtype : 'triggerfield',
			enableKeyEvents : true,
			hasSearch : false,
			border : false,
			margin : 0,
			trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
			// trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
			listeners : {
				keyup : function(field) {
					var store = field.up('rudrightgrid').store;
					store.remoteFilter = false;
					store.clearFilter();
					if (field.value) {
						store.filter({
							property : 'userName',
							value : this.value,
							anyMatch : true,
							caseSensitive : false
						});
						field.hasSearch = true;
						field.triggerCell.item(0).setDisplayed(true);
						field.updateLayout();
					} else {
						field.triggerCell.item(0).setDisplayed(false);
						field.updateLayout();
					}
				},
				afterrender : function() {
					this.triggerCell.item(0).setDisplayed(false);
				}
			},
			onTrigger1Click : function() {
				var me = this;
				if (me.hasSearch) {
					me.setValue('');
					me.up('rudrightgrid').store.clearFilter();
					me.hasSearch = false;
					me.triggerCell.item(0).setDisplayed(false);
					me.updateLayout();
				}
			}
		} ]
	} ],
	initComponent : function() {
		this.columns = [ {
			dataIndex : 'userId',
			hidden : true
		}, {
			flex : 1,
			dataIndex : 'userName',
			align : 'left'
		} ];
		this.callParent(arguments);
	}
});