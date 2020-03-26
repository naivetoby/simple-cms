Ext.define('OA.controller.core.module.ModuleController', {
	extend : 'Ext.app.Controller',
	init : function() {
		var self = this;
		self.control({
			'moduledialog' : {
				beforerender : self.initRender
			},
			'datagrid[id=grid_view_Module]' : {
				itemdblclick : self.showEditDialog,
				itemclick : self.toggleDelBtn
			},
			'moduledialog button[action=save_Module]' : {
				click : self.submitData
			},
			'moduletoolsdialog button[action=save_tools]' : {
				click : self.submitToolsData
			},
			'modulecolumnsdialog button[action=save_columns]' : {
				click : self.submitColumnsData
			}
		});
	},
	requires : [ 'OA.store.core.module.ModuleDirs' ],
	models : [ 'core.module.Module', 'core.module.ModuleColumn', 'core.module.ModuleTool' ],
	stores : [ 'core.module.Modules' ],
	views : [ 'core.DataGrid', 'core.module.ModuleDialog', 'core.module.ModuleCombo', 'core.module.ModuleAuthCombo', 'core.module.ModuleViewTypeCombo', 'core.module.ModuleAddToolBtn', 'core.module.ModuleAddColumnBtn', 'core.module.ModuleDelBtn', 'core.module.ModuleColumnsDialog', 'core.module.ModuleToolsDialog' ],
	showEditDialog : function(grid, record) {
		// 模块类型
		var viewType = record.get('viewType');
		// 只读标识
		var formReadOnly = !grid.panel.authValue || grid.panel.authValue != 1 || (!isDevelopment && viewType < 0);
		var dialog = Ext.getCmp('edit_dialog_Module');
		if (dialog) {
			// 销毁旧窗口，不然下拉框赋值有时候会出错
			dialog.destroy();
		}
		// 创建新窗口
		dialog = Ext.widget({
			id : 'edit_dialog_Module',
			xtype : 'moduledialog',
			title : formReadOnly ? '查看模块' : '编辑模块',
			record : record,
			formReadOnly : formReadOnly
		});
		var form = dialog.down('form');
		form.isAdd = false;
		form.loadRecord(record);
		// 设置表单只读
		if (formReadOnly) {
			dialog.setFormReadOnly();
		}
		// 显示
		dialog.show();
		// 控制编辑dialog的高度
		if (Math.abs(viewType) == 2) {
			dialog.setHeight(490);
		}
	},
	toggleDelBtn : function(grid, record) {
		var delBtn = grid.panel.down('deltool');
		if (delBtn && record) {
			if (record.get('viewType') < 0) {
				delBtn.setDisabled(true);
			} else {
				delBtn.setDisabled(false);
			}
		}
	},
	submitData : function(button) {
		// 获取对话框对象
		var win = button.up('window');
		// 获取表单对象
		var form = win.down('form');
		if (form.isDisabled()) {
			// 关闭对话框
			win.close();
			return;
		}
		if (form.isValid()) {// 判断表单是否通过验证
			var store = this.getCoreModuleModulesStore();
			var _data = this.convertData(form.getValues());
			if (form.isAdd) {
				// 新增
				store.add(Ext.create('OA.model.core.module.Module', _data));
			} else {
				// 编辑
				form.getRecord().set(_data);
			}
			// 关闭对话框
			win.close();
			// 提交数据
			store.sync();
		}
	},
	submitToolsData : function(button) {
		var win = button.up('window');
		var form = win.down('form');
		var store = Ext.data.StoreManager.lookup('module_tools_store');
		if (form.isValid() && store) {
			var _data = form.getValues();
			if (form.isAdd) {// 新增
				store.add(Ext.create('OA.model.core.module.ModuleTool', _data));
			} else {// 编辑
				form.getRecord().set(_data);
			}
			win.close();
		}
	},
	submitColumnsData : function(button) {
		var win = button.up('window');
		var form = win.down('form');
		var store = Ext.data.StoreManager.lookup('module_columns_store');
		if (form.isValid() && store) {
			var _data = form.getValues();
			if (_data.hasRenderer) {
				delete _data.hasRenderer;
			}
			if (!_data.renderer || _data.renderer.trim() == '') {
				_data.renderer = '——';
			}
			if (_data.sortable) {
				_data.sortable = true;
			} else {
				_data.sortable = false;
			}
			_data.flex = parseInt(_data.flex);
			if (form.isAdd) {// 新增
				store.add(Ext.create('OA.model.core.module.ModuleColumn', _data));
			} else {// 编辑
				form.getRecord().set(_data);
			}
			win.close();
		}
	},
	// 初始化下拉框的默认数据
	initRender : function(obj, eOpts) {
		var _module_tools_store = Ext.data.StoreManager.lookup('module_tools_store');
		if (_module_tools_store) {
			_module_tools_store.removeAll(false);
		}
		var _module_columns_store = Ext.data.StoreManager.lookup('module_columns_store');
		if (_module_columns_store) {
			_module_columns_store.removeAll(false);
		}
		var form = obj.down('form');
		if (form.isAdd) {
			_module_tools_store.add([ {
				text : '添加按钮',
				name : 'OA.parts.core.gridtools.AddTool',
				alias : 'addtool',
				auth : 1
			}, {
				text : '删除按钮',
				name : 'OA.parts.core.gridtools.DelTool',
				alias : 'deltool',
				auth : 1
			}, {
				text : '查询按钮',
				name : 'OA.parts.core.gridtools.FilterTool',
				alias : 'filtertool',
				auth : 0
			}, {
				text : '导出Excel',
				name : 'OA.parts.core.gridtools.ExcelTool',
				alias : 'exceltool',
				auth : 0
			} ]);
		}
		var record = form.getRecord();
		if (record) {
			var _parent_combo = Ext.getCmp('module_parent_combo');
			var _leaf_combo = Ext.getCmp('module_view_type_combo');
			_parent_combo.setValue(Ext.create('OA.model.core.module.Module', {
				moduleId : record.get('parentId'),
				moduleName : record.get('parentName')
			}));
			var viewType = Math.abs(record.get('viewType') || 0);
			_leaf_combo.setValue(viewType);
			var _icon = record.get('icon');
			if (_icon) {
				Ext.getCmp('module_has_icon').setValue(true);
				Ext.getCmp('module_Icon').setValue(_icon);
			}
			if (viewType == 1) {
				_parent_combo.setReadOnly(true);
				_leaf_combo.setReadOnly(true);
			} else {
				var _oldData = Ext.JSON.decode(BaseUtil.BASE64.decoder2(record.get('viewInfo')).replace(/"renderer":([^"]+),/g, '"renderer":\"$1\",'));
				Ext.getCmp('module_Store').setValue(_oldData.store);
				Ext.getCmp('module_Controller').setValue(_oldData.controller);
				// 自定义模块
				if (viewType == 3) {
					Ext.getCmp('module_grid_name').setValue(_oldData.gridName);
					Ext.getCmp('module_grid_alias').setValue(_oldData.gridAlias);
				} else if (viewType == 2) {
					Ext.getCmp('module_page_size').setValue(_oldData.config.pageSize);
					var _form = _oldData.config.form;
					if (_form) {
						Ext.getCmp('module_has_form').setValue(true);
						Ext.getCmp('module_form_view').setValue(_form.view);
						Ext.getCmp('module_form_name').setValue(_form.name);
						Ext.getCmp('module_form_alias').setValue(_form.alias);
					}
					if (_module_tools_store) {
						var _tools = _oldData.config.tools;
						for ( var i in _tools) {
							var _record = _tools[i];
							_module_tools_store.add(_record);
						}
					}
					if (_module_columns_store) {
						var _columns = _oldData.config.columns;
						for ( var i in _columns) {
							var _record = _columns[i];
							if (!_record.renderer || _record.renderer == '') {
								_record.renderer = '——';
							}
							_module_columns_store.add(_record);
						}
					}
				}
			}
			Ext.getCmp('module_Module').exist = false;
		}
	},
	convertData : function(_oldData) {
		var _viewInfo = '';
		if (_oldData.viewType == 2) {
			var _config = {
				pageSize : _oldData.pageSize
			};
			if (_oldData.hasForm) {
				_config.form = {
					view : _oldData.view,
					name : _oldData.formName,
					alias : _oldData.formAlias
				};
			}
			var toolsStore = Ext.data.StoreManager.lookup('module_tools_store');
			if (toolsStore) {
				var _tools = [];
				toolsStore.each(function(record) {
					_tools.push(record.data);
				});
				_config.tools = _tools;
			}
			var columnsStore = Ext.data.StoreManager.lookup('module_columns_store');
			if (columnsStore) {
				var _columns = [];
				columnsStore.each(function(record) {
					var columnConfig = record.data;
					if (columnConfig.renderer && (columnConfig.renderer == '——' || columnConfig.renderer.trim() == '')) {
						delete columnConfig.renderer;
					}
					var extraParam = record.get('extraParam');
					if (extraParam) {
						columnConfig = Ext.applyIf(columnConfig, Ext.JSON.decode(extraParam));
					}
					_columns.push(columnConfig);
				});
				_config.columns = _columns;
			}
			_viewInfo = BaseUtil.BASE64.encoder(Ext.JSON.encode({
				store : _oldData.store,
				controller : _oldData.controller,
				config : _config
			}).replace(/"renderer":"([^"]+)"/g, '"renderer\":$1'));
		} else if (_oldData.viewType == 3) {
			_viewInfo = BaseUtil.BASE64.encoder(Ext.JSON.encode({
				store : _oldData.store,
				controller : _oldData.controller,
				gridName : _oldData.gridName,
				gridAlias : _oldData.gridAlias
			}));
		}
		return {
			moduleName : _oldData.moduleName,
			parentId : _oldData.parentId,
			viewType : _oldData.viewType,
			indexNumber : _oldData.indexNumber,
			module : _oldData.module,
			viewInfo : _viewInfo,
			icon : _oldData.icon
		};
	}
});