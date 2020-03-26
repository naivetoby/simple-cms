Ext.define('OA.view.core.BaseDialog', {
	extend : "Ext.window.Window",
	alias : 'widget.basedialog',
	resizable : false,
	constrain : true,
	title : '',
	layout : 'fit',
	modal : true,
	border : false,
	width : 380,
	bodyPadding : 10,
	print : false,
	printView : '',
	setFormReadOnly : function(callback) {
		var form = this.down('form');
		if (!Ext.isEmpty(form)) {
			form.setDisabled(true);
		}
		if (Ext.isFunction(callback)) {
			callback();
		}
	},
	initComponent : function() {
		var self = this;
		self.id = 'base_dialog_' + self.id;
		var dialog = Ext.getCmp(self.id);
		if (dialog) {
			// 销毁旧窗口，不然下拉框赋值有时候会出错
			dialog.destroy();
		}
		// 表单只读
		if (self.formReadOnly) {
			self.buttons = [ {
				text : '关 闭',
				scale : 'medium',
				action : 'close',
				handler : function(button) {
					button.up('window').close();
				}
			}, {
				text : '打印',
				scale : 'medium',
				action : 'print',
				hidden : !self.print,
				handler : self.onPrint
			} ];
			self.hasPanel = true;
		}
		// 插入panel面板, 当表单禁用时, 可以拖动面板
		if (self.hasPanel) {
			var _items = self.items;
			self.bodyPadding = 0;
			if (Ext.isArray(_items)) {
				self.items = [ Ext.apply({
					xtype : 'panel',
					bodyPadding : 10,
					overflowX : 'hidden',
					overflowY : 'auto',
					border : false,
					items : _items
				}, self.readOnlyPanelConfig) ];
			}
		}
		self.callParent();
	},
	show : function(animateTarget, callback, scope) {
		if (animateTarget && callback) {
			this.callParent(arguments);
		} else {
			if (this.showButton) {
				this.callParent([ this.showButton, function() {
				} ]);
			} else if (this.grid) {
				this.callParent([ this.grid, function() {
				} ]);
			} else {
				this.callParent(arguments);
			}
		}
	},
	close : function() {
		var self = this;
		if (this.showButton) {
			this.hide(this.showButton, function() {
				self.destroy();
			});
		} else if (this.grid) {
			this.hide(this.grid, function() {
				self.destroy();
			});
		} else {
			self.callParent(arguments);
		}
	}
});