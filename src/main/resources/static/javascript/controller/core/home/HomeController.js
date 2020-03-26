Ext.define('OA.controller.core.home.HomeController', {
    extend: 'Ext.app.Controller',
    refs: [{
        ref: 'dataGrid',
        selector: 'datagrid'
    }],
    init: function () {
        var self = this;
        self.control({
            'leftpanel': {
                itemclick: self.showView
            }
        });
    },
    models: ['core.module.Module'],
    stores: ['core.home.IndexModules'],
    views: ['core.Notification', 'core.home.CenterPanel', 'core.home.LeftPanel', 'core.home.TopPanel', 'core.BasePanel', 'core.BaseIFrame'],
    showView: function (view, record) {
        var tabId = 'tab_' + record.get('moduleId');
        if (record.isLeaf()) {// 判断点击的是否叶子节点
            var moduleName = encodeURIComponent(record.get('text'));
            var url = 'grid?moduleName=' + moduleName + '&module=' + record.get('module') + '&viewType=' + record.get('viewType') + '&authValue=' + record.get('authValue') + '&viewInfo=' + record.get('viewInfo');
            BaseUtil.showTab(tabId, {
                module: record.get('module'),
                url: url,
                title: record.get('text'),
                type: FinalVariables.TAB_TYPES_IFRAME
            }, true);
        }
    }
});