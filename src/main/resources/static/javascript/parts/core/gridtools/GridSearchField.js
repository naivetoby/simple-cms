/**
 * grid中使用的搜索field，必须使用在grid里，目前只支持某个字段过滤，前台过滤
 * 
 * 不要格式化
 * 
 * 用法：
 * 
 * 		dockedItems : [ {
 *				xtype : 'toolbar',
 *				dock : 'top',
 *				layout : {
 *					type : 'vbox',
 *					align : 'center'
 *				},
 *				padding : 10,
 *				items : [ {
 *					xtype : 'gridsearchfield',
 *					emptyText : '输入文件名进行搜索',
 *					filterField : 'fileName'
 *				} ]
 *			} ],
 */
Ext.define('OA.parts.core.gridtools.GridSearchField', {
	extend : 'Ext.form.field.Trigger',
	alias : 'widget.gridsearchfield',
	enableKeyEvents : true,
	hasSearch : false,
	border : false,
	margin : 0,
	minWidth : 400,
	filterField : null,// 需要过滤的字段名
	emptyText : '输入关键字进行搜索',
	trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
	trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
	listeners : {
		specialkey : function(field, e) {
			// e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
			// e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP,
			// e.DOWN
			var me = this;
			var store = me.up('grid').store;
			var filterField = me.filterField;
			var filters = new Array();
			if (me.value) {
				if (Ext.isString(filterField)) {
					filters = {
						property : filterField,
						value : this.value,
						anyMatch : true,
						caseSensitive : false
					};
				}
				if (!Ext.isEmpty(filters)) {
					if (e.getKey() == e.ENTER) {
						store.remoteFilter = false;
						store.clearFilter(true);
						store.filter(filters);

						field.hasSearch = true;
						field.triggerCell.item(0).setDisplayed(true);
						field.updateLayout();
					}
				}
			}
		},
		change : function(field, newValue) {
			var me = this;
			var store = field.up('grid').store;
			if (store) {
				if (Ext.isEmpty(newValue)) {
					store.clearFilter();
					me.hasSearch = false;
					me.triggerCell.item(0).setDisplayed(false);
					me.updateLayout();
				}
			}
		},
		afterrender : function() {
			this.triggerCell.item(0).setDisplayed(false);
		}
	},
	onTrigger1Click : function() {
		var me = this;
		var store = me.up('grid').store;
		if (me.hasSearch && store) {
			me.setValue('');
			store.clearFilter();
			me.hasSearch = false;
			me.triggerCell.item(0).setDisplayed(false);
			me.updateLayout();
		}
	},
	onTrigger2Click : function() {
		var me = this;
		var store = me.up('grid').store;
		var filters = me.filters;
		if (store && !Ext.isEmpty(filters)) {
			store.remoteFilter = false;
			store.clearFilter(true);
			if (me.value) {
				store.filter(filters);
				me.hasSearch = true;
				me.triggerCell.item(0).setDisplayed(true);
				me.updateLayout();
			} else {
				me.triggerCell.item(0).setDisplayed(false);
				me.updateLayout();
			}
		}
	},
	initComponent : function() {
		var me= this;
		Ext.applyIf(me,{
			
		});
		me.callParent();

	}

});