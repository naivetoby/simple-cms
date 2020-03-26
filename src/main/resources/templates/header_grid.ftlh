<!DOCTYPE HTML>
<html>
<head>
    <base href="${global.basePath}">
    <title>Heart 综合管理平台</title>
    <style type="text/css">
        html {
            width: 100%;
            height: 100%;
        }
    </style>
    <script type="text/javascript">
        var isDevelopment = ${global.isDevelopment};
        var extUrl = '';
        if (isDevelopment) {
            extUrl = 'lib/ext4.2.1/ext-all-dev.js';
        } else {
            extUrl = 'lib/ext4.2.1/ext-all.js';
        }
    </script>
    <link type="text/css" rel="stylesheet" href="lib/ext4.2.1/resources/css/ext-all-neptune.css"/>
    <link type="text/css" rel="stylesheet" href="stylesheet/icon.css"/>
    <link type="text/css" rel="stylesheet" href="stylesheet/style.css"/>
    <link type="text/css" rel="stylesheet" href="stylesheet/grid_style.css"/>
    <link type="text/css" rel="stylesheet" href="lib/extensible/resources/css/extensible-all.css"/>
    <script type="text/javascript" src="lib/jquery/1.8.2/jquery.min.js"></script>