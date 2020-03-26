Ext.define('OA.view.core.DataGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.datagrid',
	layout : 'fit',
	selType : 'checkboxmodel',
	multiSelect : true,
	border : false,
	cls : 'default-data-grid',
	initComponent : function() {
		var self = this;
		var oldGrid = Ext.getCmp('grid_view_' + this.moduleName);

		if (oldGrid) {// 判断是否曾经打开过当前模块的grid视图
			// 销毁旧视图，否则id冲突
			oldGrid.destroy();
		}

		var store = self.store;
		var pageSize = self.pageSize;

		// 按钮工具栏
		var tools = [ {
			xtype : 'backtool'
		}, '->' ];

		// 添加按钮工具栏
		if (self.gridConfig && self.gridConfig.tools) {
			Ext.Array.each(self.gridConfig.tools, function(tool) {
				if (self.authValue >= tool.auth) {
					tools.push({
						xtype : tool.alias
					});
				}
			});
		}

		// 拖动插件以及按钮
		if (self.store.sortPlugin) {
			tools.push(Ext.create('OA.parts.core.gridtools.SortTool'));
			self.viewConfig = {
				plugins : {
					ptype : 'gridviewdragdrop',
					pluginId : 'gridviewdragdrop',
					ddGroup : 'DragDropGroup'
				},
				listeners : {
					drop : function(node, data, overModel, dropPosition, eOpts) {
						var _store = overModel.store;
						var _offset = 0;
						_store.each(function(record) {
							_offset = _offset + 1;
							record.set('indexNumber', _offset);
						});
					}
				}
			};
		}

		self.dockedItems = [];

		// 添加顶部按钮工具栏
		self.dockedItems.push({
			id : 'grid_button_toolbar',
			xtype : 'toolbar',
			width : '100%',
			height : 40,
			dock : 'top',
			items : tools
		});

		// 添加底部分页栏
		self.dockedItems.push({
			id : 'grid_page_toolbar',
			xtype : 'pagingtoolbar',
			store : store,
			pageSize : pageSize,
			dock : 'bottom',
			displayInfo : true,
			plugins : Ext.create('Ext.ux.ProgressBarPager'),
			items : [ {
				mode : 'local',
				name : 'pagesize',
				width : 85,
				xtype : 'combo',
				value : pageSize,
				editable : false,
				typeAhead : false,
				hiddenName : 'pagesize',
				valueField : 'value',
				displayField : 'text',
				triggerAction : 'all',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ], [ 80, '80条/页' ] ]
				}),
				listeners : {
					select : function(combo, records, eOpts) {
						store.pageSize = combo.getValue();
						store.currentPage = 1;
						store.load({
							params : {
								start : 0,
								limit : store.pageSize
							}
						});
					}
				}
			} ]
		});

		this.callParent(arguments);
	}
});