package vip.toby.cms.core.util;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.*;
import net.sf.cglib.reflect.FastClass;
import net.sf.cglib.reflect.FastMethod;
import vip.toby.cms.core.annotation.excel.ExcelRequired;
import vip.toby.cms.core.annotation.excel.ExcelTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The Class ExportExcel.
 */
public class ExportExcel {

    /**
     * 导出excel，无模板
     *
     * @param response    相应对象
     * @param fileName    文件名
     * @param listContent 文件内容
     * @param entityType  实体类型
     * @throws UnsupportedEncodingException
     */
    public static void exportExcel(HttpServletResponse response, String fileName, List<?> listContent, Class<?> entityType) throws UnsupportedEncodingException {
        exportExcel(response, null, fileName, listContent, entityType, null);
    }

    /**
     * 导出excel，有模板
     *
     * @param response     相应对象
     * @param request      请求对象
     * @param fileName     文件名
     * @param listContent  文件内容
     * @param entityType   实体类型
     * @param supTableData 主表对象
     * @throws UnsupportedEncodingException
     */
    public static void exportExcel(HttpServletResponse response, HttpServletRequest request, String fileName, List<?> listContent, Class<?> entityType, Object supTableData) throws UnsupportedEncodingException {
        response.reset();
        response.setHeader("Content-disposition", "attachment; filename=\"" + URLEncoder.encode(getExcelFileName(fileName), "utf-8") + "\"");
        response.setContentType("application/msexcel");
        // 以下开始输出到EXCEL
        try {
            ExcelTemplate excelTemplate = null;
            /** **********创建工作簿************ */
            WritableWorkbook workbook = Workbook.createWorkbook(response.getOutputStream());

            /** **********创建工作表************ */
            WritableSheet sheet = workbook.createSheet("Sheet1", 0);

            /** **********设置纵横打印（默认为纵打）、打印纸***************** */
            jxl.SheetSettings sheetset = sheet.getSettings();
            sheetset.setProtected(false);

            /** ************设置单元格字体************** */
            WritableFont NormalFont = new WritableFont(WritableFont.createFont("宋体"), 12);
            WritableFont BoldFont = new WritableFont(WritableFont.createFont("宋体"), 12, WritableFont.BOLD);

            /** ************以下设置三种单元格样式，灵活备用************ */
            // 用于标题居中
            WritableCellFormat wcf_center = new WritableCellFormat(BoldFont);
            wcf_center.setBorder(Border.LEFT, BorderLineStyle.THIN); // 线条
            wcf_center.setBorder(Border.RIGHT, BorderLineStyle.THIN);
            wcf_center.setBorder(Border.TOP, BorderLineStyle.THIN);
            wcf_center.setVerticalAlignment(VerticalAlignment.CENTRE); // 文字垂直对齐
            wcf_center.setAlignment(Alignment.CENTRE); // 文字水平对齐
            wcf_center.setWrap(false); // 文字是否换行

            // 用于正文居左
            WritableCellFormat wcf_left = new WritableCellFormat(NormalFont);
            wcf_left.setBorder(Border.ALL, BorderLineStyle.THIN); // 线条
            wcf_left.setVerticalAlignment(VerticalAlignment.CENTRE); // 文字垂直对齐
            wcf_left.setAlignment(Alignment.LEFT); // 文字水平对齐
            wcf_left.setWrap(false); // 文字是否换行

            Field[] fields = entityType.getSuperclass().getDeclaredFields();
            List<Field> supExcelFieldList = new ArrayList<>();
            for (Field field : fields) {
                if (field.isAnnotationPresent(ExcelRequired.class)) {
                    supExcelFieldList.add(field);
                }
            }
            List<Field> excelFieldList = new ArrayList<>();
            fields = entityType.getDeclaredFields();
            for (Field field : fields) {
                if (field.isAnnotationPresent(ExcelRequired.class)) {
                    excelFieldList.add(field);
                }
            }
            Map<Integer, Integer> columnBestWidth = new HashMap<>();
            /** ***************以下是EXCEL开头大标题，暂时省略********************* */
            sheet.mergeCells(0, 0, supExcelFieldList.size() + excelFieldList.size() - 1, 0);
            sheet.addCell(new Label(0, 0, fileName, wcf_center));
            /** ***************以下是EXCEL第一行列标题********************* */
            int cell = 0;
            for (int k = 0; k < supExcelFieldList.size(); k++) {
                sheet.addCell(new Label(k, 1, supExcelFieldList.get(k).getAnnotation(ExcelRequired.class).title(), wcf_center));
                cell++;
            }
            for (int k = 0; k < excelFieldList.size(); k++) {
                sheet.addCell(new Label(cell + k, 1, excelFieldList.get(k).getAnnotation(ExcelRequired.class).title(), wcf_center));
            }
            FastClass fastClass = null;
            // 写入主表信息
            if (supTableData != null) {
                fastClass = FastClass.create(supTableData.getClass().getSuperclass());
                for (Field field : supTableData.getClass().getSuperclass().getDeclaredFields()) {
                    if (field.isAnnotationPresent(ExcelRequired.class)) {
                        ExcelRequired excelRequired = field.getAnnotation(ExcelRequired.class);
                        sheet.addCell(new Label(excelRequired.x(), excelRequired.y(), getCellValue(field, supTableData.getClass().getSuperclass(), fastClass, supTableData).toString(), wcf_left));
                    }
                }
                fastClass = FastClass.create(supTableData.getClass());
                for (Field field : supTableData.getClass().getDeclaredFields()) {
                    if (field.isAnnotationPresent(ExcelRequired.class)) {
                        ExcelRequired excelRequired = field.getAnnotation(ExcelRequired.class);
                        sheet.addCell(new Label(excelRequired.x(), excelRequired.y(), getCellValue(field, supTableData.getClass(), fastClass, supTableData).toString(), wcf_left));
                    }
                }
            }
            /** ***************以下是EXCEL正文数据********************* */
            int i = 2;
            int j = 0;
            for (Object obj : listContent) {
                sheet.insertRow(i);
                int k = 0;
                fastClass = FastClass.create(entityType.getSuperclass());
                for (Field v : supExcelFieldList) {
                    ExcelRequired excelRequired = v.getAnnotation(ExcelRequired.class);
                    Object va = getCellValue(v, entityType.getSuperclass(), fastClass, obj);
                    sheet.addCell(new Label(k, i, va.toString(), wcf_left));
                    int width = excelRequired.width();
                    if (width == -1) {
                        width = va.toString().length() + getChineseNum(va.toString()) + 10; // 汉字占2个单位长度
                    }
                    columnBestWidth.put(k, width);
                    k++;
                }
                fastClass = FastClass.create(entityType);
                for (Field v : excelFieldList) {
                    ExcelRequired excelRequired = v.getAnnotation(ExcelRequired.class);
                    Object va = getCellValue(v, entityType, fastClass, obj);
                    sheet.addCell(new Label(k, i, va.toString(), wcf_left));
                    int width = excelRequired.width();
                    if (width == -1) {
                        width = va.toString().length() + getChineseNum(va.toString()) + 10; // 汉字占2个单位长度
                    }
                    columnBestWidth.put(k, width);
                    k++;
                }
                i++;
                j++;
            }
            // 设置每列宽
            for (int columnNumber : columnBestWidth.keySet()) {
                int width = columnBestWidth.get(columnNumber);
                if (width != 0) {
                    sheet.setColumnView(columnNumber, width);
                }
            }
            /** **********将以上缓存中的内容写到EXCEL文件中******** */
            workbook.write();
            /** *********关闭文件************* */
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static int getChineseNum(String context) {
        int lenOfChinese = 0;
        Pattern p = Pattern.compile("[\u4e00-\u9fa5]");
        Matcher m = p.matcher(context);
        while (m.find()) {
            lenOfChinese++;
        }
        return lenOfChinese;
    }

    private static String getExcelFileName(String fileName) {
        SimpleDateFormat simpleDF = new SimpleDateFormat("yyyyMMddhhmmss");
        return fileName.concat(simpleDF.format(System.currentTimeMillis())).concat(".xls");
    }

    private static Object getCellValue(Field v, Class<?> entityType, FastClass fastClass, Object obj) throws IntrospectionException, InvocationTargetException, IllegalArgumentException, IllegalAccessException {
        v.setAccessible(true);
        PropertyDescriptor propertyDescriptor = new PropertyDescriptor(v.getName(), entityType);
        Object va = null;
        Method method = null;
        try {
            method = entityType.getMethod(propertyDescriptor.getReadMethod().getName().concat("4Render"));
            FastMethod fastGetRender = fastClass.getMethod(method);
            va = fastGetRender.invoke(obj, new Object[]{});
        } catch (NoSuchMethodException e) {
            try {
                method = entityType.getMethod(propertyDescriptor.getReadMethod().getName());
                FastMethod fastGetRender = fastClass.getMethod(method);
                va = fastGetRender.invoke(obj, new Object[]{});
            } catch (Exception e2) {
                va = v.get(obj);
            }
        }
        if (va == null) {
            va = "";
        }
        return va;
    }
}
