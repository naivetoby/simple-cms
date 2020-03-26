Ext.define('OA.view.core.module.ModuleColumnsDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.modulecolumnsdialog',
	items : [ {
		xtype : 'form',
		border : false,
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70
		},
		items : [ {
			xtype : 'textfield',
			name : 'text',
			fieldLabel : "列标题",
			allowBlank : false
		}, {
			xtype : 'textfield',
			name : 'dataIndex',
			fieldLabel : "字段名",
			vtype : 'alphanum',
			allowBlank : false
		}, {
			xtype : 'numberfield',
			name : 'flex',
			fieldLabel : '列宽权重',
			minValue : 1,
			value : 1,
			allowBlank : false
		}, {
			layout : 'column',
			border : false,
			items : [ {
				layout : 'column',
				border : false,
				columnWidth : .45,
				style : 'padding-top:5px;',
				items : [ {
					id : 'module_columns_has_renderer',
					name : 'hasRenderer',
					style : 'padding-top:6px',
					xtype : 'checkboxfield',
					boxLabel : 'Renderer方法',
					checked : true,
					listeners : {
						change : function(self, newValue, oldValue, eOpts) {
							var renderer = Ext.getCmp('module_columns_renderer_field');
							if (newValue) {
								renderer.setDisabled(false);
							} else {
								renderer.setDisabled(true);
							}
						}
					}
				} ]
			}, {
				columnWidth : .55,
				layout : 'form',
				border : false,
				items : [ {
					id : 'module_columns_renderer_field',
					xtype : 'textfield',
					name : 'renderer',
					disabledCls : 'field-readonly-text',
					disabled : true,
					allowBlank : false
				} ]
			} ]
		}, {
			layout : 'column',
			border : false,
			items : [ {
				layout : 'column',
				border : false,
				columnWidth : 1,
				style : 'padding-top:5px;',
				items : [ {
					id : 'module_columns_sortable',
					name : 'sortable',
					style : 'padding-top:6px',
					xtype : 'checkboxfield',
					boxLabel : '可排序',
					checked : true,
					value : true
				} ]
			} ]
		}, {
			xtype : 'textareafield',
			fieldLabel : '扩展项',
			name : 'extraParam',
			emptyText : '可根据ExtJS4 Ext.grid.Column的API添加更多属性，编写格式为JSON',
			grow : true
		} ]
	} ],
	listeners : {
		beforerender : function(obj, eOpts) {
			var record = obj.down('form').getRecord();
			if (!record || !record.get('renderer') || record.get('renderer') == '——') {
				Ext.getCmp('module_columns_renderer_field').setValue('');
				Ext.getCmp('module_columns_has_renderer').setValue(false);
			}
			if (record && record.get('sortable')) {
				Ext.getCmp('module_columns_sortable').setValue(true);
			}
		}
	},
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		action : 'save_columns'
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});