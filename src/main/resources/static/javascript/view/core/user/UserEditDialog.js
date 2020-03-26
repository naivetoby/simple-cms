Ext.define('OA.view.core.user.UserEditDialog', {
    extend: 'OA.view.core.BaseDialog',
    alias: 'widget.usereditdialog',
    record: null,
    items: [{
        xtype: 'form',
        border: false,
        fieldDefaults: {
            anchor: '100%',
            labelWidth: 90
        },
        items: [{
            xtype: 'textfield',
            name: 'userName',
            fieldLabel: "用户名",
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'phones',
            fieldLabel: "手机号",
            allowBlank: true
        }, {
            xtype: 'textfield',
            name: 'loginName',
            fieldLabel: '登录名',
            allowBlank: false,
            exist: false,
            validator: function (value) {
                if (this.exist) {
                    return '登陆名已存在';
                } else {
                    return true;
                }
            },
            listeners: {
                change: function (field) {
                    var self = this;
                    if (field.value == self.up('window').record.get('loginName')) {
                        return;
                    }
                    BaseUtil.request({
                        url: 'user/checkLoginName',
                        params: {
                            loginName: field.value
                        },
                        success: function (response) {
                            if (response.responseText > 0) {
                                field.exist = true;
                            } else {
                                field.exist = false;
                            }
                            field.validate();
                        }
                    });
                }
            }
        }, {
            xtype: 'userdeptcombo'
        }, {
            layout: 'column',
            border: false,
            id: 'user_reset_pwd',
            items: [{
                layout: 'column',
                border: false,
                columnWidth: .4,
                style: 'padding-top:5px;',
                items: [{
                    style: 'padding-top:6px',
                    xtype: 'checkboxfield',
                    name: 'resetPwd',
                    boxLabel: '重置为初始密码',
                    checked: false,
                    listeners: {
                        change: function (self, newValue, oldValue, eOpts) {
                            var pwd = Ext.getCmp('user_default_pwd');
                            if (newValue) {
                                pwd.setVisible(true);
                            } else {
                                pwd.setVisible(false);
                            }
                        }
                    }
                }]
            }, {
                columnWidth: .2,
                height: 30,
                border: false
            }, {
                columnWidth: .4,
                layout: 'form',
                border: false,
                items: [{
                    id: 'user_default_pwd',
                    xtype: 'textfield',
                    name: 'defaultPwd',
                    hidden: true,
                    readOnly: true,
                    readOnlyCls: 'field-readonly-text',
                    align: 'center',
                    value: 'heart12345678',
                    fieldStyle: 'text-align: center;'
                }]
            }]
        }]
    }],
    buttons: [{
        text: '保 存',
        scale: 'medium',
        action: 'save_User'
    }, {
        text: '取 消',
        scale: 'medium',
        handler: function (button) {
            button.up('window').close();
        }
    }]
});