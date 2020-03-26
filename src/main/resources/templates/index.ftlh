<!DOCTYPE HTML>
<html>
<head>
    <base href="${global.basePath}">
    <title>Heart 综合管理平台</title>
    <style type="text/css">
        body.login_body {
            margin: 0px;
            background: #f5f5f5 url(image/background.png) repeat;
        }

        #login_iframe {
            display: block;
            border: none;
            margin: 0px auto;
            margin-top: 170px;
            overflow: hidden;
        }

        /**刷新加载样式**/
        #bestloader {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            vertical-align: middle;
            background: white url(image/loading.gif) no-repeat center 36%;
            overflow: hidden;
        }
    </style>
    <script type="text/javascript" src="lib/jquery/1.8.2/jquery.min.js"></script>
    <script type="text/javascript">
        var isDevelopment = ${global.isDevelopment};
        var saveLabel = ${global.saveLabel};
        var tipTime = ${global.tipTime};
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
    </script>
</head>
<body class="login_body">
<input id="browser" type="hidden" value="">

<#if isLogin??>
<div id="bestloader"></div>
    <#include "home.ftlh">
<script type="text/javascript">
    // 加载资源文件
    var cssRes = ['lib/ext4.2.1/resources/css/ext-all-neptune-beta.css', 'stylesheet/icon.css', 'stylesheet/style.css', 'stylesheet/grid_style.css', 'lib/extensible/resources/css/extensible-all.css'];
    for (var i in cssRes) {
        LoadRes.loadStyle(cssRes[i]);
    }
    var extUrl = "";
    if (isDevelopment) {
        extUrl = 'lib/ext4.2.1/ext-all-dev.js';
    } else {
        extUrl = 'lib/ext4.2.1/ext-all.js';
    }
    LoadRes.loadScript(extUrl, function () {
        LoadRes.loadScript('lib/extensible/extensible-all.js', function () {
            LoadRes.loadScript(['lib/ext4.2.1/locale/ext-lang-zh_CN.js', 'lib/extensible/locale/extensible-lang-zh_CN.js', 'lib/ext4.2.1/ux/JCDateFormat.js', 'javascript/util/FinalVariables.js', 'javascript/util/Renderers.js', 'javascript/util/BaseUtil.js'], function () {
                LoadRes.loadScript('javascript/app/core/HomeApp.js');
            });
        });
    });
</script>
<#else>
<div id="bestloader" style="display: none;"></div>
<iframe id="login_iframe" src="login" width="500px" height="360px" frameborder="0"></iframe>
<div id="home_page"></div>
</#if>
<div id="resources" style="display: none;"></div>
</body>
</html>