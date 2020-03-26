var LoginUtil = null;
var LoadRes = null;
(function() {
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
	LoginUtil = {
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
		},
		setCookie : function(name, value) {
			var exp = new Date();
			exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
			document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
		},
		getCookie : function(name) {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null)
				return unescape(arr[2]);
			return null;
		},
		delCookie : function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = LoginUtil.getCookie(name);
			if (cval != null) {
				document.cookie = name + "=" + escape(cval) + ";expires=" + exp.toGMTString() + ";path=/";
			}
		},
		getNodeById : function(id) {
			return parent.document.getElementById(id);
		},
		getNodeByTagName : function(name) {
			return parent.document.getElementsByTagName(name)[0];
		}
	};

	LoadRes = {
		loadScript : (function() {
			var loadOne = function(url) {
				return parent.$.ajax({
					url : url,
					dataType : 'script',
					type : 'get',
					cache : true
				});
			};

			var load = function(urls, callback) {
				if (!parent.$.isArray(urls)) {
					return load([ urls ], callback);
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
		loadStyle : function(url) {
			var head = LoginUtil.getNodeByTagName('head');
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;
			head.appendChild(link);
		},
		loginOA : function() {
			$('#login_iframe', parent.document.body).css({
				'margin-top' : '0px',
				'display' : 'none'
			});
			$('#bestloader', parent.document.body).show();
			$.get('home?random=' + Math.random(), {}, function(data) {
				// 请求并加载系统登录以后的界面
				LoginUtil.getNodeById('home_page').innerHTML = data;
				// 加载运行入口js
				LoadRes.loadScript('javascript/app/core/HomeApp.js', function() {
					// 移除登录界面
					var iframe = LoginUtil.getNodeById('login_iframe');
					if (iframe.remove && typeof iframe.remove == 'function') {
						iframe.remove();
					} else {// ie
						iframe.removeNode(true);
					}
				});
			}, 'html');
		}
	};
})();
$(document).ready(function() {
	var extUrl = "";
	if (isDevelopment) {
		extUrl = 'lib/ext4.2.1/ext-all-dev.js';
	} else {
		extUrl = 'lib/ext4.2.1/ext-all.js';
	}
	LoadRes.loadScript(extUrl, function() {
		LoadRes.loadScript('lib/extensible/extensible-all.js', function() {
			LoadRes.loadScript([ 'lib/ext4.2.1/locale/ext-lang-zh_CN.js', 'lib/extensible/locale/extensible-lang-zh_CN.js', 'lib/ext4.2.1/ux/JCDateFormat.js', 'javascript/util/FinalVariables.js', 'javascript/util/Renderers.js', 'javascript/util/BaseUtil.js' ], function() {
				var cssRes = [ 'lib/ext4.2.1/resources/css/ext-all-neptune-beta.css', 'stylesheet/icon.css', 'stylesheet/style.css', 'stylesheet/grid_style.css', 'lib/extensible/resources/css/extensible-all.css' ];
				for ( var i in cssRes) {
					LoadRes.loadStyle(cssRes[i]);
				}
			});
		});
	});
	var user = LoginUtil.getCookie("user");
	if (user != null) {
		$("#loginName").val(user);
		$("#cookiesaved").attr('checked', 'checked');
	} else {
		$("#cookiesaved").removeAttr('checked', 'checked');
	}
	$('.form-horizontal .login_input').keydown(function() {
		$("#submit-result").css("visibility", "hidden");
	});
	$("#form-login").submit(function() {
		var loginBtn = $('#login_submit');
		loginBtn.attr('disabled', 'disabled');
		loginBtn.addClass('disabled');
		$.post('login', {
			loginName : $("#loginName").val(),
			loginPassword : $("#loginPassword").val()
		}, function(data) {
			if (data.error) {
				$("#submit-result").html(data.error);
				$("#submit-result").css("visibility", "visible");
				LoginUtil.delCookie('user');
				loginBtn.removeClass('disabled');
				loginBtn.removeAttr('disabled');
			} else {
				if ($("#cookiesaved").attr('checked')) {
					LoginUtil.setCookie("user", $("#loginName").val());
				} else {
					LoginUtil.delCookie('user');
				}
				try {
					LoadRes.loginOA();
				} catch (e) {
					console.log(e.name);
					window.location.reload();
				}
			}
		}, 'json');
		return false;
	});
});