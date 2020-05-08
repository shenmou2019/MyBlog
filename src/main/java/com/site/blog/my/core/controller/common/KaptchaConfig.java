package com.site.blog.my.core.controller.common;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import com.google.code.kaptcha.util.Config;

import java.util.Properties;

/**
 * 实现验证码
 */
@Component
public class KaptchaConfig {
    @Bean
    public DefaultKaptcha getDefaultKaptcha(){

        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();

        Properties properties = new Properties();
        // 图片边框，合法值：yes[默认] , no
        properties.put("kaptcha.border", "no");
        // 字体颜色，合法值： r,g,b  或者 white,black,blue.默认black
        properties.put("kaptcha.textproducer.font.color", "black");
        // 图片宽，默认200
        properties.put("kaptcha.image.width", "150");
        // 图片高，默认50
        properties.put("kaptcha.image.height", "40");
        // 字体大小，默认40px
        properties.put("kaptcha.textproducer.font.size", "30");
        // session key，默认KAPTCHA_SESSION_KEY
        properties.put("kaptcha.session.key", "verifyCode");
        // 文字间隔，默认2
        properties.put("kaptcha.textproducer.char.space", "5");
        Config config = new Config(properties);

        defaultKaptcha.setConfig(config);

        return defaultKaptcha;
    }
}