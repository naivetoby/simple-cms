Ext.define('OA.view.core.module.ModuleAuthCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.moduleauthcombo',
	name : 'auth',
	displayField : 'text',
	valueField : 'value',
	fieldLabel : '状态',
	emptyText : '请选择状态',
	autoScroll : true,
	queryMode : 'local',
	store : Ext.create('Ext.data.Store', {
		fields : [ 'value', 'text' ],
		data : [ {
			'value' : 0,
			'text' : '只读'
		}, {
			'value' : 1,
			'text' : '读写'
		} ]
	}),
	editable : false
});