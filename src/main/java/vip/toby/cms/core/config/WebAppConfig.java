package vip.toby.cms.core.config;

import vip.toby.cms.core.interceptor.AuthInterceptor;
import vip.toby.cms.core.interceptor.GlobalInterceptor;
import vip.toby.cms.core.interceptor.LoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

@Configuration
class WebAppConfig implements WebMvcConfigurer {

    @Resource
    private AuthInterceptor authInterceptor;
    @Resource
    private GlobalInterceptor globalInterceptor;
    @Resource
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(globalInterceptor).addPathPatterns("/**").excludePathPatterns("/javascript/**", "/image/**", "/lib/**", "/stylesheet/**", "/assets/**");
        registry.addInterceptor(loginInterceptor).addPathPatterns("/**").excludePathPatterns("/javascript/**", "/image/**", "/lib/**", "/stylesheet/**", "/assets/**", "/", "/login", "/logout", "/favicon.ico");
        registry.addInterceptor(authInterceptor).addPathPatterns("/**").excludePathPatterns("/javascript/**", "/image/**", "/lib/**", "/stylesheet/**", "/assets/**", "/favicon.ico");
    }
}
