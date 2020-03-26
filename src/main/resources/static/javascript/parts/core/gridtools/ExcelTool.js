/**
 * 导出Excel工具，grid专用
 *
 * @author 陶开杰
 */
Ext.define('OA.parts.core.gridtools.ExcelTool', {
    extend: 'Ext.button.Split',
    alias: 'widget.exceltool',
    text: '导出为Excel',
    scale: 'small',
    enableToggle: true,
    iconCls: 'default_btn_icon_excel',
    handler: function (button, e) {
        button.maybeShowMenu();
    },
    menu: {
        plain: true,
        bodyStyle: {
            border: 'none'
        },
        style: {
            borderColor: '#5fb1f2',
            marginTop: '1px'
        },
        items: [
            {
                text: '全部数据',
                iconCls: 'default_btn_icon_excel',
                handler: function (item) {
                    var store = item.up('grid').store;
                    var sorts = [];
                    store.sorters.each(function (sort) {
                        sorts.push({
                            property: sort.property,
                            direction: sort.direction
                        });
                    });
                    BaseUtil.download(store.proxy.url + '/excel', {
                        start: 0,
                        limit: store.getTotalCount(),
                        filter: store.filters.items[0] ? store.filters.items[0].value : '',
                        base64Sort: BaseUtil.BASE64.encoder(Ext.JSON
                            .encode(sorts))
                    });
                }
            },
            {
                text: '选中数据',
                iconCls: 'default_btn_icon_excel',
                handler: function (item) {
                    var grid = item.up('grid');
                    var store = grid.store;
                    // 排序条件
                    var sorts = [];
                    store.sorters.each(function (sort) {
                        sorts.push({
                            property: sort.property,
                            direction: sort.direction
                        });
                    });
                    // 附加条件
                    var ids = [];
                    var selModel = grid.getSelectionModel();
                    if (selModel.hasSelection()) {
                        Ext.Array.each(selModel.getSelection(), function (item) {
                            var _id = Ext.isString(item.getId()) ? "'"
                                + item.getId() + "'" : item.getId();
                            ids.push(BaseUtil
                                    .toDBFieldName(item.idProperty)
                                + ' = ' + _id);
                        });
                        BaseUtil.download(store.proxy.url + '/excel', {
                            start: 0,
                            limit: store.getTotalCount(),
                            filter: ids.join(' OR '),
                            base64Sort: BaseUtil.BASE64.encoder(Ext.JSON
                                .encode(sorts))
                        });
                    } else {
                        BaseUtil.briefdialog('您没有选择需要导出的信息',
                            FinalVariables.WARNING_ICON);
                    }
                }
            },
            {
                text: '本页数据',
                iconCls: 'default_btn_icon_excel',
                handler: function (item) {
                    var store = item.up('grid').store;
                    var sorts = [];
                    store.sorters.each(function (sort) {
                        sorts.push({
                            property: sort.property,
                            direction: sort.direction
                        });
                    });
                    BaseUtil.download(store.proxy.url + '/excel', {
                        start: (store.currentPage - 1) * store.pageSize,
                        limit: store.pageSize,
                        filter: store.filters.items[0] ? store.filters.items[0].value : '',
                        base64Sort: BaseUtil.BASE64.encoder(Ext.JSON
                            .encode(sorts))
                    });
                }
            }]
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});