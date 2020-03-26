/**
 * 主页应用程序入口
 *
 * @author 彭嘉辉
 */
// 禁止浏览器的右键事件
if (!isDevelopment) {
    Ext.getDoc().on("contextmenu", function (e) {
        e.stopEvent();
    });
}
// 动态加载js
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'OA': 'javascript',
        'Ext.ux': 'lib/ext4.2.1/ux',// ux为Ext的扩展组件，不再ext-all.js中，需要另外加载
        'Extensible': 'lib/extensible'
    }
});
Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
var user = null;
var leftCollapse = false;
Ext.onReady(function () {
    Ext.Ajax.timeout = 180000;
    user = user || {};
    try {
        var _user = BaseUtil.BASE64.decoder2($('#userInfo').attr('data-info'));
        user = Ext.isEmpty(_user) ? {} : Ext.JSON.decode(_user);
    } catch (e) {
        alert(e.message);
    }
    Ext.application({
        name: 'OA',
        appFolder: 'javascript',
        controllers: ['core.home.HomeController'],
        launch: function () {
            // 设置当前日期信息
            var now = new Date();
            var date = Ext.ux.JCDateFormat.format(now, 'yyyy年MM月dd日');
            var week = '星期' + '日一二三四五六'.charAt(now.getDay());
            $("#now_time").text(date + ' ' + week);
            // 实例化主页框架
            Ext.create('Ext.container.Viewport', {
                layout: 'border',
                items: [{
                    xtype: 'toppanel',
                }, {
                    xtype: 'leftpanel'
                }, {
                    xtype: 'centerpanel'
                }],
                listeners: {
                    afterlayout: function (v) {
                        // 如果用户未激活
                        if (user.status == -1) {
                            BaseUtil.resetPwd4Inactive();
                        }
                        BaseUtil.downloadIframe();
                        if (saveLabel) {
                            var activeId = BaseUtil.getCookie(FinalVariables.ACTIVE_ID);
                            if (Ext.isEmpty(Ext.getCmp(activeId))) {
                                var tabs = BaseUtil.getCookie(FinalVariables.TABS);
                                if (activeId && tabs) {
                                    var userCookies = {};
                                    for (var key in tabs) {
                                        if (tabs[key].userId == user.userId) {
                                            userCookies[key] = tabs[key];
                                        }
                                    }
                                    var requires = new Array();
                                    var iframeKeyArray = new Array();
                                    var iframeArray = new Array();
                                    for (var key in userCookies) {
                                        if (userCookies[key] && userCookies[key].className) {
                                            requires.push(userCookies[key].className);
                                        }
                                        if (userCookies[key] && userCookies[key].type == FinalVariables.TAB_TYPES_IFRAME) {
                                            if (Ext.isEmpty(userCookies[key].module)) {
                                                delete userCookies[key];
                                            } else {
                                                iframeArray.push(userCookies[key].module);
                                                iframeKeyArray.push(key);
                                            }
                                        }
                                    }
                                    BaseUtil.request({
                                        url: 'module/tabs',
                                        params: {
                                            moduleNames: iframeArray.join(',')
                                        },
                                        success: function (response) {
                                            var iframes = Ext.JSON.decode(response.responseText);
                                            for (var module in iframes) {
                                                Ext.Array.each(iframeKeyArray, function (key) {
                                                    if (userCookies[key] && userCookies[key].module == module) {
                                                        if (Ext.isEmpty(iframes[module])) {
                                                            delete userCookies[key];
                                                        } else {
                                                            userCookies[key].url = iframes[module];
                                                        }
                                                    }
                                                });
                                            }
                                            Ext.require(requires, function () {
                                                for (var key in userCookies) {
                                                    if (key != FinalVariables.TAB_INDEX) {
                                                        var autoShow = key == activeId ? true : false;
                                                        BaseUtil.loadTab(key, userCookies[key], autoShow);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                        $('body').removeClass('login_body');
                        // 加载完毕
                        $('#bestloader').remove();
                    }
                }
            });
            Ext.create('Ext.Button', {
                iconCls: 'out_32Icon',
                iconAlign: 'center',
                scale: 'large',
                tooltip: '<span style="font-size:12px">退出系统</span>',
                arrowAlign: 'right',
                renderTo: 'closeDiv',
                handler: function () {
                    Ext.Msg.confirm('提示框', '您确定退出此系统？', function (btn) {
                        if (btn == 'yes') {
                            window.location.href = "logout";
                        }
                    });
                }
            });
        }
    });
});
