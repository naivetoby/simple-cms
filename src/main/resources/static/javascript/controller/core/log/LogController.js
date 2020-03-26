Ext.define('OA.controller.core.log.LogController', {
	extend : 'Ext.app.Controller',
	models : [ 'core.log.Log' ],
	stores : [ 'core.log.Logs' ],
	views : [ 'core.DataGrid' ]
});