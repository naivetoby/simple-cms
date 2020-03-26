package vip.toby.cms.core.annotation.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * 数据导出成excel时调用的模板配置
 *
 * @author 彭嘉辉
 */
@Target({TYPE})
@Retention(RUNTIME)
public @interface ExcelTemplate {
    /**
     * 模板文件名
     */
    String name();

    /**
     * 数据开始纵坐标，从0开始
     */
    int y() default 2;
}
