/**
 * 右键菜单
 * 
 * @author 吴希潮
 */
Ext.define('OA.parts.core.menus.CommonMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.commonMenu',
	requires : [ 'OA.parts.core.menus.DeleteItem',
			'OA.parts.core.menus.EditItem' ],
	plain : true,
	bodyStyle : {
		border : 'none'
	},
	style : {
		borderColor : '#aaa'
	},
	initComponent : function() {
		var self = this;
		var disabled = self.authValue == 1 ? false : true;// 判断权限
		self.items = [ {
			xtype : 'editItem',
			grid : self.grid,
			record : self.record,
			viewAlias : self.viewAlias,
			isForm : self.isForm,
			className : self.className,
			classUrl : self.classUrl,
			viewTitle : self.viewTitle,
			disabled : disabled
		},  {
			xtype : 'deleteItem',
			record : self.record,
			store : self.grid.store,
			disabled : disabled
		}];
		this.callParent();
	},
	/**
	 * 右击的数据
	 */
	record : null,
	grid : null,
	viewAlias : '',
	isForm : false,
	className : '',
	classUrl : '',
	viewTitle : '',
	authValue : -1
});