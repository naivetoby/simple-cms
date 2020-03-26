/**
 * 用户管理控制器
 *
 * @author 刘树君
 */
Ext.define('OA.controller.core.user.UserController', {
    extend: 'Ext.app.Controller',
    models: ['core.user.User'],
    requires: ['OA.store.core.user.UserDepartmentCombos'],
    stores: ['core.user.Users', 'core.user.UserAuths'],
    views: ['core.DataGrid', 'core.user.UserMenu', 'core.user.UserRegistDialog', 'core.user.UserEditDialog', 'core.user.UserDeptCombo', 'core.user.UserStatusCombo', 'OA.view.core.user.UserAuthDialog', 'OA.view.core.user.UserAuthTreePanel'],
    init: function () {
        this.control({
            'datagrid[id=grid_view_User]': {
                itemdblclick: this.showEditDialog,
                itemcontextmenu: this.showMenu
            },
            'button[action=save_User]': {
                click: this.submitData
            },
            'userdeptcombo': {
                beforerender: this.initRender
            }
        });
    },
    showEditDialog: function (grid, record) {
        // 只读标识
        var formReadOnly = !grid.panel.authValue || grid.panel.authValue != 1;
        var dialog = Ext.getCmp('edit_dialog_User');
        if (dialog) {
            // 销毁旧窗口，不然下拉框赋值有时候会出错
            dialog.destroy();
        }

        // 创建新窗口
        dialog = Ext.widget({
            id: 'edit_dialog_User',
            xtype: 'usereditdialog',
            title: formReadOnly ? '查看用户' : '编辑用户',
            record: record,
            formReadOnly: formReadOnly
        });

        var form = dialog.down('form');
        form.isAdd = false;
        form.loadRecord(record);
        // 设置表单只读
        if (formReadOnly) {
            dialog.setFormReadOnly();
        }
        // 当用户被锁定不可以重置密码
        if (record.get('status') != 1) {
            var resetPwd = Ext.getCmp('user_reset_pwd');
            resetPwd.setDisabled(true);
            resetPwd.setVisible(false);
        }
        // 显示
        dialog.show();
    },
    submitData: function (button) {
        // 获取对话框对象
        var win = button.up('window');
        // 获取表单对象
        var form = win.down('form');
        if (form.isValid()) {// 判断表单是否通过验证
            var store = this.getCoreUserUsersStore();
            // 数据源对象
            if (form.isAdd) {// 新增
                var user = Ext.create('OA.model.core.user.User', form.getValues());
                user.data.roles = null;
                store.add(user);
            } else {// 编辑
                // 获取表单指向的用户信息
                var record = form.getRecord();
                // 获取表单当前值
                var values = form.getValues();
                // 将boolean值转成string
                values.resetPwd = values.resetPwd ? 'true' : 'false';
                // 更新用户信息
                record.set(values);
            }
            win.close();
            // 提交数据
            store.sync();
        }
    },
    initRender: function (obj, eOpts) {
        var record = obj.up('window').down('form').getRecord();
        if (record) {
            obj.setValue(Ext.create('OA.model.core.user.User', {
                deptId: record.get('deptId'),
                deptName: record.get('deptName')
            }));
        }
    },
    showMenu: function (grid, record, item, index, e) {
        var menu = Ext.create('OA.view.core.user.UserMenu', {
            record: record,
            authValue: grid.panel.authValue
        });
        // 阻塞原来的右击事件
        e.stopEvent();
        // 显示菜单
        menu.showAt(e.getXY());
    }
});