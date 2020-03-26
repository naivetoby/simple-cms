/**
 * 新增工具，grid专用
 * 
 * @author 彭嘉辉
 */
Ext.define('OA.parts.core.gridtools.AddTool', {
	extend : 'Ext.button.Button',
	alias : 'widget.addtool',
	text : '新增',
	scale : 'small',
	iconCls : 'default_btn_icon_plus',
	handler : function(button, event) {
		var grid = button.up('datagrid');
		var viewType = grid.gridConfig.form.view;
		if ('form' == viewType) {
			var tabId = "tab_add_" + grid.moduleName;
			parent.Ext.require(grid.formName.name, function() {
				BaseUtil.showTab(tabId, {
					className : grid.formName.name,
					viewAlias : grid.formName.alias,
					title : grid.moduleTitle + '【新增】',
					items : [ {
						xtype : grid.formName.alias,
						isAdd : true,
						authValue : grid.authValue,
						grid : grid
					} ],
					type : FinalVariables.TAB_TYPES_GENERAL
				}, true);
			});
		} else if ('dialog' == viewType) {
			// 创建新窗口
			var dialog = Ext.widget({
				id : 'add_dialog_' + grid.moduleName,
				xtype : grid.formName.alias,
				grid : grid,
				showButton : button
			});

			var form = dialog.down('form');
			// 新增标识
			form.isAdd = true;
			form.grid = grid;
			dialog.show();
			var gridHeight = grid.getHeight();
			// 控制编辑dialog的高度
			if (dialog.getHeight() >= gridHeight - 100) {
				dialog.setHeight(gridHeight - 100);
			}
		}
	},
	initComponent : function() {
		this.callParent(arguments);
	}
});