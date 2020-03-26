Ext.define('OA.view.core.user.UserStatusCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.userstatuscombo',
	name : 'status',
	displayField : 'name',
	valueField : 'status',
	fieldLabel : '状态',
	emptyText : '请选择状态',
	autoScroll : true,
	queryMode : 'local',
	store : Ext.create('Ext.data.Store', {
		fields : [ 'status', 'name' ],
		data : [ {
			'status' : -1,
			'name' : '未激活'
		}, {
			'status' : 1,
			'name' : '正常'
		}, {
			'status' : 2,
			'name' : '已锁定'
		} ]
	}),
	lastQuery : '',
	editable : false
});