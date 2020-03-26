Ext.define('OA.store.core.BaseTreeStore', {
	extend : 'Ext.data.TreeStore',
	model : '',
	url : '',
	root : {},
	proxy : {
		type : 'rest',
		extraParams : {
			_rest : 'rest'
		}
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
	sync : function(config) {
		var self = this;
		config = config || {};
		var success_callback = config.success;
		config.success = function(batch, options) {
			if (success_callback && typeof success_callback == 'function') {
				success_callback(batch, options);
			} else {
				if (options.operations.create) {
					BaseUtil.briefdialog('添加成功');
				}
				if (options.operations.update) {
					BaseUtil.briefdialog('修改成功');
				}
				if (options.operations.destroy) {
					BaseUtil.briefdialog('删除成功');
				}
			}
			self.load();
		};
		var failure_callback = config.failure;
		config.failure = function(batch, options) {
			BaseUtil.errorHandler(batch.exceptions[0].error.status, failure_callback, batch, options);
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
					if (_callback && typeof _callback == 'function') {
						_callback(records, operation, success);
					}
				} else {
					BaseUtil.errorHandler(operation.error.status);
				}
			}
		}) ]);
	}
});