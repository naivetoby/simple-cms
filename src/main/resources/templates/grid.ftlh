<!DOCTYPE HTML>
<#include "header_grid.ftlh">
<script type="text/javascript">
    // 当前用户信息
    var user = null;
    (function () {
        var LoadRes = {
            loadScript: (function () {
                var loadOne = function (url) {
                    return $.ajax({
                        url: url,
                        dataType: 'script',
                        type: 'get',
                        cache: true
                    });
                };

                var load = function (urls, callback) {
                    if (!$.isArray(urls)) {
                        return load([urls], callback);
                    }
                    var ret = [];
                    for (var i = 0; i < urls.length; i++) {
                        ret[i] = loadOne(urls[i]);
                    }
                    if (typeof callback == 'function') {
                        $.when.apply(this, ret).done(callback);
                    }
                };

                return load;
            })(),
            loadStyle: function (url) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = url;
                head.appendChild(link);
            }
        };
        LoadRes.loadScript(extUrl, function () {
            LoadRes.loadScript('lib/extensible/extensible-all.js', function () {
                LoadRes.loadScript(['lib/ext4.2.1/locale/ext-lang-zh_CN.js', 'lib/extensible/locale/extensible-lang-zh_CN.js', 'lib/ext4.2.1/ux/JCDateFormat.js', 'javascript/util/FinalVariables.js', 'javascript/util/Renderers.js', 'javascript/util/BaseUtil.js'], function () {
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
                    // 防止grid内容注入
                    Ext.override(Ext.grid.column.Column, {
                        defaultRenderer: Ext.util.Format.htmlEncode
                    });
                    Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
                    //缓存当前用户信息
                    var _user = '${Session.userjson}'.replace(/&quot;/g,'"');
                    user = Ext.isEmpty(_user) ? {} : Ext.JSON.decode(_user);
                    //视图参数信息
                    var param = Ext.JSON.decode(BaseUtil.BASE64.decoder2("${RequestParameters.viewInfo}"));
                    //模块中文名
                    var moduleName = decodeURIComponent("${RequestParameters.moduleName}");
                    //模块名
                    var module = "${RequestParameters.module}";
                    //模块类型
                    var viewType = "${RequestParameters.viewType}";
                    //权限值
                    var authValue = parseInt("${RequestParameters.authValue}");
                    if (Math.abs(viewType) == 3) {
                        //自定义视图
                        // 启动应用
                        Ext.application({
                            name: 'OA',
                            appFolder: 'javascript',
                            requires: ['Ext.ux.ProgressBarPager', 'OA.view.core.BasePanel', 'OA.view.core.BaseIFrame'],
                            controllers: [param.controller],
                            launch: function () {
                                Ext.create('Ext.container.Viewport', {
                                    layout: 'border',
                                    items: [{
                                        region: 'center',
                                        xtype: param.gridAlias,
                                        id: 'custom_view_' + module,
                                        moduleName: module,
                                        moduleTitle: moduleName,
                                        app: this,
                                        pageSize: pageSize,
                                        authValue: authValue
                                    }]
                                });
                            }
                        });
                    } else {
                        // 默认的分页
                        var pageSize = Ext.isEmpty(param.config.pageSize) ? 10 : param.config.pageSize;
                        //默认视图
                        var _tools_name = [];
                        if (param.config.tools) {
                            var _tools = param.config.tools;
                            for (var i in _tools) {
                                _tools_name.push(_tools[i]['name']);
                            }
                        }
                        // 开启自动排序
                        var gridSortable = false;
                        if (param.config && param.config.sortPlugin && authValue == 1) {
                            var columns = param.config.columns;
                            for (var i in columns) {
                                if (columns[i]['dataIndex'] == 'indexNumber') {
                                    gridSortable = true;
                                    break;
                                }
                            }
                            if (gridSortable) {
                                _tools_name.push('OA.parts.core.gridtools.SortTool');
                            }
                        }
                        // 启动应用
                        Ext.application({
                            name: 'OA',
                            appFolder: 'javascript',
                            requires: ['OA.store.' + param.store, 'Ext.ux.ProgressBarPager', 'OA.view.core.BasePanel', 'OA.view.core.BaseIFrame', 'OA.parts.core.gridtools.BackTool'].concat(_tools_name),
                            controllers: [param.controller],
                            launch: function () {
                                // 创建数据源
                                var store = Ext.create('OA.store.' + param.store, {
                                    storeId: param.store
                                });
                                //开启自动排序
                                store.sortPlugin = gridSortable;
                                //创建data-grid
                                var grid = Ext.create('OA.view.core.DataGrid', {
                                    region: 'center',
                                    id: 'grid_view_' + module,
                                    store: store,
                                    columns: param.config.columns,
                                    formName: param.config.form,
                                    moduleName: module,
                                    moduleTitle: moduleName,
                                    app: this,
                                    pageSize: pageSize,
                                    gridConfig: param.config,
                                    authValue: authValue
                                });
                                //创建视图
                                Ext.create('Ext.container.Viewport', {
                                    layout: 'border',
                                    items: [grid]
                                });
                                //禁用排序插件
                                if (store.sortPlugin) {
                                    var plugin = grid.getView().getPlugin('gridviewdragdrop');
                                    plugin.disable();
                                }
                                // 读取数据
                                store.pageSize = pageSize;
                                store.currentPage = 1;
                                store.load({
                                    start: 0,
                                    limit: pageSize
                                });
                            }
                        });
                    }
                });
            });
        });
    })();
</script>
</head>
<body>
<div id="resources" style="display: none;"></div>
<div id="briefdialog" style="display: none">
    <img class="icon" src="image/succeed.png" width="36px" height="36px"><span class="msg"></span>
</div>
</body>
</html>