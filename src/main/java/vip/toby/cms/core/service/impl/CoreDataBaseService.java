package vip.toby.cms.core.service.impl;

import vip.toby.cms.core.dao.IDAO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.sql.DataSource;

@Service
public class CoreDataBaseService extends DataBaseService {

    @Resource(name = "vip.toby.cms.core.dao.CoreDAO")
    private IDAO coreDAO;
    @Resource(name = "jade.dataSource.vip.toby.cms.core.dao")
    private DataSource dataSource;


    @Override
    public IDAO getDAO() {
        return coreDAO;
    }

    @Override
    public DataSource getDataSource() {
        return dataSource;
    }
}
