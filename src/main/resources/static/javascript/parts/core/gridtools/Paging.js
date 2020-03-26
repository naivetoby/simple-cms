Ext.define('OA.parts.core.gridtools.Paging', {
	extend : 'Ext.toolbar.Paging',
	alias : 'widget.paging',
	dock : 'bottom',
	displayInfo : true,
	pageSize : 20,
	plugins : Ext.create('Ext.ux.ProgressBarPager'),
	initComponent : function() {
		var self = this;
		self.items = [ {
			mode : 'local',
			name : 'pagesize',
			width : 85,
			xtype : 'combo',
			value : self.pageSize,
			editable : false,
			typeAhead : false,
			hiddenName : 'pagesize',
			valueField : 'value',
			displayField : 'text',
			triggerAction : 'all',
			store : new Ext.data.ArrayStore({
				fields : [ 'value', 'text' ],
				data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ], [ 80, '80条/页' ] ]
			}),
			listeners : {
				select : function(combo, records, eOpts) {
					var store = self.store;
					store.pageSize = combo.getValue();
					store.currentPage = 1;
					store.load({
						params : {
							start : 0,
							limit : store.pageSize
						}
					});
				}
			}
		} ];
		self.callParent();
		self.store.pageSize = self.pageSize;
		self.store.load({
			start : 0,
			limit : self.pageSize
		});
	}
});