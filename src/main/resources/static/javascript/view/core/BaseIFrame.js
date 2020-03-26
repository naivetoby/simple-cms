/**
 * iframe基类，所有iframe都必须继承此类
 * 
 * @author 彭嘉辉
 */
Ext.define('OA.view.core.BaseIFrame', {
	extend : 'Ext.ux.IFrame',
	alias : 'widget.baseiframe',
	id : '',
	title : '',
	tabConfig : null,
	layout : 'fit',
	hideModel : 'display',
	loadMask : '页面加载中...',
	border : false,
	width : '100%',
	height : '100%',
	listeners : {
		show : function(tabPanel) {
			if (!tabPanel.isLoaded) {
				tabPanel.load(this.url);
				tabPanel.isLoaded = true;
			}
			BaseUtil.setTabCookie(tabPanel.id, this.cookieInfo);
		},
		destroy : function(tabPanel) {
			BaseUtil.removeTabCookie(tabPanel);
		}
	},
	initComponent : function() {
		this.cookieInfo = {
			title : this.title,
			type : this.type,
			module : this.module,
			userId : user.userId
		};
		this.callParent();
		BaseUtil.downloadIframe(this.module);
	}
});