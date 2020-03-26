package vip.toby.cms.core.dao.rowmapper;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.JdbcUtils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * 将查询结果映射成List<map> Map<数据库列名,值>
 */
public class CommonRowMapper implements RowMapper {

    @Override
    public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        ResultSetMetaData metaData = rs.getMetaData();
        int columnSize = metaData.getColumnCount();
        Map<String, Object> row = new HashMap<>();
        for (int columnIndex = 1; columnIndex <= columnSize; columnIndex++) {
            String key = JdbcUtils.lookupColumnName(metaData, columnIndex).toLowerCase();
            Object value = JdbcUtils.getResultSetValue(rs, columnIndex);
            row.put(key, value);
        }
        return row;
    }

}
