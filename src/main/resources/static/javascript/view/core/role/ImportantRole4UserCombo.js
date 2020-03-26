Ext.define('OA.view.core.role.ImportantRole4UserCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.importantrole4usercombo',
	name : 'userId',
	displayField : 'userName',
	valueField : 'userId',
	fieldLabel : '用户名',
	autoScroll : true,
	editable : false,
	emptyText : '请选择用户',
	listConfig : {
		maxHeight : 192
	},
	listeners : {
		// 初始化下拉框的默认数据
		beforerender : function(obj, eOpts) {
			var self = this;
			var record = obj.up('window').down('form').getRecord();
			BaseUtil.request({
				url : 'role/user',
				params : {
					roleId : record.get('roleId')
				},
				method : 'GET',
				success : function(response) {
					var text = response.responseText;
					self.store.getProxy().setExtraParam('roleId', record.get('roleId'));// 加上参数
					self.store.load({
						callback : function() {
							if (!Ext.isEmpty(text)) {
								var json = Ext.JSON.decode(text);
								var arr = json.userIds;
								if (arr.length > 0) {
									var userId = arr[0];
									obj.setValue(userId);
								}
							}
						}
					});
				}
			});
		}

	},
	initComponent : function() {
		this.store = Ext.create('OA.store.core.role.UpdateUser4ImportantRoles');
		this.callParent();
	}
});