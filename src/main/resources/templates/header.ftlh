<!DOCTYPE HTML>
<html>
<head>
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