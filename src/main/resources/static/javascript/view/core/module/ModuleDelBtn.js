Ext.define('OA.view.core.module.ModuleDelBtn', {
	extend : 'Ext.panel.Tool',
	alias : 'widget.moduledelbtn',
	type : 'minus',
	tooltip : '删除',
	callback : function(grid, tool, event) {
		var selModel = grid.getSelectionModel();
		if (selModel.hasSelection()) {
			var selected = selModel.getSelection();
			var store = grid.store;
			Ext.Array.each(selected, function(item) {
				store.remove(item);
			});
		}
	}
});