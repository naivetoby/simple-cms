package vip.toby.cms.core.annotation.interceptor;


import vip.toby.cms.core.util.FinalVariables;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({METHOD})
@Retention(RUNTIME)
public @interface AuthRequired {
    String[] module();

    FinalVariables.USER_AUTH value() default FinalVariables.USER_AUTH.DEFAULT;
}
