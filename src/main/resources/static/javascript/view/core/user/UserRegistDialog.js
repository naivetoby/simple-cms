Ext.define('OA.view.core.user.UserRegistDialog', {
    extend: 'OA.view.core.BaseDialog',
    alias: 'widget.userregistdialog',
    title: '新增用户',
    items: [{
        xtype: 'form',
        border: false,
        defaultType: 'textfield',
        fieldDefaults: {
            anchor: '100%',
            labelWidth: 70,
            allowBlank: false
        },
        items: [{
            name: 'userName',
            fieldLabel: "用户名"
        }, {
            xtype: 'textfield',
            name: 'phones',
            fieldLabel: "手机号",
            allowBlank: true
        }, {
            name: 'loginName',
            fieldLabel: '登陆名',
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
            name: 'loginPassword',
            fieldLabel: '初始密码',
            readOnly: true,
            readOnlyCls: 'field-readonly-text',
            value: 'heart12345678'
        }, {
            xtype: 'userdeptcombo'
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