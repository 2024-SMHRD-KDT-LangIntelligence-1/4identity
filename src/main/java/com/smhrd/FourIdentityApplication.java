package com.smhrd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FourIdentityApplication {

    public static void main(String[] args) {
        SpringApplication.run(FourIdentityApplication.class, args);
        System.out.println("=================================================");
        System.out.println("       FourIdentity 서버가 시작되었습니다.");
        System.out.println("       접속 주소: http://localhost:8082/test");
        System.out.println("=================================================");
    }
}
