Ext.define('OA.view.core.role.RoleUserDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.roleuserdialog',
	id : 'role_user_dialog',
	width : 450,
	height : 500,
	hasPanel : false,
	bodyPadding : 0,
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	// 自定义属性：当前选中的数据
	record : null,
	items : [ {
		// 主要Panel(border布局，只有一个'center'层)
		xtype : 'panel',
		flex : 3,
		layout : 'border',
		border : false,
		bodyStyle : 'background:#dfeaf2',
		style : {
			borderTop : '1px solid #157fcc' // 上边框
		},
		items : [ {
			// center中间层
			xtype : 'panel',
			region : 'center',
			margin : '0 12 0 12 ', // 外边距
			border : false,
			style : {
				borderBottom : '1px solid #c0c0c0' // 下边框
			},
			layout : {
				type : 'hbox', // 垂直盒子分布
				align : 'stretch' // 设置flex拉伸
			},
			// 中间层的组件(左，中，右3个Panel)
			items : [ {
				// 左边Panel
				xtype : 'panel',
				flex : 6,
				border : false,
				minWidth : 140,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				// 左边Panel的组件(上，下两个Panel)
				items : [ {
					xtype : 'panel',
					height : 45,
					border : false,
					bodyStyle : 'background:#dfeaf2',
					layout : {
						type : 'vbox',
						align : 'left',
						pack : 'center'
					},
					bodyStyle : 'background:#dfeaf2;font-size:13.5px;padding-left:5px;',
					// 左边Grid说明描述
					items : [ {
						xtype : 'label',
						text : '待配置用户:',
						width : 80
					} ]
				}, {
					// 左边Grid
					xtype : 'rudleftgrid'
				} ]
			}, {
				// 中间放按钮的Panel
				xtype : 'panel',
				width : 100,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				border : false,
				bodyStyle : 'background:#dfeaf2',
				items : [ {
					xtype : 'panel',
					height : 45.9,
					border : false,
					style : {
						borderBottom : '1px solid #c0c0c0'
					},
					bodyStyle : 'background:#dfeaf2'
				}, {
					xtype : 'panel',
					flex : 1,
					border : false,
					bodyStyle : 'background:#dfeaf2',
					// 以下嵌套3层Panel,分为上，中，下
					items : [ {
						// 上层Panel
						// anchor : '100% 45%',
						border : false,
						bodyStyle : 'background:#dfeaf2',
						layout : {
							type : 'vbox',
							align : 'stretch'
						},
						// 按钮组件
						items : [ {
							xtype : 'button',
							btnGroup : 'bind_user',
							id : 'bind_user_btn',
							text : '>',
							disabled : true,
							disabledCls : 'color:#2a6d9e',
							margin : '30 20 10 20'
						}, {
							xtype : 'button',
							btnGroup : 'remove_user',
							id : 'remove_user_btn',
							text : '<',
							disabled : true,
							disabledCls : 'color:#2a6d9e',
							margin : '20 20 10 20'
						}, {
							xtype : 'button',
							btnGroup : 'bind_user',
							id : 'bind_all_user_btn',
							text : '>>',
							disabledCls : 'color:#2a6d9e',
							margin : '20 20 10 20'

						}, {
							xtype : 'button',
							btnGroup : 'remove_user',
							id : 'remove_all_user_btn',
							text : '<<',
							disabledCls : 'color:#2a6d9e',
							margin : '20 20 10 20'
						} ]
					} ]
				} ]
			}, {
				xtype : 'panel',
				flex : 6,
				border : false,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [ {
					xtype : 'panel',
					height : 45,
					border : false,
					layout : {
						type : 'vbox',
						align : 'left',
						pack : 'center'
					},
					bodyStyle : 'background:#dfeaf2;font-size:13.5px;padding-left:5px;',
					// 右边Grid说明描述
					items : [ {
						xtype : 'label',
						text : '已配置用户:',
						width : 80
					} ]
				}, {
					// 右边grid
					xtype : 'rudrightgrid'
				} ]
			} ]
		} ]
	} ],
	buttons : [ {
		text : '确定',
		scale : 'medium',
		action : 'save_Role_User'
	}, {
		text : '关闭',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});