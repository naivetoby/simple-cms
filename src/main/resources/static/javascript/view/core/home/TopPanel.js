Ext.define('OA.view.core.home.TopPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.toppanel',
	layout : 'fit',
	region : 'north',
	border : false,
	bodyStyle : 'background-color:#4291ca;',
	contentEl : 'north',
	height : 75,
	initComponent : function() {
		this.callParent(arguments);
	}
});