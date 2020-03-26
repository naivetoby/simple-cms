<!DOCTYPE HTML>
<html>
<head>
    <title>Heart 综合管理平台</title>
    <style type="text/css">
        html {
            width: 100%;
            height: 100%;
        }
    </style>
    <link rel="stylesheet" href="stylesheet/login.css" type="text/css"/>
    <script type="text/javascript">
        var isDevelopment = ${global.isDevelopment};
    </script>
</head>
<body>
<div class="container">
    <div class="section-header">
        <div class="content"></div>
    </div>
    <div class="section-content">
        <form class="form-horizontal" id="form-login">
            <div style="height: 75px; line-height: 75px;">
                <label>账号：</label> <input type="text" id="loginName" name="loginName" class="login_input"/>
            </div>
            <div style="height: 75px; line-height: 75px;">
                <label>密码：</label> <input type="password" id="loginPassword" name="loginPassword" class="login_input"/>
            </div>
            <div id="submit-result">&nbsp;</div>
            <div style="height: 70px; line-height: 70px; margin-top: 12px;">
                <label class="checkbox"><input id="cookiesaved" type="checkbox"/><span style="margin-left: 8px;">记住帐号</span></label><input type="submit" id="login_submit" value="登录"/>
            </div>
        </form>
    </div>
</div>
<script type="text/javascript" src="lib/jquery/1.8.2/jquery.min.js" defer="defer"></script>
<script type="text/javascript" src="javascript/util/login.js" defer="defer"></script>
</body>
</html>