package vip.toby.cms.core.annotation.dao;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * 数据库视图注解
 *
 * @author 彭嘉辉
 */
@Target({TYPE})
@Retention(RUNTIME)
public @interface View {
    /**
     * 数据库视图名称
     */
    String name();
}
