Ext.define('OA.view.core.user.ChangeStatusItem', {
	extend : 'Ext.menu.Item',
	alias : 'widget.changestatusitem',
	initComponent : function() {
		var self = this;
		var rec = self.record;
		var _status = rec.get('status');
		var _userId = rec.get('userId');
		var _userName = rec.get('userName');
		var option = _status != 2 ? '锁定' : '解锁';
		self.text = option + '用户';
		self.handler = function(item, e) {
			Ext.Msg.confirm('提示框', '您确定' + option + '此用户？', function(btn) {
				if (btn == 'yes') {
					BaseUtil.request({
						url : 'user/changeUserStatus',
						params : {
							userId : _userId
						},
						success : function(response) {
							rec.store.load({
								callback : function() {
									BaseUtil.briefdialog('用户 【 ' + _userName + ' 】' + option + '成功');
								}
							});
						}
					});
				}
			});
		};
	},
	/**
	 * 右击的数据
	 */
	record : null
});