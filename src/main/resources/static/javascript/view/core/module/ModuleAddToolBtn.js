Ext.define('OA.view.core.module.ModuleAddToolBtn', {
	extend : 'Ext.panel.Tool',
	alias : 'widget.moduleaddtoolbtn',
	type : 'plus',
	tooltip : '新增',
	callback : function(grid, tool, event) {
		var dialog = Ext.getCmp('add_dialog_module_tools');
		if (dialog) {
			// 销毁旧窗口，不然下拉框赋值有时候会出错
			dialog.destroy();
		}
		// 创建新窗口
		dialog = Ext.widget({
			id : 'add_dialog_module_tools',
			xtype : 'moduletoolsdialog',
			title : '新增组件列 '
		});
		var form = dialog.down('form');
		// 新增标识
		form.isAdd = true;
		form.grid = grid;
		dialog.show();
	}
});