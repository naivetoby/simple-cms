Ext.define('OA.controller.core.role.RoleController', {
	extend : 'Ext.app.Controller',
	models : [ 'core.role.Role' ],
	stores : [ 'core.role.Roles', 'core.role.RoleBindUsers', 'core.role.RoleUnBoundUsers', 'core.role.RoleAuths', 'core.role.UpdateUser4ImportantRoles' ],
	views : [ 'core.DataGrid', 'core.role.RoleMenu', 'core.role.RoleDialog', 'core.role.RoleUserDialog', 'core.role.UpdateUser4ImportantRoleDialog', 'core.role.RUDLeftGrid', 'core.role.RUDRightGrid', 'core.role.RoleAuthDialog', 'core.role.RoleAuthTreePanel', 'core.role.ImportantRole4UserCombo' ],
	refs : [ {
		ref : 'roleUser',
		selector : 'roleuserdialog'
	}, {
		ref : 'dataGrid',
		selector : 'datagrid[id=grid_view_Role]'
	} ],

	init : function() {
		this.control({
			'datagrid[id=grid_view_Role]' : {
				itemdblclick : this.showEditDialog,
				itemcontextmenu : this.showMenu,
				selectionchange : this.selectionchange4DataGrid
			},
			'roleuserdialog' : {
				afterlayout : this.loadData
			},
			'rudleftgrid' : {
				select : this.select4RUDLeftGrid,
				selectionchange : this.selectionchange4RUDLeftGrid
			},
			'rudrightgrid' : {
				select : this.select4RUDRightGrid,
				selectionchange : this.selectionchange4RUDRightGrid
			},
			'roledialog button[action=save_Role]' : {
				click : this.submitData
			},
			'roleuserdialog button[action=save_Role_User]' : {
				click : this.saveRoleUser
			},
			'roleuserdialog button[btnGroup=bind_user]' : {
				click : this.bindUser
			},
			'roleuserdialog button[btnGroup=remove_user]' : {
				click : this.removeUser
			},
			'roleauthdialog button[action=save_Role_Auth]' : {
				click : this.saveRoleAuth
			},
			'updateuser4importantroledialog button[action=update_user_4important_role]' : {
				click : this.updateUser4ImportantRole
			}
		});
	},
	selectionchange4DataGrid : function(rowModel, selected, eOpts) {
		var self = this;
		var deltool = self.getDataGrid().down('deltool');
		var flag = false;
		var roleName = '';
		for (var i = 0; i < selected.length; i++) {
			var roleType = selected[i].get('roleType');
			if (BaseUtil.isImportantRole(roleType)) {
				flag = true;
			} else if (selected[i].getId() < 0) {
				flag = true;
			}
			if (flag) {
				roleName = selected[i].get('roleName');
				break;
			}
		}
		var html = '<div style="font-size:10px">【 ' + roleName + ' 】无法删除</div>';
		if (flag) {
			deltool.setTooltip(html);
			deltool.setDisabled(true);
		} else {
			deltool.setDisabled(false);
			deltool.setTooltip();
		}
	},
	loadData : function(dialog) {
		var self = this;
		// 布局完成后
		var rudLGrid = dialog.down('rudleftgrid');
		var rudRGrid = dialog.down('rudrightgrid');
		var store1 = rudLGrid.store;
		var store2 = rudRGrid.store;
		var rec = dialog.record;
		var roleId = rec.get("roleId");
		var roleType = rec.get("roleType");
		store1.on('datachanged', function(store) {
			var bindOneBtn = Ext.getCmp('bind_user_btn');// 绑定单个用户按钮
			var bindAllBtn = Ext.getCmp('bind_all_user_btn');// 绑定全部按钮
			self.dataChanged(store, bindOneBtn, bindAllBtn);
		});
		store2.on('datachanged', function(store) {
			var removeOneBtn = Ext.getCmp('remove_user_btn');// 移除单个用户按钮
			var removeAllBtn = Ext.getCmp('remove_all_user_btn');// 移除全部按钮
			self.dataChanged(store, removeOneBtn, removeAllBtn);
		});
		store1.getProxy().setExtraParam('roleId', roleId);// 加上参数
		store2.getProxy().setExtraParam('roleId', roleId);// 加上参数
		store1.load();
		store2.load();
		if (BaseUtil.isImportantRole(roleType)) {
			dialog.down('#remove_all_user_btn').destroy();
			dialog.down('#bind_all_user_btn').destroy();
		}
	},
	// 左边grid数据选中事件
	select4RUDLeftGrid : function() {
		var dialog = this.getRoleUser();
		dialog.down('#bind_user_btn').setDisabled(false);// 绑定按钮生效
		dialog.down('#remove_user_btn').setDisabled(true);// 移除按钮失效
		dialog.down('rudrightgrid').getSelectionModel().deselectAll(true);// 右边grid取消选中;

	},
	// 右边grid数据选中事件
	select4RUDRightGrid : function() {
		var dialog = this.getRoleUser();
		dialog.down('#bind_user_btn').setDisabled(true);// 绑定按钮失效
		dialog.down('#remove_user_btn').setDisabled(false);// 移除按钮生效
		dialog.down('rudleftgrid').getSelectionModel().deselectAll(true);// 左边边grid取消选中;
	},
	// 左边grid选择改变事件
	selectionchange4RUDLeftGrid : function(rowModel, selected, eOpts) {
		if (Ext.isEmpty(selected)) {// 没有选中
			Ext.getCmp('bind_user_btn').setDisabled(true);// 按钮失效
		}
		var dialog = this.getRoleUser();
		var rec = dialog.record;
		var roleType = rec.get("roleType");
		var btn = dialog.down('#bind_user_btn');
		var num = dialog.down('rudrightgrid').store.getCount();
		if (BaseUtil.isImportantRole(roleType)) {
			if (selected.length > 1 || num > 0) {
				btn.setDisabled(true);// 绑定按钮失效
				var display = $('#briefdialog').css('display');
				if (display == 'none') {
					BaseUtil.briefdialog("该角色只能绑定一个用户", FinalVariables.WARNING_ICON, null, 6000);
				}
			} else if (selected.length == 1 && num == 0) {// 选中一个
				btn.setDisabled(false);// 绑定按钮生效
			}
		}
	},
	// 右边grid选择改变事件
	selectionchange4RUDRightGrid : function(rowModel, selected, eOpts) {
		if (Ext.isEmpty(selected)) {// 没有选中
			Ext.getCmp('remove_user_btn').setDisabled(true);// 按钮失效
		}
	},
	bindUser : function(button) {
		var leftStore = Ext.getCmp('rud_left_grid').store;
		var rightStore = Ext.getCmp('rud_right_grid').store;
		var removedRecords = rightStore.getRemovedRecords(); // 右边Grid删除数据的数组
		var datas = new Array();// 用来存放左边grid的store数据
		leftStore.each(function(data) {
			datas.push(data);
		});
		if (button.id == 'bind_user_btn') {
			var selModel = Ext.getCmp('rud_left_grid').getSelectionModel();
			var record = selModel.getSelection();
			// 遍历选中行的数据
			Ext.Array.each(record, function(selItem) {
				leftStore.remove(selItem);
				// 判断选中行的model是否存在在右边Grid删除数据的数组里
				if (Ext.Array.contains(removedRecords, selItem)) { // 如果存在
					selItem.phantom = false; // 这个model为旧的，不做新增
					Ext.Array.remove(removedRecords, selItem); // 从右边Grid删除数据的数组里删除这个model
				} else {
					selItem.phantom = true; // 这个model可以新增
				}
				rightStore.add(selItem);
			});
		} else if (button.id == 'bind_all_user_btn') {
			if (datas.length == 0) {
				return;
			}
			Ext.Array.each(datas, function(item) {
				if (Ext.Array.contains(removedRecords, item)) {
					item.phantom = false; // 这个model为旧的，不做新增
					Ext.Array.remove(removedRecords, item);// 从右边Grid删除数据的数组里删除这个model
				} else {
					item.phantom = true;// 这个model可以新增
				}
			});
			Ext.Array.each(datas, function(item) {
				rightStore.add(item);
				leftStore.remove(item);
			});
		}
	},
	removeUser : function(button) {
		var leftStore = Ext.getCmp('rud_left_grid').store;
		var rightStore = Ext.getCmp('rud_right_grid').store;
		var datas = new Array();// 用来存放右边grid的store数据
		rightStore.each(function(data) {
			datas.push(data);
		});
		if (button.id == 'remove_user_btn') {
			var selModel = Ext.getCmp('rud_right_grid').getSelectionModel();
			var record = selModel.getSelection();
			Ext.Array.each(record, function(selItem) {
				leftStore.add(selItem);
				rightStore.remove(selItem);
			});
		} else if (button.id == 'remove_all_user_btn') {
			if (datas.length == 0) {
				return;
			}
			Ext.Array.each(datas, function(item) {
				leftStore.add(item);
				rightStore.remove(item);
			});
		}
	},
	showEditDialog : function(grid, record) {
		var roleType = record.get('roleType');
		// 只读标识
		var formReadOnly = !grid.panel.authValue || grid.panel.authValue != 1 || BaseUtil.isImportantRole(roleType);
		var dialog = Ext.getCmp('edit_dialog_Role');
		if (dialog) {
			// 销毁旧窗口，不然下拉框赋值有时候会出错
			dialog.destroy();
		}

		// 创建新窗口
		dialog = Ext.widget({
			id : 'edit_dialog_Role',
			xtype : 'roledialog',
			title : formReadOnly ? '查看角色' : '编辑角色',
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
	},
	submitData : function(button) {
		// 获取对话框对象
		var win = button.up('window');
		// 获取表单对象
		var form = win.down('form');
		if (form.isValid()) {// 判断表单是否通过验证
			var store = this.getCoreRoleRolesStore();
			// 数据源对象
			if (form.isAdd) {// 新增
				store.add(Ext.create('OA.model.core.role.Role', form.getValues()));
			} else {// 编辑
				// 获取表单指向的角色信息
				var record = form.getRecord();
				// 获取表单当前值
				var values = form.getValues();
				// 更新角色信息
				record.set(values);
			}
			// 关闭对话框
			win.close();
			// 提交数据
			store.sync();
		}
	},
	showMenu : function(grid, record, item, index, e) {
		var menu = Ext.create('OA.view.core.role.RoleMenu', {
			record : record,
			authValue : grid.panel.authValue
		});
		// 阻塞原来的右击事件
		e.stopEvent();
		// 显示菜单
		menu.showAt(e.getXY());
	},
	// 保存角色用户关联关系
	saveRoleUser : function(button) {
		this.getCoreRoleRoleBindUsersStore().sync();
		button.up('window').close();
	},
	updateUser4ImportantRole : function(button) {
		var win = button.up('window');
		var record = win.record;
		var userId = win.down('combo').getValue();
		BaseUtil.request({
			url : 'role/roleUser/user4ImportantRole',
			params : {
				roleId : record.get('roleId'),
				userId : userId
			}
		});
		win.close();

	},
	// 保存角色权限关联关系
	saveRoleAuth : function(button) {
		var tree = button.up('roleauthdialog').down('checkboxtree');
		function get_data(nodes, key) {
			var o = {};
			for ( var i in nodes) {
				var node = nodes[i].data;
				var id = node.moduleId.toString();
				var pid = node.parentId != null ? node.parentId.toString() : null;
				if (pid == key) {
					delete nodes[i];
					if (node.leaf) {
						o[id] = Ext.getDom('switch_' + id).checked ? 1 : 0;
					} else {
						o[id] = get_data(nodes, id);
					}
				}
			}
			return o;
		}
		var data = {
			'0' : get_data(tree.getChecked(), '0')
		};
		button.up('window').record.set('authInfo', BaseUtil.BASE64.encoder(Ext.JSON.encode(data)));
		this.getCoreRoleRolesStore().sync();
		button.up('window').close();
	},
	dataChanged : function(store, btn4One, btn4All) {
		if (store.getCount() == 0) {
			if (!Ext.isEmpty(btn4One))
				btn4One.setDisabled(true);
			if (!Ext.isEmpty(btn4All))
				btn4All.setDisabled(true);
		} else {
			if (!Ext.isEmpty(btn4All))
				btn4All.setDisabled(false);
		}
	}
});