Ext.define('OA.view.core.module.ModuleViewTypeCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.moduleviewtypecombo',
	name : 'viewType',
	displayField : 'name',
	valueField : 'type',
	fieldLabel : '模块类型',
	emptyText : '请选择模块类型',
	editable : false,
	autoScroll : true,
	queryMode : 'local',
	store : new Ext.data.ArrayStore({
		fields : [ 'type', 'name' ],
		data : [ [ 1, '目录' ], [ 2, '功能模块' ], [ 3, '自定义模块' ], [ -1, '系统目录' ], [ -2, '系统功能模块' ] ]
	})
});