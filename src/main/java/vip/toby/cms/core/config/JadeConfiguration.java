package vip.toby.cms.core.config;

import net.paoding.rose.jade.context.spring.JadeBeanFactoryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class JadeConfiguration {

    @Bean
    public static JadeBeanFactoryPostProcessor jadeBeanFactoryPostProcessor() {
        return new JadeBeanFactoryPostProcessor();
    }
}
