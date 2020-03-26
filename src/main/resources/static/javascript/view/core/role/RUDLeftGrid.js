Ext.define('OA.view.core.role.RUDLeftGrid', {
	extend : 'OA.view.core.role.RUDBaseGrid',
	alias : 'widget.rudleftgrid',
	id : 'rud_left_grid',
	requires : [ 'Ext.ux.grid.FiltersFeature', 'Ext.ux.form.SearchField' ],
	hideHeaders : true,
	store : 'core.role.RoleUnBoundUsers',
	features : [ {
		ftype : 'filters'
	} ],
	dockedItems : [ {
		xtype : 'toolbar',
		dock : 'top',
		layout:'fit',
		padding:2,
		items : [ {
			xtype : 'triggerfield',
			enableKeyEvents : true,
			hasSearch : false,
			border:false,
			margin:0,
			trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
			// trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
			listeners : {
				keyup : function(field) {
					var store = field.up('rudleftgrid').store;
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
					}else{
						field.triggerCell.item(0).setDisplayed(false);
						field.updateLayout();
					}
				},
				afterrender:function(){
			        this.triggerCell.item(0).setDisplayed(false);
				}
			},
			onTrigger1Click : function() {
				var me = this;
				if (me.hasSearch) {
					me.setValue('');
					me.up('rudleftgrid').store.clearFilter();
					me.hasSearch = false;
					me.triggerCell.item(0).setDisplayed(false);
					me.updateLayout();
				}
			}
		} ]
	} ],
	initComponent : function() {
		var self = this;
		self.columns = [ {
			dataIndex : 'userId',
			hidden : true
		}, {
			flex : 1,
			dataIndex : 'userName',
			align : 'left',
		} ];
		self.callParent(arguments);
	}
});