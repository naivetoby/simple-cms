package vip.toby.cms.core.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import vip.toby.cms.core.model.department.Department;

import java.beans.PropertyVetoException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 公共工具类
 */
public class CommonUtil {

    private final static Logger logger = LoggerFactory.getLogger(CommonUtil.class);

    public static String base64Encode(String data) {
        return Base64.encodeBase64String(data.getBytes(StandardCharsets.UTF_8));
    }

    public static String base64Decode(String data) {
        return new String(Base64.decodeBase64(data), StandardCharsets.UTF_8);
    }

    /**
     * Sha512加密算法.
     *
     * @param data 数据
     * @return 加密后的数据
     */
    public static String sha512(String data) {
        try {
            byte[] sha1data = MessageDigest.getInstance("SHA-512").digest(data.getBytes());
            return byte2hex(sha1data);
        } catch (NoSuchAlgorithmException e) {
            logger.error(e.getMessage(), e);
        }
        return "";
    }

    // 将字符串转换成二进制流
    public static byte[] hex2byte(String hex) {
        byte[] binary = new byte[hex.length() / 2];
        for (int i = 0; i < binary.length; i++) {
            binary[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return binary;
    }

    // 将二进制流转换成字符串
    public static String byte2hex(byte[] bytes) {
        BigInteger bi = new BigInteger(1, bytes);
        String hex = bi.toString(16);
        int paddingLength = (bytes.length * 2) - hex.length();
        if (paddingLength > 0) {
            return String.format("%0" + paddingLength + "d", 0) + hex;
        }
        return hex;
    }

    /**
     * 获取比较安全的随机数
     *
     * @return 比较安全的随机数
     */
    public static String getRandString(int length) {
        try {
            byte[] bytes = new byte[length / 2];
            SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG", "SUN");
            secureRandom.nextBytes(bytes);
            return byte2hex(bytes);
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            logger.error(e.getMessage(), e);
        }
        return "";
    }

    // 在比较哈希值的时候，经过固定的时间才返回结果,避免攻击
    public static boolean slowEquals(String oldPwd, String newPwd) {
        char[] a = oldPwd.toCharArray();
        char[] b = newPwd.toCharArray();
        int diff = a.length ^ b.length;
        for (int i = 0; i < a.length && i < b.length; i++) {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }

    /**
     * 将list对象转换成用给定分隔符隔开的字符串
     *
     * @param list      要转换的list对象
     * @param splitChar 分隔符
     * @return 隔开的字符串
     */
    public static String listToString(List<String> list, String splitChar) {
        if (list == null) {
            return null;
        }
        StringBuffer buffer = new StringBuffer();

        for (int i = 0; i < list.size(); i++) {
            buffer.append(list.get(i));

            if (i < list.size() - 1) {
                buffer.append(splitChar);
            }
        }

        return buffer.toString();
    }

    /**
     * 将数字类型的集合转化为字符串形式
     *
     * @param list 集合
     * @return 字符串
     */
    public static String listToString(List<? extends Number> list) {
        if (list == null) {
            return null;
        }
        StringBuffer buffer = new StringBuffer();

        for (int i = 0; i < list.size(); i++) {
            buffer.append(list.get(i).toString());

            if (i < list.size() - 1) {
                buffer.append(",");
            }
        }

        return buffer.toString();
    }

    /**
     * 合并多个角色的权限
     *
     * @param auths 权限集合
     * @return 合并后的权限
     */
    public static String getMergedAuth(List<String> auths) {
        String auth = "{\"0\":{}}";
        try {
            if (auths != null && auths.size() != 0) {
                JSONObject json = null;
                for (String str : auths) {
                    if (StringUtils.isNotBlank(str)) {
                        json = jsonMerge(json, JSONObject.parseObject(CommonUtil.base64Decode(str)));
                    }
                }
                auth = json.toString();
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return auth;
    }

    /*
     * 对两个权限json作或计算
     *
     * @param json1 json1
     *
     * @param json2 json2
     *
     * @return 或运算后的json
     */
    @SuppressWarnings({"unchecked"})
    private static JSONObject jsonMerge(JSONObject json1, JSONObject json2) throws Exception {
        if (json1 == null) {
            return json2;
        }
        // 新建json对象
        JSONObject json = new JSONObject();
        // 把key合并
        Set<String> keys = new HashSet<>(json1.keySet());
        keys.addAll(json2.keySet());
        for (String key : keys) {
            if (json1.containsKey(key) && json2.containsKey(key)) {
                Object o1 = json1.get(key);
                Object o2 = json2.get(key);
                if (o1 instanceof Integer && o2 instanceof Integer) {
                    json.put(key, (int) o1 | (int) o2);
                } else if (o1 instanceof JSONObject && o2 instanceof JSONObject) {
                    json.put(key, jsonMerge(JSONObject.parseObject(json1.getString(key)), JSONObject.parseObject(json2.getString(key))));
                }
            } else if (json1.containsKey(key)) {
                json.put(key, json1.get(key));
            } else {
                json.put(key, json2.get(key));
            }
        }
        return json;
    }

    /**
     * Find auth value.
     *
     * @param t the t
     * @param v the v
     * @param k the k
     * @return the integer
     */
    public static Integer findAuthValue(String t, Object v, String k) {
        if (t == null || v == null) {
            return null;
        }
        if (v instanceof Integer) {
            if (t.equals(k)) {
                return (Integer) v;
            }
            return null;
        }
        try {
            JSONObject obj = null;
            if (v instanceof JSONObject) {
                obj = (JSONObject) v;
            } else {
                obj = JSON.parseObject(v.toString());
            }
            Iterator<?> keys = obj.keySet().iterator();
            while (keys.hasNext()) {
                k = (String) keys.next();
                Integer c = findAuthValue(t, obj.get(k), k);
                if (c != null) {
                    return c;
                }
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }

    /**
     * Find leaf children.
     *
     * @param authJson  the auth json
     * @param modulePid the module pid
     * @return the JSON object
     */
    public static JSONObject findLeafChildren(JSONObject authJson, String modulePid) {
        Iterator<?> keys = authJson.keySet().iterator();
        while (keys.hasNext()) {
            String key = (String) keys.next();
            Object value = authJson.get(key);
            if (key.equals(modulePid)) {
                return (JSONObject) JSON.toJSON(value);
            } else if (value instanceof JSONObject) {
                JSONObject ids = findLeafChildren((JSONObject) JSON.toJSON(value), modulePid);
                if (ids != null) {
                    return ids;
                }
            }
        }
        return null;
    }

    /**
     * Gets the removed child dept list.
     *
     * @param depts  the depts
     * @param deptId the dept id
     * @return the removed child dept list
     */
    public static List<Department> getRemovedChildDeptList(List<Department> depts, Long deptId) {
        List<Department> removeDepts = new ArrayList<Department>();
        CommonUtil.reomveChild(depts, deptId, removeDepts);
        depts.removeAll(removeDepts);
        depts.add(0, new Department(-1l, "公司", 0));
        return depts;
    }

    /**
     * Reomve child.
     *
     * @param depts       the depts
     * @param pId         the id
     * @param removeDepts the remove depts
     */
    public static void reomveChild(List<Department> depts, Long pId, List<Department> removeDepts) {
        Iterator<?> iter = depts.iterator();
        while (iter.hasNext()) {
            Department dept = (Department) iter.next();
            Long id = dept.getDeptId();
            if (id.equals(pId)) {
                removeDepts.add(dept);
            }
            if (dept.getDeptPid().equals(pId)) {
                reomveChild(depts, id, removeDepts);
            }
        }
    }

    /**
     * Gets the date by millis.
     *
     * @param time    the time
     * @param pattern the pattern
     * @return the date by millis
     */
    public static String getDateByMillis(Long time, String pattern) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time);
        SimpleDateFormat format = null;
        try {
            format = new SimpleDateFormat(pattern);
        } catch (IllegalArgumentException e) {
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
        return format.format(cal.getTime());
    }

    /*
     * 查询json数组处理方法
     */
    private static JSONArray queryHandler(JSONArray data, JSONArray result, JSONObject c) {
        for (Object d : data) {
            JSONObject item = (JSONObject) JSON.toJSON(d);
            Object hit = item.get(c.getString("fieldName"));
            if (hit != null && c.getString("dataType").equals("string") && hit.toString().contains(c.getString("value"))) {// 字符串类型
                result.add(item);
            } else if (hit != null && c.getString("dataType").equals("int") && Integer.parseInt(hit.toString()) == c.getInteger("value")) {// 数字类型
                result.add(item);
            }
        }
        return result;
    }

    /**
     * url上中文的转码
     *
     * @param src 字符串
     * @return unicode编码后打字符串
     */
    public static String escape(String src) {
        int i;
        char j;
        StringBuffer tmp = new StringBuffer();
        tmp.ensureCapacity(src.length() * 6);
        for (i = 0; i < src.length(); i++) {
            j = src.charAt(i);
            if (Character.isDigit(j) || Character.isLowerCase(j) || Character.isUpperCase(j))
                tmp.append(j);
            else if (j < 256) {
                tmp.append("%");
                if (j < 16)
                    tmp.append("0");
                tmp.append(Integer.toString(j, 16));
            } else {
                tmp.append("%u");
                tmp.append(Integer.toString(j, 16));
            }
        }
        return tmp.toString();
    }

    /**
     * 拼接字符串，以","隔开
     *
     * @param str 需要拼接的字符串
     * @return 以","隔开的字符串
     */
    public static String concat(String... str) {
        StringBuffer buffer = new StringBuffer();
        for (int i = 0; i < str.length; i++) {
            String s = str[i];
            if (StringUtils.isBlank(s)) {
                continue;
            } else if (buffer.length() > 0 && i <= str.length - 1) {
                buffer.append(",");
            }
            buffer.append(s);
        }
        return buffer.toString();
    }

    /**
     * 判断对象是否为空，如果对象为字符串，""也算空
     *
     * @param obj 目标对象
     * @return true，为空，反之非空
     */
    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        }
        if (obj instanceof String) {
            return StringUtils.isBlank(obj.toString());
        }
        return false;
    }

    public static ComboPooledDataSource createComboPooledDataSource(String host, String port, String db, String user, String password) throws PropertyVetoException {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass("com.mysql.jdbc.Driver");
        dataSource.setJdbcUrl("jdbc:mysql://".concat(host).concat(":").concat(port).concat("/").concat(db).concat("?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2b8"));
        dataSource.setUser(user);
        dataSource.setPassword(password);
        dataSource.setAutoCommitOnClose(true);
        dataSource.setCheckoutTimeout(10000);
        dataSource.setMaxIdleTime(60);
        dataSource.setAcquireIncrement(3);
        dataSource.setAcquireRetryAttempts(30);
        dataSource.setAcquireRetryDelay(1000);
        dataSource.setInitialPoolSize(5);
        dataSource.setMinPoolSize(3);
        dataSource.setMaxPoolSize(100);
        dataSource.setIdleConnectionTestPeriod(60);
        return dataSource;
    }

    public static String formatLongToDateStr(Long timeL) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        if (timeL == null) {
            return sdf.format(new Date());
        }
        return sdf.format(new Date(timeL));
    }
}
