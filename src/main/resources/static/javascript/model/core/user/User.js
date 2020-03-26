Ext.define('OA.model.core.user.User', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'userId',
		type : 'long',
		convert : null
	}, {
		name : 'userName',
		type : 'string',
		label : '用户名',
		queryAble : true
	}, {
		name : 'loginName',
		type : 'string',
		label : '登陆名',
		queryAble : true
	}, {
        name : 'phones',
        type : 'string',
        label : '手机号'
    }, {
		name : 'resetPwd',
		type : 'string'
	}, {
		name : 'deptId',
		type : 'long',
		convert : null,
		queryAble : true,
		combobox : 'userdeptcombo'
	}, {
		name : 'deptName',
		type : 'string'
	}, {
		name : 'roles',
		type : 'string'
	}, {
		name : 'auth',
		type : 'string'
	}, {
		name : 'status',
		type : 'int',
		queryAble : true,
		combobox : 'userstatuscombo'
	}, {
		name : 'indexNumber',
		type : 'int',
		convert : null
	} ],
	idProperty : 'userId'
});