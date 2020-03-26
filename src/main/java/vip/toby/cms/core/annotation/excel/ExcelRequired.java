package vip.toby.cms.core.annotation.excel;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * 导出excel列配置
 * 
 * @author 陶开杰
 * 
 */
@Target({ FIELD })
@Retention(RUNTIME)
public @interface ExcelRequired {
	/**
	 * 列标题
	 */
	String title() default "";

	/**
	 * 列宽
	 */
	int width() default -1;

	/**
	 * 数据开始横坐标，从0开始
	 */
	int x() default 0;

	/**
	 * 数据开始纵坐标，从0开始
	 */
	int y() default 0;

	/**
	 * 合并单元格配置，格式{左上单元格列号,左上单元格行号,右下单元格列号,右下单元格行号}
	 */
	int[] mergeCellsConfig() default {};
}