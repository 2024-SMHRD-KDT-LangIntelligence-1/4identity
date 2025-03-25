package com.smhrd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class FourIdentityApplication {

    public static void main(String[] args) {
        SpringApplication.run(FourIdentityApplication.class, args);
    }
    
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // 리액트 앱의 빌드 결과물을 정적 리소스로 제공
                registry.addResourceHandler("/**")
                        .addResourceLocations("classpath:/static/");
            }
            
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // API 요청을 위한 CORS 설정
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowCredentials(true);
            }
        };
    }
}
