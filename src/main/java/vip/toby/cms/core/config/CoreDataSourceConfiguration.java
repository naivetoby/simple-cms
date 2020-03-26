package vip.toby.cms.core.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import vip.toby.cms.core.util.CommonUtil;

import java.beans.PropertyVetoException;

@Configuration
class CoreDataSourceConfiguration {

    @Value("${spring.datasource.host}")
    private String host;
    @Value("${spring.datasource.port}")
    private String port;
    @Value("${spring.datasource.db.cms}")
    private String cmsDb;
    @Value("${spring.datasource.user}")
    private String user;
    @Value("${spring.datasource.password}")
    private String password;

    @Primary
    @Bean(value = "jade.dataSource.vip.toby.cms.core.dao")
    public ComboPooledDataSource coreDataSource() throws PropertyVetoException {
        return CommonUtil.createComboPooledDataSource(host, port, cmsDb, user, password);
    }

}
