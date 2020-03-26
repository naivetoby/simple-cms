Ext.define('OA.view.core.role.RUDBaseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.rudbasegrid',
	multiSelect : true,
	flex : 1,
	hideHeaders : true,
	border : false,
	columnLines : false,
	rowLines : false,
	viewConfig : {
		stripeRows : false,
		loadMask : false
	},
	style : {
		borderLeft : '1px solid #c0c0c0',
		borderRight : '1px solid #c0c0c0'
	},
	initComponent : function() {
		this.callParent(arguments);
	}
});