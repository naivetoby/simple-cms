Ext.define('OA.parts.core.gridtools.SortTool', {
	extend : 'Ext.button.Button',
	alias : 'widget.sorttool',
	text : '排序',
	scale : 'small',
	iconCls : 'default_btn_icon_sort',
	dragdrop : false,
	handler : function(button, event) {
		var grid = button.up('datagrid');
		// 数据源
		var store = grid.store;
		// 拖拽排序插件
		var plugin = grid.getView().getPlugin('gridviewdragdrop');
		var page_toolbar = Ext.getCmp('grid_page_toolbar');
		var tob_toolbar = grid.getDockedItems('toolbar[dock=top]')[0];
		if (button.dragdrop) {
			if (store.getModifiedRecords().length > 0) {
				store.sync({
					callback : function(batch, options) {
						store.load({
							sorters : [ {
								property : 'indexNumber',
								direction : 'ASC'
							} ],
							start : (store.currentPage - 1) * store.pageSize,
							limit : store.pageSize,
							callback : function() {
								Ext.each(grid.columns, function(column) {
									column.sortable = column.oldsortable;
									delete column.oldsortable;
								});
								plugin.disable();
								page_toolbar.enable();
								tob_toolbar.items.each(function(item) {
									if (item != button) {
										item.setDisabled(false);
									}
								});
								button.dragdrop = false;
								button.setText('排序');
								BaseUtil.briefdialog('排序完成');
							}
						});
					}
				});
			} else {
				store.load({
					sorters : [ {
						property : 'indexNumber',
						direction : 'ASC'
					} ],
					start : (store.currentPage - 1) * store.pageSize,
					limit : store.pageSize,
					callback : function() {
						Ext.each(grid.columns, function(column) {
							column.sortable = column.oldsortable;
							delete column.oldsortable;
						});
						plugin.disable();
						page_toolbar.enable();
						tob_toolbar.items.each(function(item) {
							if (item != button) {
								item.setDisabled(false);
							}
						});
						button.dragdrop = false;
						button.setText('排序');
					}
				});
			}
		} else {
			store.load({
				start : 0,
				limit : store.getTotalCount(),
				callback : function() {
					var _offset = 0;
					store.each(function(record) {
						_offset = _offset + 1;
						record.set('indexNumber', _offset);
					});
					Ext.each(grid.columns, function(column) {
						column.oldsortable = column.sortable;
						column.sortable = false;
					});
					plugin.enable();
					page_toolbar.disable();
					tob_toolbar.items.each(function(item) {
						if (item != button) {
							item.setDisabled(true);
						}
					});
					button.dragdrop = true;
					button.setText('保存排序');
				}
			});
		}
	},
	initComponent : function() {
		this.callParent(arguments);
	}
});