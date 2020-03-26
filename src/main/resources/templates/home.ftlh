<#include "header.ftlh">
<div id="userInfo" data-info="${Session.userBase64}"></div>
<div id="briefdialog">
    <img class="icon" src="image/succeed.png" width="36px" height="36px"><span class="msg"></span>
</div>
<div id="north">
    <table style="float: left; border-spacing: 0px;">
        <tr>
            <td style="padding-left: 10px; padding-right: 10px; width: 1px;">
                <!-- <img class="IEPNG" src="image/ext/logo-image.png" /> -->
            </td>
            <td>
                <h1 class="logo_title" style="margin-left: 5px; width: 560px; height: 38px; background: url(image/logo_white.png) no-repeat left top;"></h1>
            </td>
        </tr>
    </table>
    <table style="float: right; margin-right: 15px; border-spacing: 0px;">
        <tr>
            <td>
                <dl class="user_date_info" style="height: 58px; margin: 15px 20px 0px 0px; color: white;">
                    <dt style="font-size: 14px; margin-bottom: 10px; text-align: right;">
                        欢迎您，<span style="font-size: 20px; font-weight: bold; cursor: pointer;" title="功能设置" onclick="BaseUtil.showDefine('${Session.userjson?eval.userId}')">${Session.userjson?eval.userName}</span>
                    </dt>
                    <dt>
                        <span id="now_time" style="text-align: right; margin-left: 20px"></span>
                    </dt>
                </dl>
            </td>
            <td>
                <table class="banner">
                    <tr align="right">
                        <td>
                            <div id="closeDiv"></div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>