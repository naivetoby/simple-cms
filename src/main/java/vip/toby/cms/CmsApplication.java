package vip.toby.cms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import vip.toby.cms.core.util.SpringContextUtil;

@SpringBootApplication
public class CmsApplication {

    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(CmsApplication.class, args);
        SpringContextUtil.setApplicationContext(applicationContext);
    }
}