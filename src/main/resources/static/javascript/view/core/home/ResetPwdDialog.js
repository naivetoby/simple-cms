Ext.define('OA.view.core.home.ResetPwdDialog', {
	extend : 'OA.view.core.BaseDialog',
	alias : 'widget.resetpwddialog',
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
			inputType : 'password',
			name : 'oldPassword',
			fieldLabel : "原密码"
		}, {
			itemId : 'new_password',
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
		}, {
			xtype : 'textfield',
			inputType : 'password',
			validator : function(value) {
				if (value.length < 10 || !value.match(/(\d+[a-zA-Z]+)|([a-zA-Z]+\d+)/)) {
					return '密码必须包含字母和数字且长度在十位或以上';
				} else if (value != this.up('form').down('textfield[itemId=new_password]').getValue()) {
					return '新密码与确认密码不一致';
				}
				return true;
			},
			name : 'newPassword1',
			fieldLabel : "确认密码"
		} ]
	} ],
	buttons : [ {
		text : '保 存',
		scale : 'medium',
		handler : function(button) {
			var dialog = button.up('resetpwddialog');
			var form = dialog.down('form');
			if (form.isValid()) {
				BaseUtil.request({
					url : 'user/resetPwd',
					params : form.getValues(),
					success : function(response) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.result.error) {
							BaseUtil.briefdialog('原密码输入错误', FinalVariables.WARNING_ICON, null, 5000);
						} else {
							var i = 3;
							var t = '';
							t = setInterval(function() {
								i--;
								$("#briefdialog .msg").text('密码修改成功, ' + i + '秒后将自动退出...');
								if (i == 0) {
									clearInterval(t);
								}
							}, 1000);
							BaseUtil.briefdialog('密码修改成功, 3秒后将自动退出...', FinalVariables.SUCCESS_ICON, function() {
								var location = (parent && parent.window) ? parent.window.location : window.location;
								location.reload();
							});
							dialog.close();
						}
					}
				});
			}
		}
	}, {
		text : '取 消',
		scale : 'medium',
		handler : function(button) {
			button.up('window').close();
		}
	} ]
});