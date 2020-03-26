/**
 * 返回小工具
 * 
 * @author 刘树君
 */
Ext.define('OA.parts.core.gridtools.BackTool', {
	extend : 'Ext.button.Button',
	alias : 'widget.backtool',
	text : '返回',
	scale : 'small',
	hidden : true,
	iconCls : 'default_btn_icon_back',
	handler : function(button, event) {
		button.setVisible(false);
		button.up('grid').store.clearFilter();
	},
	initComponent : function() {
		this.callParent(arguments);
	}
});