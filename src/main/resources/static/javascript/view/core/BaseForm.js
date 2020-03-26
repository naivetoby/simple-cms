/**
 * 所有表单的基类，全部表单对象都必须继承此类
 * 
 * @author 彭嘉辉
 */
Ext.define('OA.view.core.BaseForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.baseform',
	border : false,
	bodyPadding : 10,
	defaultType : 'textfield',
	items : null,
	uploadUuids : null,// 一组上传文件id
	canCirculate : false,
	canSeeReadedRecord : false,
	uploadFileUuids : '',
	model : '',// 非空
	url : '',// 非空
	callback : null,// 表单的全局回调函数
	listeners : {
		afterrender : function() {
			var uploadPanel = this.down('uploadpanel');
			if (!Ext.isEmpty(uploadPanel)) {
				this.hasUploadPanel = true;
				this.uploadPanels = this.query('uploadpanel');
			}
		}
	},
	initComponent : function(initData) {
		var self = this;
		self.id = 'base_form_' + self.id;
		self.callParent();
		self.getForm().addListener('beforeaction', function(form, action, eOpts) {
			action.url = self.url + '/submit';
		});
		self.initValues(initData);
		self.loadFormConfig();
		// 只读样式时去掉emptyText
		var fields = self.getForm().getFields().items;
		Ext.Array.forEach(fields, function(field) {
			if (field.readOnly) {
				Ext.apply(field, {
					emptyText : ''
				});
			}
		});
	},
	/**
	 * 保存上传文件，并建立索引
	 * 
	 * @param hasUploadPanel
	 * @param form
	 * 
	 */
	saveUploadFile : function(hasUploadPanel, form) {
		if (hasUploadPanel) {
			BaseUtil.uploadFile(form.uploadUuids.toString(), form.getRecord().getId(), form.url, form.model, form.$className, form.xtype);
		}
	},
	/**
	 * 表单保存 public
	 * 
	 * @param callback
	 *            Object/function
	 *            若是Object则格式为{success:function,callback:function}，callback参数为不管成功与否都执行的函数；若是function则为成功后的回调函数
	 */
	save : function(callback) {
		var self = this;
		var mainTab = Ext.getCmp(FinalVariables.MAIN_TAB);
		var activeTab = mainTab.getActiveTab();
		// 文件上传不能不空时的判断，没有上传不能提交
		if (self.necessaryUploadFile()) {
			return;
		}
		var modified = true;
		if (self.grid) {
			// 数据源对象
			var store = self.grid.store;
			var formBasic = self.getForm();
			if (self.isAdd) {// 新增
				// 日期处理
				formBasic.getFields().each(function(field) {
					if (field.xtype == 'datefield' || field.xtype == 'datetimefield') {
						field.submitFormat = 'U';
					}
				});
				var values = self.getValues();
				var record = Ext.create(self.model, values);
				store.add(record);
			} else {// 编辑
				// 获取表单指向的部门信息
				var record = self.getRecord();
				// 日期处理
				formBasic.getFields().each(function(field) {
					if (field.xtype == 'datefield' || field.xtype == 'datetimefield') {
						field.submitFormat = 'U';
					}
				});
				var values = self.getValues();
				// 更新部门信息
				record.set(values);
				store.loadRecords([ record ]);
				var modifiedRecords = store.getModifiedRecords();
				if (modifiedRecords.length == 0) {
					// 处理文件上传
					self.saveUploadFile(self.hasUploadPanel, self);
					store.load();// 必须加，不加不同步时报错,ie
					modified = false;
				}
			}
			// 异步提交数据
			store.sync({
				success : function(batch) {
					var operation = batch.operations[0];
					var record = self.getRecord();
					record.set(self.getValues());
					if (operation.action == 'create') {
						/*
						 * 新增
						 */
						self.isAdd = false;
						var response = Ext.JSON.decode(operation.response.responseText);
						record.setId(response.id);
						self.loadRecord(record);
					}
					self.saveUploadFile(self.hasUploadPanel, self);
					store.load();
					if (Ext.isFunction(callback)) {
						callback.call(this, self);
					} else if (callback && Ext.isFunction(callback.success)) {
						callback.success.call(this, self);
					} else {
						BaseUtil.briefdialog('保存成功');
					}
					if (callback && Ext.isFunction(callback.callback)) {
						callback.callback.call(this, self);
					}
					// 保存后统一关闭
					activeTab.close();
				},
				failure : function() {
					if (callback && Ext.isFunction(callback.callback)) {
						callback.callback.call(this, self);
					}
					if (callback && Ext.isFunction(callback.failure)) {
						callback.failure.call(this, self);
					}
					// 保存后统一关闭
					activeTab.close();
				}
			});
		} else {
			// submit的提交
			self.submit({
				success : function(form, action) {
					self.isAdd = false;
					var record = self.getRecord();
					var result = Ext.JSON.decode(action.response.responseText);
					record.set(self.getValues());
					if (!record.getId()) {
						record.setId(result.id);
						self.loadRecord(record);
					}
					// 处理文件上传
					self.saveUploadFile(self.hasUploadPanel, self);
					if (Ext.isFunction(callback)) {
						callback.call(this, self);
					} else if (callback && Ext.isFunction(callback.success)) {
						callback.success.call(this, self);
					} else {
						BaseUtil.briefdialog('保存成功');
					}
					if (callback && Ext.isFunction(callback.callback)) {
						callback.callback.call(this, self);
					}
					// 保存后统一关闭
					activeTab.close();
				},
				failure : function() {
					if (callback && Ext.isFunction(callback.callback)) {
						callback.callback.call(this, self);
					}
					if (callback && Ext.isFunction(callback.failure)) {
						callback.failure.call(this, self);
					}
					// 保存后统一关闭
					activeTab.close();
				}
			});
		}
		if (!modified) {
			if (Ext.isFunction(callback)) {
				callback.call(this, self);
			} else if (callback && Ext.isFunction(callback.success)) {
				callback.success.call(this, self);
			} else {
				BaseUtil.briefdialog('保存成功');
			}
			if (callback && Ext.isFunction(callback.callback)) {
				callback.callback.call(this, self);
			}
			// 保存后统一关闭
			activeTab.close();
		}
	},
	/**
	 * submit提交
	 */
	submit : function(config) {
		var formBasic = this.getForm();
		// 日期处理
		formBasic.getFields().each(function(field) {
			if (field.xtype == 'datefield' || field.xtype == 'datetimefield') {
				field.submitFormat = 'U';
			}
		});
		config = config || {};
		if (!Ext.isFunction(config.success)) {
			config.success = function(response) {
				BaseUtil.briefdialog('提交成功');
				var mainTab = Ext.getCmp(FinalVariables.MAIN_TAB);
				if (!mainTab) {
					mainTab = parent.Ext.getCmp(FinalVariables.MAIN_TAB);
				}
				mainTab.getActiveTab().close();
			};
		}
		var failure = config.failure;
		config.failure = function(form, action) {
			BaseUtil.errorHandler(action.response.status, failure);
		};
		config.submitEmptyText = false;
		this.callParent([ config ]);
	},
	/**
	 * 初始化表单各字段值
	 */
	initValues : function(initData) {
		var self = this;
		if (self.values) {
			var record = Ext.create(self.model, self.values);
			self.loadRecord(record);
		} else if (self.record) {
			self.loadRecord(self.record);
		} else {// 新增
			Ext.Array.each(initData.self.getFields(), function(field) {
				var formField = self.getForm().findField(field.name);
				if (!initData.get(field.name) && formField && !formField.isDisabled()) {
					if (field.isAuthorId) {
						initData.set(field.name, user.userId);
					} else if (field.isAuthor) {
						initData.set(field.name, user.userName);
					} else if (field.isAuthorDept) {
						initData.set(field.name, user.deptName);
					}
				}
			});
			self.loadRecord(initData);
		}
	},
	/**
	 * 
	 */
	loadFormConfig : function() {
		var self = this;
		var webDocument = self.down('webdocumenttool');
		var uploadPanel = self.down('uploadpanel');
		var addFileBtn = null;
		var editButton = Ext.isEmpty(webDocument) ? null : webDocument.down('editbutton');
		if (self.authValue != 1) {
			if (uploadPanel) {
				addFileBtn = uploadPanel.down('button[itemId=addFileBtn]');
				addFileBtn.setDisabled(true);
			}
			self.getForm().getFields().each(function(field) {
				if (!field.isDisabled()) {
					field.setReadOnly(true);
				}
			});
			Ext.Array.each(self.getDockedItems('toolbar[dock=bottom]'), function(tool) {
				tool.items.each(function(cmp) {
					if (cmp.xtype == "readedrecordbutton") {
						cmp.setDisabled(false);
					} else {
						cmp.setDisabled(true);
					}
				});
			});
			if (editButton) {
				editButton.editType = '-1,1,1,1,1,0,0,0';
			}
		} else {
			if (editButton) {
				editButton.editType = '-1,0,0,0,0,0,1,0';
			}
		}
	},
	/**
	 * 判断是否有必要的上传
	 */
	necessaryUploadFile : function() {
		if (this.hasUploadPanel) {
			var arr = this.uploadPanels;
			for (var i = 0; i < arr.length; i++) {
				var flag = arr[i].allowBlank;
				if (Ext.isEmpty(flag)) {
					flag = true;
				}
				if (!flag) {
					var uploadStore = arr[i].down('uploadgrid').store;
					if (uploadStore.getCount() == 0) {
						BaseUtil.briefdialog(arr[i].blankText, FinalVariables.WARNING_ICON);
						return true;
					}
				}
			}
		}
		return false;
	},
	/**
	 * 传阅确认
	 */
	confirmCirculate : function(btn) {
		var self = this;
		var dialog = btn.up('window');
		var tree = dialog.down('checkboxtree');
		var selected = tree.getChecked();
		var userIds = new Array();// 已选中用户id
		var userNames = new Array();// 已选中用户名字
		Ext.Array.each(selected, function(item) {
			if (item.isLeaf()) {
				userIds.push(item.get('itemId'));
				userNames.push(item.get('text'));
			}
		});
		self.circulateUserIds = userIds;
		var msg = '确认将该业务发送给【' + userNames.join('，') + '】阅读吗？';
		Ext.MessageBox.confirm('提 示', msg, function(answer) {
			if ('yes' == answer) {
				self.saveCirculate(userIds);
				dialog.close();
			}
		});
	},
	/**
	 * 传阅请求发送
	 */
	saveCirculate : function(userIds) {
		var self = this;
		self.save({
			callback : self.circulate(self)
		});
	},
	/**
	 * 向后台发送传阅相关数据
	 * 
	 * @Param form
	 */
	circulate : function(form) {
		var _storeUrl = form.url;
		var _viewAlias = form.xtype;
		var _viewClassName = form.$className;
		var _modelClassName = form.model;
		var _userIds = form.circulateUserIds;
//		var mainTab = Ext.getCmp(FinalVariables.MAIN_TAB);
//		var activeTab = mainTab.getActiveTab();
		// 传阅
		if (!Ext.isEmpty(_userIds) && !Ext.isEmpty(_storeUrl) && !Ext.isEmpty(_viewAlias) && !Ext.isEmpty(_viewClassName) && !Ext.isEmpty(_modelClassName)) {
			BaseUtil.request({
				url : 'document',
				params : {
					receiverIds : _userIds.toString(),
					modelClassName : _modelClassName,
					viewClassName : _viewClassName,
					viewAlias : _viewAlias,
					storeUrl : _storeUrl,
					businessKeys : form.getRecord().getId()
				},
				success : function() {
					BaseUtil.briefdialog('发送成功', FinalVariables.SUCCESS_ICON);
				}
			});
		}
	}
});