Ext.define('OA.view.core.home.LeftPanel', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.leftpanel',
	layout : 'fit',
	id : 'left_panel',
	width : 260,
	split : true,
	useArrows : true,
	animate : true,
	singleExpand : false,
	store : 'core.home.IndexModules',
	title : '系统导航',
	cls : 'addr-panel',
	collapsed : leftCollapse,
	collapsible : false,
	rootVisible : false,
	region : 'west',
	initComponent : function() {
		this.callParent(arguments);
	}
});