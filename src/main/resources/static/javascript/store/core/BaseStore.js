Ext.define('OA.store.core.BaseStore', {
	extend : 'Ext.data.Store',
	model : '',
	url : '',
	remoteFilter : true,
	remoteSort : true,
	proxy : {
		type : 'rest',
		reader : {
			root : 'rows'
		},
		extraParams : {
			_rest : 'rest'
		},
		batchOrder : 'destroy,update,create'// 执行顺序
	},
	sorters : [ {
		property : 'indexNumber',
		direction : 'ASC'
	} ],
	constructor : function() {
		var self = this;
		Ext.apply(self.proxy, {
			url : self.url,
			model : self.model
		});
		if (self.extraParams) {
			self.proxy.extraParams = self.extraParams;
		}
		if (self.reader) {
			self.proxy.reader = self.reader;
		}
		if (self.writer) {
			self.proxy.writer = self.writer;
		}
		this.callParent(arguments);
	},
	add : function(record) {
		var self = this;
		record = record || {};
		if (Ext.isFunction(record.set)) {
			record.set('indexNumber', self.getTotalCount() + 1);
		}
		self.callParent([ record ]);
	},
	sync : function(config) {
		config = config || {};
		var self = this;
		// 自定义回调方法
		var success_callback = config.success;
		config.success = function(batch, options) {
			// 同步数据成功后重新加载
			self.load({
				callback : function(records, operation, success) {
					var isError = false;
					try {
						var operations = batch.operations;
						for ( var i in operations) {
							var operation = operations[i];
							var data = operation.response.responseText;
							if (!Ext.isEmpty(data)) {
								var returnJson = Ext.JSON.decode(data);
								if (returnJson && returnJson[FinalVariables.ERROR_MSG]) {
									isError = true;
									BaseUtil.briefdialog(returnJson[FinalVariables.ERROR_MSG], FinalVariables.WARNING_ICON);
									break;
								}
							}
						}
					} catch (e) {
						isError = true;
					}
					if (!isError) {
						if (Ext.isFunction(success_callback)) {
							success_callback(batch, options);
						} else {
							BaseUtil.briefdialog('操作成功');
						}
					}
				}
			});
		};
		var failure_callback = config.failure;
		config.failure = function(batch, options) {
			BaseUtil.errorHandler(batch.exceptions[0].error.status, failure_callback, batch, options);
			self.load();
		};
		self.callParent([ config ]);
	},
	load : function(config) {
		var self = this;
		config = config || {};
		var _callback = config.callback;
		self.callParent([ Ext.apply(config, {
			callback : function(records, operation, success) {
				if (success) {
					if (Ext.isFunction(_callback)) {
						_callback(records, operation, success);
					}
				} else {
					BaseUtil.errorHandler(operation.error.status);
				}
			}
		}) ]);
	}
});