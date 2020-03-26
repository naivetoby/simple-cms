/**
 * 右键修改事件
 * 
 * @author 吴希潮
 */
Ext.define('OA.parts.core.menus.EditItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.editItem',
	text : '编 辑',
	border : false,
	handler : function(item, e) {
		var self = this;
		if (self.isForm) {
			var tabId = "tab_" + self.record.getId();
			parent.Ext.require(self.className, function() {
				BaseUtil.showTab(tabId, {
					className : self.className,
					viewAlias : self.viewAlias,//别名
					url : self.classUrl,// 与store中的url一致指向bean包
					recordId : self.record.getId(),
					title : self.viewTitle,
					items : [ {
						xtype : self.viewAlias,//别名
						record : self.record,
						grid : self.grid,
						authValue : self.grid.panel.authValue
					} ],
					type : FinalVariables.TAB_TYPES_GENERAL,
				}, true);
			});
		} else {
			var dialog = Ext.getCmp('edit_dialog_id');
			if (dialog) {
				// 销毁旧窗口，不然下拉框赋值有时候会出错
				dialog.destroy();
			}
			var grid = Ext.getCmp('edit_dialog_id');
			if (grid) {
				grid.destroy();
			}
			// 创建新窗口
			dialog = Ext.widget({
				id : 'edit_dialog_id',
				xtype : self.viewAlias,
				record : self.record,
				title : self.viewTitle,
				formReadOnly : self.formReadOnly
			});
			var form = dialog.down('form');
			form.isAdd = false;
			form.loadRecord(self.record);
			// 设置表单只读
			if (self.formReadOnly) {
				dialog.setFormReadOnly();
			}
			// 显示
			dialog.show();
		}
	},
	/**
	 * 右击的数据
	 */
	record : null,
	/**
	 * 网格对象
	 */
	grid : null,
	/**
	 * 编辑界面别名
	 */
	viewAlias : '',
	/**
	 * 是否表单
	 */
	isForm : false,
	/**
	 * 类路径
	 */
	className : '',
	/**
	 * bean下面的包
	 */
	classUrl : '',
	/**
	 * 标题
	 */
	viewTitle : ''

});