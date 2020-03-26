Ext.define('OA.view.core.module.ModuleDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.moduledialog',
	title : '新增模块',
	width : 612,
	hasPanel : true,
	autoScroll : true,
	readOnlyPanelConfig : {
		overflowY : 'scroll',
		maxHeight : 410
	},
	items : [ {
		xtype : 'form',
		border : false,
		labelAlign : 'center',
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70
		},
		items : [ {
			name : 'indexNumber',
			xtype : 'textfield',
			hidden : true
		}, {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [ {
					xtype : 'textfield',
					name : 'moduleName',
					fieldLabel : '模块名称',
					allowBlank : false
				} ]
			}, {
				columnWidth : .1,
				height : 24,
				border : false
			}, {
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [ {
					id : 'module_Module',
					xtype : 'textfield',
					name : 'module',
					vtype : 'alphanum',
					exist : false,
					validator : function(value) {
						if (this.exist) {
							return 'Module已存在';
						} else {
							return true;
						}
					},
					fieldLabel : 'Module',
					enableKeyEvents : true,
					listeners : {
						change : function(field) {
							var _value = field.getValue();
							var win = field.up('window');
							var record = win.record;
							if (record && record.get('module') == _value) {
								return;
							}
							BaseUtil.request({
								url : 'module/checkModule',
								params : {
									module : _value
								},
								success : function(response) {
									if (response.responseText > 0) {
										field.exist = true;
									} else {
										field.exist = false;
									}
									field.validate();
									var module_store = Ext.getCmp('module_Store');
									var module_Controller = Ext.getCmp('module_Controller');
									module_store.setValue(_value.trim() != '' ? (module_store.getValue().substring(0, module_store.getValue().lastIndexOf('.') + 1) + _value + 's') : '');
									module_Controller.setValue(_value.trim() != '' ? (module_Controller.getValue().substring(0, module_Controller.getValue().lastIndexOf('.') + 1) + _value + 'Controller') : '');
								}
							});
						}
					},
					allowBlank : false
				} ]
			} ]
		}, {
			id : 'module_Store_Controller',
			layout : 'column',
			border : false,
			hidden : true,
			items : [ {
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [ {
					id : 'module_Store',
					xtype : 'textfield',
					name : 'store',
					disabled : true,
					fieldLabel : 'Store',
					allowBlank : false
				} ]
			}, {
				columnWidth : .1,
				height : 24,
				border : false
			}, {
				layout : 'form',
				border : false,
				columnWidth : .45,
				items : [ {
					id : 'module_Controller',
					xtype : 'textfield',
					name : 'controller',
					disabled : true,
					fieldLabel : 'Controller',
					allowBlank : false
				} ]
			} ]
		}, {
			layout : 'column',
			border : false,
			items : [ {
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [ {
					id : 'module_parent_combo',
					xtype : 'modulecombo',
					value : 0,
					readOnlyCls : 'field-readonly-text',
					allowBlank : false
				} ]
			}, {
				columnWidth : .1,
				height : 24,
				border : false
			}, {
				layout : 'form',
				border : false,
				columnWidth : .45,
				items : [ {
					id : 'module_view_type_combo',
					xtype : 'combo',
					name : 'viewType',
					fieldLabel : '模块类型',
					readOnlyCls : 'field-readonly-text',
					allowBlank : false,
					value : 1,
					editable : false,
					valueField : 'value',
					displayField : 'text',
					store : new Ext.data.ArrayStore({
						fields : [ 'value', 'text' ],
						data : [ [ 1, '目录' ], [ 2, '功能模块' ], [ 3, '自定义模块' ] ]
					}),
					listeners : {
						change : function(self, newValue, oldValue, eOpts) {
							var _store = Ext.getCmp('module_Store');
							var _controller = Ext.getCmp('module_Controller');
							var _module_Store_Controller = Ext.getCmp('module_Store_Controller');
							var _module_bottom_grid = Ext.getCmp('module_bottom_grid');
							var _module_bottom_default_grid = Ext.getCmp('module_bottom_default_grid');
							var dialog = self.up('moduledialog');
							if (newValue == 2) {
								_module_Store_Controller.setVisible(true);
								_store.setDisabled(false);
								_controller.setDisabled(false);
								_module_bottom_default_grid.setDisabled(true);
								_module_bottom_default_grid.setVisible(false);
								_module_bottom_grid.setVisible(true);
								_module_bottom_grid.setDisabled(false);
								dialog.setHeight(519);
							} else {
								_module_bottom_grid.setDisabled(true);
								_module_bottom_grid.setVisible(false);
								if (newValue == 3) {
									_module_Store_Controller.setVisible(true);
									_store.setDisabled(false);
									_controller.setDisabled(false);
									dialog.setHeight(247);
									_module_bottom_default_grid.setVisible(true);
									_module_bottom_default_grid.setDisabled(false);
								} else {
									_store.setDisabled(true);
									_controller.setDisabled(true);
									_module_Store_Controller.setVisible(false);
									_module_bottom_default_grid.setDisabled(true);
									_module_bottom_default_grid.setVisible(false);
									dialog.setHeight(189);
								}
							}
						}
					}
				} ]
			} ]
		}, {
			id : 'module_bottom_default_grid',
			xtype : 'form',
			border : false,
			height : 30,
			hidden : true,
			disabled : true,
			items : [ {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .45,
					layout : 'form',
					border : false,
					items : [ {
						id : 'module_grid_name',
						name : 'gridName',
						xtype : 'textfield',
						fieldLabel : '视图类名',
						allowBlank : false
					} ]
				}, {
					columnWidth : .1,
					height : 24,
					border : false
				}, {
					columnWidth : .45,
					layout : 'form',
					border : false,
					items : [ {
						id : 'module_grid_alias',
						name : 'gridAlias',
						vtype : 'alphanum',
						xtype : 'textfield',
						fieldLabel : '视图别名',
						allowBlank : false
					} ]
				} ]
			} ]
		}, {
			layout : 'column',
			border : false,
			items : [ {
				layout : 'column',
				border : false,
				columnWidth : .45,
				style : 'padding-top:5px;',
				items : [ {
					id : 'module_has_icon',
					name : 'hasIcon',
					style : 'padding-top:6px',
					xtype : 'checkboxfield',
					boxLabel : '自定义图标',
					listeners : {
						change : function(self, newValue, oldValue, eOpts) {
							var icon = Ext.getCmp('module_Icon');
							if (newValue) {
								icon.setDisabled(false);
							} else {
								icon.setDisabled(true);
							}
						}
					}
				} ]
			}, {
				columnWidth : .1,
				height : 30,
				border : false
			}, {
				columnWidth : .45,
				layout : 'form',
				border : false,
				items : [ {
					id : 'module_Icon',
					xtype : 'textfield',
					name : 'icon',
					disabledCls : 'field-readonly-text',
					disabled : true,
					fieldLabel : '图标路径',
					allowBlank : false
				} ]
			} ]
		}, {
			id : 'module_bottom_grid',
			xtype : 'form',
			border : false,
			hidden : true,
			disabled : true,
			items : [ {
				layout : 'column',
				border : false,
				items : [ {
					layout : 'column',
					border : false,
					columnWidth : .45,
					items : [ {
						id : 'module_has_form',
						name : 'hasForm',
						style : 'margin-top:4px;',
						xtype : 'checkboxfield',
						boxLabel : '绑定表单',
						listeners : {
							change : function(self, newValue, oldValue, eOpts) {
								var formView = Ext.getCmp('module_form_view');
								var formName = Ext.getCmp('module_form_name');
								var formAlias = Ext.getCmp('module_form_alias');
								if (newValue) {
									formView.setDisabled(false);
									formName.setDisabled(false);
									formAlias.setDisabled(false);
								} else {
									formView.setDisabled(true);
									formName.setDisabled(true);
									formAlias.setDisabled(true);
								}
							}
						}
					} ]
				}, {
					columnWidth : .1,
					height : 30,
					border : false
				}, {
					layout : 'form',
					border : false,
					columnWidth : .45,
					items : [ {
						id : 'module_form_view',
						name : 'view',
						xtype : 'combo',
						fieldLabel : '表单类型',
						allowBlank : false,
						value : 'dialog',
						editable : false,
						disabledCls : 'field-readonly-text',
						disabled : true,
						valueField : 'value',
						displayField : 'text',
						store : new Ext.data.ArrayStore({
							fields : [ 'value', 'text' ],
							data : [ [ 'dialog', '对话框' ], [ 'form', '标签页' ] ]
						})
					} ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .45,
					layout : 'form',
					border : false,
					items : [ {
						id : 'module_form_name',
						name : 'formName',
						xtype : 'textfield',
						fieldLabel : '表单类名',
						allowBlank : false,
						disabledCls : 'field-readonly-text',
						disabled : true
					} ]
				}, {
					columnWidth : .1,
					height : 24,
					border : false
				}, {
					columnWidth : .45,
					layout : 'form',
					border : false,
					items : [ {
						id : 'module_form_alias',
						name : 'formAlias',
						vtype : 'alphanum',
						xtype : 'textfield',
						fieldLabel : '表单别名',
						allowBlank : false,
						disabledCls : 'field-readonly-text',
						disabled : true
					} ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					layout : 'form',
					border : false,
					columnWidth : .45,
					items : [ {
						id : 'module_page_size',
						xtype : 'combo',
						name : 'pageSize',
						fieldLabel : '默认分页',
						allowBlank : false,
						value : 10,
						editable : false,
						valueField : 'value',
						displayField : 'text',
						store : new Ext.data.ArrayStore({
							fields : [ 'value', 'text' ],
							data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ], [ 80, '80条/页' ] ]
						})
					} ]
				}, {
					columnWidth : .1,
					height : 30,
					border : false
				}, {
					columnWidth : .45,
					height : 30,
					border : false
				} ]
			}, {
				xtype : 'form',
				border : false,
				anchor : '100%',
				items : [ {
					id : 'module_tools_grid',
					border : true,
					autoScroll : true,
					title : '组件设置',
					header : true,
					multiSelect : true,
					xtype : 'gridpanel',
					layout : 'fit',
					/* width : 588, */
					minHeight : 88,
					cls : 'default-data-grid',
					viewConfig : {
						plugins : {
							ptype : 'gridviewdragdrop',
							ddGroup : 'DragDropGroup'
						}
					},
					listeners : {
						itemdblclick : function(grid, record) {
							var dialog = Ext.getCmp('edit_dialog_Module_tools');
							if (dialog) {
								// 销毁旧窗口，不然下拉框赋值有时候会出错
								dialog.destroy();
							}
							// 创建新窗口
							dialog = Ext.widget({
								id : 'edit_dialog_Module_tools',
								xtype : 'moduletoolsdialog',
								title : '编辑组件列'
							});
							var form = dialog.down('form');
							form.isAdd = false;
							form.loadRecord(record);
							dialog.show();
						}
					},
					tools : [ {
						xtype : 'moduleaddtoolbtn',
						style : {
							'marginRight' : '2px'
						}
					}, {
						xtype : 'moduledelbtn',
						style : {
							'marginRight' : '2px'
						}
					} ],
					columns : [ {
						text : '组件名',
						dataIndex : 'text',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '组件类名',
						dataIndex : 'name',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '组件别名',
						dataIndex : 'alias',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '最低权限',
						dataIndex : 'auth',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1,
						renderer : function(value) {
							return value == 1 ? '读写' : '只读';
						}
					} ],
					store : Ext.create('Ext.data.Store', {
						id : 'module_tools_store',
						fields : [ 'text', 'name', 'alias', 'auth' ],
						data : {
							'items' : []
						},
						proxy : {
							type : 'memory',
							reader : {
								type : 'json',
								root : 'items'
							}
						}
					})
				} ]
			}, {
				xtype : 'form',
				border : false,
				anchor : '100%',
				items : [ {
					id : 'module_columns_grid',
					border : true,
					autoScroll : true,
					title : '表单设置',
					header : true,
					multiSelect : true,
					xtype : 'gridpanel',
					layout : 'fit',
					/* width : 588, */
					minHeight : 88,
					cls : 'default-data-grid',
					viewConfig : {
						plugins : {
							ptype : 'gridviewdragdrop',
							ddGroup : 'DragDropGroup'
						}
					},
					listeners : {
						itemdblclick : function(grid, record) {
							var dialog = Ext.getCmp('edit_dialog_Module_columns');
							if (dialog) {
								// 销毁旧窗口，不然下拉框赋值有时候会出错
								dialog.destroy();
							}
							// 创建新窗口
							dialog = Ext.widget({
								id : 'edit_dialog_Module_columns',
								xtype : 'modulecolumnsdialog',
								title : '编辑表单列'
							});
							var form = dialog.down('form');
							form.isAdd = false;
							form.loadRecord(record);
							dialog.show();
						}
					},
					tools : [ {
						xtype : 'moduleaddcolumnbtn',
						style : {
							'marginRight' : '2px'
						}
					}, {
						xtype : 'moduledelbtn',
						style : {
							'marginRight' : '2px'
						}
					} ],
					columns : [ {
						text : '列标题',
						dataIndex : 'text',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '字段名',
						dataIndex : 'dataIndex',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '列宽权重',
						dataIndex : 'flex',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1
					}, {
						text : '可排序',
						dataIndex : 'sortable',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 1,
						renderer : function(value) {
							return value ? '是' : '否';
						}
					}, {
						text : 'Renderer方法',
						dataIndex : 'renderer',
						align : 'center',
						sortable : false,
						menuDisabled : true,
						flex : 2
					} ],
					store : Ext.create('Ext.data.Store', {
						id : 'module_columns_store',
						fields : [ 'text', 'dataIndex', 'flex', 'renderer', 'sortable', 'extraParam' ],
						data : {
							'items' : []
						},
						proxy : {
							type : 'memory',
							reader : {
								type : 'json',
								root : 'items'
							}
						}
					})
				} ]
			} ]
		} ]
	} ],
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		action : 'save_Module'
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});