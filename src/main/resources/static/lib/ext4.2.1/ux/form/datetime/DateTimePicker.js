/**
 * 带时分秒的时间控件选择器
 * @author linzhichao
 */
Ext.define('Ext.ux.form.datetime.DateTimePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    alternateClassName: 'Ext.DateTimePicker',
    renderTpl: [
        '<div id="{id}-innerEl">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                                '<em role="presentation"><span role="presentation"></span></em>',
                            '</a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" role="presentation"   class="{baseCls}-footer">{%this.renderHour(values, out)%}{%this.renderMinute(values, out)%}{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return value.substr(2);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            longDay: function(value){
                return Ext.Date.format(value, this.longDayFormat);
            },
            renderHour: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.hour.getRenderTree(), out);
            },
            renderMinute: function(values, out) {
                out.push('<div><div style="float : left;margin: 3px 8px 0px 0px;font-weight:bold;">&nbsp;:&nbsp;</div></div>');
                Ext.DomHelper.generateMarkup(values.$comp.minute.getRenderTree(), out);
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
    /**
     * 创建时分秒控件
     */
    beforeRender: function () {
        /**---------------------*/
        var me = this;
        me.hour = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
           	minValue: 0,
           	maxValue: 23,
        	margin : '0px 5px 5px 5px',
           	width: 60,
           	style : {float:"left"},
           	cls : 'date-time',
           	enableKeyEvents: true,
           	listeners: {
                 keyup: function(field, e){
                     if (field.getValue() > 23){
                         e.stopEvent();
                         field.setValue(23);
                     }
                 }
             }
        });
        
        me.minute = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
           	style : {float:"left"},
           	cls : 'date-time',
           	margin : '0px 5px 5px 0px',
            ownerLayout: me.getComponentLayout(),
        	minValue: 0,
        	maxValue: 59,
        	width: 60,
        	enableKeyEvents: true,
        	listeners: {
                keyup: function(field, e){
                    if (field.getValue() > 59){
                        e.stopEvent();
                        field.setValue(59);
                    }
                }
            }
        });
        
        me.callParent();
    },

    /**
     * 渲染时分秒控件
     */
    finishRenderChildren: function () {
        this.callParent();
        /**--------------------------------------*/
        this.hour.finishRender();
        this.minute.finishRender();
        /**--------------------------------------*/
    },
    /**
     * Update the contents of the picker
     * @private
     * @param {Date} date The new date
     * @param {Boolean} forceRefresh True to force a full refresh
     */
    update : function(date, forceRefresh){
        var me = this;
		/**-----------设置时分秒----------------*/
        date.setHours(me.hour.getValue());
    	date.setMinutes(me.minute.getValue());
		/**-----------设置时分秒----------------*/
    	
        me.callParent(arguments);
    }
});