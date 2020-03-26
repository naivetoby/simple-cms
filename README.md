## Simple-CMS

 非常轻量级的 CMS 管理系统，使用 Spring-Boot 开发。

## Spring-Boot Dependency

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.2.5.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 数据库初始化
```text
1. 将 sql/cms.sql 中的 heart 替换成数据库的用户名
2. 再执行SQL完成初始化
```

## application.yml 配置
```yaml
#是否启用超级管理员
requireAdmin: true
#超级管理员登录名
superUserName: heart2015
#超级管理员密码
superUserPwd: heart2015
#是否为开发模式
isDevelopment: true
#登录错误次数上限
errorLoginCount: 3
#登录错误超过错误次数上限，用户锁定时间（分钟）
lockTime: 1
#保存标签的开启/关闭
saveLabel: false
#提示时间
tipTime: 7
```

## 许可证

[![license](https://img.shields.io/github/license/thinktkj/smrpc.svg?style=flat-square)](https://github.com/thinktkj/smrpc/blob/master/LICENSE)

使用 Apache License - Version 2.0 协议开源。