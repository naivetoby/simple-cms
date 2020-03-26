Ext.define('OA.view.core.home.ResetPwd4InactiveDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.inactivedialog',
	title : '请修改密码以激活用户',
	closable : false,
	items : [ {
		xtype : 'form',
		border : false,
		fieldDefaults : {
			anchor : '100%',
			labelWidth : 70,
			allowBlank : false
		},
		items : [ {
			xtype : 'textfield',
			name : 'oldPassword',
			hidden : true,
			value : 'heart12345678'
		}, {
			xtype : 'textfield',
			inputType : 'password',
			validator : function(value) {
				if (value.length >= 10 && value.match(/(\d+[a-zA-Z]+)|([a-zA-Z]+\d+)/)) {
					return true;
				}
				return '密码必须包含字母和数字且长度为十位以上';
			},
			name : 'newPassword',
			fieldLabel : "新密码"
		} ]
	} ],
	buttons : [ {
		text : '激 活',
		scale : 'medium',
		handler : function(button) {
			var dialog = button.up('inactivedialog');
			var form = dialog.down('form');
			if (form.isValid()) {
				BaseUtil.request({
					url : 'user/resetPwd',
					params : form.getValues(),
					success : function(response) {
						var i = 3;
						var t = '';
						t = setInterval(function() {
							i--;
							$("#briefdialog .msg").text('用户激活成功, ' + i + '秒后请重新登录');
							if (i == 0) {
								clearInterval(t);
							}
						}, 1000);
						BaseUtil.briefdialog('用户激活成功, 3秒后请重新登录', FinalVariables.SUCCESS_ICON, function() {
							var location = (parent && parent.window) ? parent.window.location : window.location;
							location.reload();
						});
						dialog.close();
					}
				});
			}
		}
	}, {
		text : '退 出',
		scale : 'medium',
		handler : function(button) {
			Ext.Msg.confirm('提示框', '您确定退出此系统？', function(btn) {
				if (btn == 'yes') {
					window.location.href = "logout";
				}
			});
		}
	} ]
});