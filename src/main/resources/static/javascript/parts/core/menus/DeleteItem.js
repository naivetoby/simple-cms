/**
 * 右键删除事件
 * 
 * @author 吴希潮
 */
Ext.define('OA.parts.core.menus.DeleteItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.deleteItem',
	text : '删 除',
	border : false,
	handler : function(item, e) {
		this.store.remove(this.record);
		this.store.sync();
	},
	/**
	 * 右击的数据
	 */
	record : null,
	/**
	 * 数据源
	 */
	store : null
});