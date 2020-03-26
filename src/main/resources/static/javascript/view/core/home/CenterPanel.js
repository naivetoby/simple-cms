Ext.define('OA.view.core.home.CenterPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.centerpanel',
    requires: ['OA.view.core.BasePanel', 'OA.view.core.BaseDialog', 'OA.view.core.home.ResetPwdDialog', 'Ext.ux.TabReorderer', 'Ext.ux.TabCloseMenu'],
    id: FinalVariables.MAIN_TAB,
    plugins: [],
    plain: true,
    layout: 'fit',
    header: false,
    flex: 1,
    region: 'center',
    bodyStyle: {
        borderLeft: '0px',
        borderTop: '0px'
    },
    items: [{
        xtype: 'basepanel',
        title: '首页',
        id: FinalVariables.TAB_INDEX,
        border: false,
        bodyPadding: 20,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [

            // {
            //     flex: 1,
            //     border: false,
            //     layout: 'hbox',
            //     margin: '0 0 20 0',
            //     items: [
            //
            //         // {
            //         //     title: '新用户',
            //         //     xtype: 'panel',
            //         //     border: false,
            //         //     flex: 1,
            //         //     //bodyStyle: 'border:1px solid #ddd !important;',
            //         //     cls: 'index_page_panel_header',
            //         //     margin: '0 20 0 0',
            //         //     items: [{
            //         //         xtype: 'daynewuserstatistic'
            //         //     }]
            //         // }, {
            //         //     title: '活跃用户',
            //         //     xtype: 'panel',
            //         //     border: false,
            //         //     flex: 1,
            //         //     //bodyStyle: 'border:1px solid #ddd !important;',
            //         //     cls: 'index_page_panel_header',
            //         //     margin: '0 0 0 0',
            //         //     items: [{
            //         //         xtype: 'dayactiveuserstatistic'
            //         //     }]
            //         // }
            //
            //     ]
            // }, {
            //     flex: 1,
            //     border: false,
            //     layout: 'hbox',
            //     items: [
            //
            //         // {
            //         //     title: '留存率',
            //         //     xtype: 'panel',
            //         //     border: false,
            //         //     flex: 1,
            //         //     //bodyStyle: 'border:1px solid #ddd !important;',
            //         //     cls: 'index_page_panel_header',
            //         //     margin: '0 20 0 0',
            //         //     items: [{
            //         //         xtype: 'dayretentionratestatistic'
            //         //     }]
            //         // }, {
            //         //     title: '最高在线',
            //         //     id: 'panel',
            //         //     border: false,
            //         //     flex: 1,
            //         //     //bodyStyle: 'border:1px solid #ddd !important;',
            //         //     cls: 'index_page_panel_header',
            //         //     margin: '0 0 0 0',
            //         //     items: [{
            //         //         xtype: 'daypeakconcurrentuserstatistic'
            //         //     }]
            //         // }
            //
            //     ]
            // }

        ]
    }],
    initComponent: function () {
        if (!Ext.isIE10m) {
            this.plugins.push(Ext.create('Ext.ux.TabReorderer'));
        }
        this.plugins.push(Ext.create('Ext.ux.TabCloseMenu', {
            closeAllTabsText: '关闭所有',
            closeOthersTabsText: '关闭其他',
            closeTabText: '关闭'
        }));
        this.callParent();
    }
});