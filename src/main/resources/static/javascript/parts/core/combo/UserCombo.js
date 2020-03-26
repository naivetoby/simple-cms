/**
 * 选择用户下拉框，可根据部门来查
 */
Ext.define('OA.parts.core.combo.UserCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.usercombo',
	requires : [ 'OA.store.core.user.Users' ],
	displayField : 'userName',
	fieldLabel : '选择用户',
	emptyText : '请选择用户',
	autoScroll : true,
	// deptId : '',// 可传入部门ID，获取部门下的人
	listConfig : {
		maxHeight : 150
	},
	initComponent : function() {
		var self = this;
		self.store = Ext.create('OA.store.core.user.Users', {
			autoLoad : true
		});
		// self.store.load();
		self.callParent();
	}
});