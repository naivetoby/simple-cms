/**
 * 公共工具类
 */
var BaseUtil = null;
(function() {
	Ext.apply(Ext.form.field.VTypes, {
		repetition : function(val, field) {
			var tarVal = Ext.getCmp(field.target).value;
			return (tarVal == val);
		},
		password : function(val, field) {
			return /^\w{6}$/.test(val);
		},
		daterange : function(val, field) {
			var date = field.parseDate(val);
			if (!date) {
				return false;
			}
			if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
				var start = field.up('form').down('#' + field.startDateField);
				start.setMaxValue(date);
				start.validate();
				this.dateRangeMax = date;
			} else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
				var end = field.up('form').down('#' + field.endDateField);
				end.setMinValue(date);
				end.validate();
				this.dateRangeMin = date;
			}
			/*
			 * Always return true since we're only using this vtype to set the
			 * min/max allowed values (these are tested for after the vtype
			 * test)
			 */
			return true;
		},
		daterangeText : '开始日期必须小于结束日期'
	});
	var BASE64_MAPPING;
	BASE64_MAPPING = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/' ];
	var _toBinary = function(ascii) {
		var binary = new Array();
		while (ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		binary.reverse();
		return binary;
	};
	var _toDecimal = function(binary) {
		var dec = 0;
		var p = 0;
		for (var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if (b == 1) {
				dec += Math.pow(2, p);
			}
			++p;
		}
		return dec;
	};
	var _toUTF8Binary = function(c, binaryArray) {
		var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while (--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while (--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0, len = 8 - (c + 1);
		for (; i < len; ++i) {
			binary.push(binaryArray[i]);
		}

		for (var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while (--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};
	BaseUtil = {
		BASE64 : {
			/**
			 * BASE64 Encode
			 */
			encoder : function(str) {
				var base64_Index = [];
				var binaryArray = [];
				for (var i = 0, len = str.length; i < len; ++i) {
					var unicode = str.charCodeAt(i);
					var _tmpBinary = _toBinary(unicode);
					if (unicode < 0x80) {
						var _tmpdiff = 8 - _tmpBinary.length;
						while (--_tmpdiff >= 0) {
							_tmpBinary.unshift(0);
						}
						binaryArray = binaryArray.concat(_tmpBinary);
					} else if (unicode >= 0x80 && unicode <= 0x7FF) {
						binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
					} else if (unicode >= 0x800 && unicode <= 0xFFFF) {// UTF-8
						// 3byte
						binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
					} else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {// UTF-8
						// 4byte
						binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
					} else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {// UTF-8
						// 5byte
						binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
					} else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {// UTF-8
						// 6byte
						binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
					}
				}

				var extra_Zero_Count = 0;
				for (var i = 0, len = binaryArray.length; i < len; i += 6) {
					var diff = (i + 6) - len;
					if (diff == 2) {
						extra_Zero_Count = 2;
					} else if (diff == 4) {
						extra_Zero_Count = 4;
					}
					var _tmpExtra_Zero_Count = extra_Zero_Count;
					while (--_tmpExtra_Zero_Count >= 0) {
						binaryArray.push(0);
					}
					base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
				}

				var base64 = '';
				for (var i = 0, len = base64_Index.length; i < len; ++i) {
					base64 += BASE64_MAPPING[base64_Index[i]];
				}

				for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
					base64 += '=';
				}
				return base64;
			},
			/**
			 * BASE64 Decode for UTF-8
			 */
			decoder : function(_base64Str) {
				var _len = _base64Str.length;
				var extra_Zero_Count = 0;
				/**
				 * 计算在进行BASE64编码的时候，补了几个0
				 */
				if (_base64Str.charAt(_len - 1) == '=') {
					if (_base64Str.charAt(_len - 2) == '=') {// 两个等号说明补了4个0
						extra_Zero_Count = 4;
						_base64Str = _base64Str.substring(0, _len - 2);
					} else {// 一个等号说明补了2个0
						extra_Zero_Count = 2;
						_base64Str = _base64Str.substring(0, _len - 1);
					}
				}

				var binaryArray = [];
				for (var i = 0, len = _base64Str.length; i < len; ++i) {
					var c = _base64Str.charAt(i);
					for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
						if (c == BASE64_MAPPING[j]) {
							var _tmp = _toBinary(j);
							/* 不足6位的补0 */
							var _tmpLen = _tmp.length;
							if (6 - _tmpLen > 0) {
								for (var k = 6 - _tmpLen; k > 0; --k) {
									_tmp.unshift(0);
								}
							}
							binaryArray = binaryArray.concat(_tmp);
							break;
						}
					}
				}

				if (extra_Zero_Count > 0) {
					binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
				}

				var unicode = [];
				var unicodeBinary = [];
				for (var i = 0, len = binaryArray.length; i < len;) {
					if (binaryArray[i] == 0) {
						unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
						i += 8;
					} else {
						var sum = 0;
						while (i < len) {
							if (binaryArray[i] == 1) {
								++sum;
							} else {
								break;
							}
							++i;
						}
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
						i += 8 - sum;
						while (sum > 1) {
							unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
							i += 8;
							--sum;
						}
						unicode = unicode.concat(_toDecimal(unicodeBinary));
						unicodeBinary = [];
					}
				}
				return unicode;
			},
			decoder2 : function(_base64Str) {
				var array = this.decoder(_base64Str);
				var str = '';
				for (var i = 0, len = array.length; i < len; ++i) {
					str += String.fromCharCode(array[i]);
				}
				return str;
			}
		},
		briefdialog : function(msg, type, callback, time) {
			callback = Ext.isFunction(callback) ? callback : function() {
			};
			type = type || FinalVariables.SUCCESS_ICON;
			if (type == FinalVariables.ERROR_ICON) {
				$('#briefdialog .icon').attr('src', 'image/error.png');
			} else if (type == FinalVariables.SUCCESS_ICON) {
				$('#briefdialog .icon').attr('src', 'image/succeed.png');
			} else if (type == FinalVariables.WARNING_ICON) {
				$('#briefdialog .icon').attr('src', 'image/warn.png');
			}
			$('#briefdialog .msg').html('&nbsp;' + msg);
			var w = $('#briefdialog').width();
			$('#briefdialog').css('margin-left', '-' + w / 2 + 'px');
			if (type == FinalVariables.WARNING_ICON) {
				time = time || 3000;
				$('#briefdialog').on('mouseover', function() {
					$('#briefdialog').stop(true, true).fadeIn(1000);
				});
				$('#briefdialog').on('mouseleave', function() {
					$('#briefdialog').fadeOut(time, callback);
				});
				$('#briefdialog').fadeIn(1000).fadeOut(time, callback);
			} else {
				time = time || 2000;
				$('#briefdialog').animate({
					'opacity' : 'show'
				}, 'slow', function() {
					setTimeout(function() {
						$('#briefdialog').animate({
							'opacity' : 'hide'
						}, 1000, function() {
							callback();
						});
					}, time);
				});
			}

		},
		errorHandler : function(status, callback, batch, options) {
			var self = this;
			switch (status) {
			case 403:
				if (isDevelopment) {
					self.briefdialog('权限不够啊，检查一下角色权限配置对没有', FinalVariables.ERROR_ICON, null, 5000);
				} else {
					self.briefdialog('对不起,无权限访问!', FinalVariables.ERROR_ICON);
				}
				break;
			case 408:
				var location = (parent && parent.window) ? parent.window.location : window.location;
				location.reload();
				break;
			case 409:
				var i = 3;
				var t = '';
				t = setInterval(function() {
					i--;
					$("#briefdialog .msg").text('权限已被修改,' + i + ' 秒后将自动刷新页面...');
					if (i == 0) {
						clearInterval(t);
					}
				}, 1000);
				self.briefdialog('权限已被修改, 3 秒后将自动刷新页面...', FinalVariables.SUCCESS_ICON, function() {
					var location = (parent && parent.window) ? parent.window.location : window.location;
					location.reload();
				}, 3000);
				break;
			case 410:
				var mainTab = parent.Ext.getCmp(FinalVariables.MAIN_TAB);
				var moduleTree = parent.Ext.getCmp('left_panel');
				var activeTab = mainTab.getActiveTab();
				var closableItems = [];
				mainTab.items.each(function(item) {
					if (item.closable && item.id != activeTab.id) {
						closableItems.push(item);
					}
				});
				Ext.Array.each(closableItems, function(item) {
					mainTab.remove(item);
				});
				moduleTree.store.reload();
				BaseUtil.briefdialog('操作成功');
				break;
			default:
				if (Ext.isFunction(callback)) {
					callback(batch, options);
				} else {
					if (isDevelopment) {
						if (status >= 500) {
							self.briefdialog('报' + status + '错误啦，看看后台报什么错吧', FinalVariables.ERROR_ICON, null, 5000);
						} else if (status == 404) {
							self.briefdialog('报' + status + '错误啦，检查一下路径有没写对', FinalVariables.ERROR_ICON, null, 5000);
						} else if (status == 0) {
							self.briefdialog('报' + status + '错误啦，是不是没有起服务呢？', FinalVariables.ERROR_ICON, null, 5000);
						} else {
							self.briefdialog('报' + status + '错误啦', FinalVariables.ERROR_ICON, null, 5000);
						}
					} else {
						self.briefdialog('对不起,服务器异常!', FinalVariables.ERROR_ICON);
					}
				}
				break;
			}
		},
		request : function(obj) {// obj的格式与Ext.Ajax.request的参数一致
			var self = this;
			obj = obj || {};
			Ext.Ajax.request({
				url : obj.url,
				method : obj.method ? obj.method : 'post',
				params : obj.params ? obj.params : {},
				success : function(response) {
					var isError = false;
					try {
						var data = response.responseText;
						if (!Ext.isEmpty(data)) {
							var returnJson = Ext.JSON.decode(data);
							if (returnJson && returnJson[FinalVariables.ERROR_MSG]) {
								isError = true;
								BaseUtil.briefdialog(returnJson[FinalVariables.ERROR_MSG], FinalVariables.WARNING_ICON);
							}
						}
					} catch (e) {
						isError = true;
					}
					if (!isError) {
						if (Ext.isFunction(obj.success)) {
							obj.success(response);
						} else {
							self.briefdialog('操作成功');
						}
					}
				},
				failure : function(response) {
					self.errorHandler(response.status, obj.failure, response);
				}
			});
		},
		// 存cookie
		setCookie : function setCookie(name, value) {
			var cp = Ext.state.Manager.getProvider();
			cp.set(name, value);
		},
		// 取cookies
		getCookie : function getCookie(name) {
			var cp = Ext.state.Manager.getProvider();
			return cp.get(name);
		},
		// 删除cookie
		delCookie : function delCookie(name) {
			var cp = Ext.state.Manager.getProvider();
			cp.clear(name);
		},
		setTabCookie : function(tabId, cookieInfo) {
			var tabs = BaseUtil.getCookie(FinalVariables.TABS);
			var obj = {};
			obj[tabId] = cookieInfo;
			if (!tabs) {
				tabs = obj;
			} else {
				Ext.apply(tabs, obj);
			}
			BaseUtil.setCookie(FinalVariables.ACTIVE_ID, tabId);
			BaseUtil.setCookie(FinalVariables.TABS, tabs);
		},
		removeTabCookie : function(tab) {
			var tabs = BaseUtil.getCookie(FinalVariables.TABS);
			if (tabs) {
				delete tabs[tab.id];
				this.setCookie(FinalVariables.TABS, tabs);
			}
		},
		/**
		 * 新增一个标签页，标签页分三种，普通表单（general）、iframe页面（iframe） tabId : String tabInfo =
		 * {recordId(general,workflow)
		 * :long(通过record.getId()获取),className(general) : String, title :
		 * String,type : String(从FinalVariables中寻找TAB_TYPES_*), items(general) :
		 * [{values(必须) : obj(通过record.getData()获取),grid(可选) :
		 * obj}],url(iframe,general) : String} autoShow : boolean
		 */
		showTab : function(tabId, tabInfo, autoShow) {
			var mainTab = Ext.getCmp(FinalVariables.MAIN_TAB);
			if (!mainTab) {
				mainTab = parent.Ext.getCmp(FinalVariables.MAIN_TAB);
			}
			var t = Ext.getCmp(tabId);
			if (!t) {
				t = parent.Ext.getCmp(tabId);
			}
			if (!t) {// 判断是否已经打开了该模块页面
				if (tabInfo.type == FinalVariables.TAB_TYPES_IFRAME) {// 打开新iframe页面
					mainTab.add({
						xtype : 'baseiframe',
						id : tabId,
						module : tabInfo.module,
						title : tabInfo.title,
						url : tabInfo.url,
						type : tabInfo.type,
						closable : true
					});
				} else {
					mainTab.add({
						xtype : 'basepanel',
						recordId : tabInfo.recordId,
						className : tabInfo.className,
						viewAlias : tabInfo.viewAlias,
						id : tabId,
						url : tabInfo.url,
						authValue : tabInfo.items[0].authValue,
						title : tabInfo.title,
						items : tabInfo.items,
						type : tabInfo.type,
						closable : true
					});
				}
			}
			if (autoShow) {
				mainTab.setActiveTab(tabId);
			}
		},
		/**
		 * 从cookie中读取上次登录打开的tab页
		 */
		loadTab : function(tabId, cookieInfo, autoShow) {
			var mainTab = Ext.getCmp(FinalVariables.MAIN_TAB);
			if (!mainTab) {
				mainTab = parent.Ext.getCmp(FinalVariables.MAIN_TAB);
			}
			var t = Ext.getCmp(tabId);
			if (!t) {// 判断是否已经打开了该模块页面
				// 打开普通表单页面
				if (cookieInfo.recordId) {// 编辑
					BaseUtil.request({
						url : cookieInfo.url + '/' + cookieInfo.recordId,
						method : 'GET',
						success : function(response) {
							if (!Ext.getCmp(tabId)) {
								var values = Ext.JSON.decode(response.responseText);
								if (!Ext.isEmpty(values)) {
									mainTab.add({
										xtype : 'basepanel',
										recordId : cookieInfo.recordId,
										className : cookieInfo.className,
										viewAlias : cookieInfo.viewAlias,
										id : tabId,
										url : cookieInfo.url,
										title : cookieInfo.title,
										authValue : cookieInfo.authValue,
										items : [ {
											xtype : cookieInfo.viewAlias,
											values : values,
											authValue : cookieInfo.authValue
										} ],
										type : cookieInfo.type,
										closable : true
									});
									if (autoShow) {
										mainTab.setActiveTab(tabId);
									}
								}
							}
						},
						failure : function(e) {
							// console.log(e);
						}
					});
				} else {// 新增
					mainTab.add({
						xtype : 'basepanel',
						className : cookieInfo.className,
						viewAlias : cookieInfo.viewAlias,
						id : tabId,
						title : cookieInfo.title,
						items : [ {
							xtype : cookieInfo.viewAlias,
							isAdd : true
						} ],
						type : cookieInfo.type,
						closable : true
					});
				}
			}
			if (autoShow) {
				mainTab.setActiveTab(tabId);
			}
		},
		/**
		 * 下载附件
		 */
		download : function(url, params) {
			params = params || {};
			var children = {};
			var childrens = [];
			for ( var key in params) {
				children = {
					tag : 'input',
					name : key,
					value : params[key]
				};
				childrens.push(children);
			}
			var form = Ext.fly('down_load_form');
			if (form) {
				form.destroy();
			}
			var dh = Ext.DomHelper;
			var spec = {
				id : 'down_load_form',
				tag : 'form',
				method : 'post',
				action : url,
				target : FinalVariables.DOWNLOAD_IFRAME,
				children : childrens
			};
			form = dh.append(Ext.getBody(), spec);
			form.submit();
		},
		/**
		 * 生成下载文件的iframe
		 */
		downloadIframe : function() {
			var iframe = Ext.fly(FinalVariables.DOWNLOAD_IFRAME);
			if (iframe) {
				iframe.destroy();
			}
			var dh = Ext.DomHelper;
			var iframeConfig = {
				id : FinalVariables.DOWNLOAD_IFRAME,
				name : FinalVariables.DOWNLOAD_IFRAME,
				tag : 'iframe',
				style : {
					display : 'none'
				}
			};
			iframe = dh.append(Ext.getBody(), iframeConfig);
			iframe.contentWindow.name = FinalVariables.DOWNLOAD_IFRAME;
		},
		/**
		 * 将前端模型对象字段名转换成后台数据库字段名
		 * 
		 * @param {String}
		 *            fieldName 前端模型对象字段名
		 * @return {String} 后台数据库字段名
		 */
		toDBFieldName : function(fieldName) {
			// 后台数据库字段名
			var dbFieldName = null;

			// 字符串转字符数组
			var charArr = fieldName.match(/./g);
			for (var i = 0; i < charArr.length; i++) {
				if ((charArr[i].charCodeAt(0) >= 65) && (charArr[i].charCodeAt(0) <= 90)) {// 判断是否大写
					charArr[i] = charArr[i].toLowerCase();
					charArr.splice(i, 0, '_');
				}
			}
			// 字符数组转字符串
			dbFieldName = charArr.join('');

			return dbFieldName;
		},
		resetPwd : function() {
			if (user && user.userId === -1) {
				BaseUtil.briefdialog('对不起，超级管理员无法修改密码', FinalVariables.WARNING_ICON);
				return;
			}
			var dialog = Ext.getCmp('reset_pwd_dialog');
			if (dialog) {
				// 销毁旧窗口，不然下拉框赋值有时候会出错
				dialog.destroy();
			}
			// 创建新窗口
			dialog = Ext.widget({
				id : 'reset_pwd_dialog',
				xtype : 'resetpwddialog',
				title : '修改密码'
			});
			dialog.show();
		},
		showDefine : function(userId) {
			Ext.require('OA.view.core.define.DefineDialog', function() {
				// 创建新窗口
				dialog = Ext.widget({
					userId : userId,
					xtype : 'definedialog'
				});
				dialog.show();
			});
		},
		resetPwd4Inactive : function() {
			Ext.require('OA.view.core.home.ResetPwd4InactiveDialog', function() {
				var dialog = Ext.getCmp('inactive_dialog');
				if (dialog) {
					// 销毁旧窗口，不然下拉框赋值有时候会出错
					dialog.destroy();
				}
				// 创建新窗口
				dialog = Ext.widget({
					id : 'inactive_dialog',
					xtype : 'inactivedialog'
				});
				dialog.show();
			});
		},
		isImportantRole : function(roleType) {
			return Ext.Array.contains(FinalVariables.IMPRORTANT_ROLE, roleType);
		},
		/**
		 * 关闭当前标签页
		 */
		closeActiveTab : function() {
			var activeTab = Ext.getCmp(FinalVariables.MAIN_TAB).getActiveTab();
			if (Ext.isFunction(activeTab.close) && activeTab.closable) {
				activeTab.close();
			}
		}
	};
})();