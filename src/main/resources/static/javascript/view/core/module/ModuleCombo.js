Ext.define('OA.view.core.module.ModuleCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.modulecombo',
	name : 'parentId',
	displayField : 'moduleName',
	valueField : 'moduleId',
	emptyText : '请选择目录',
	fieldLabel : '上级目录',
	autoScroll : true,
	store : Ext.create('OA.store.core.module.ModuleDirs', {
		autoLoad : true
	}),
	editable : false,
	listConfig : {
		maxHeight : 192
	}
});