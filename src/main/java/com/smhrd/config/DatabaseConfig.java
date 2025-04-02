package com.smhrd.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {
    
    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);
    
    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource dataSource(DataSourceProperties properties) {
        log.info("데이터베이스 연결 정보: URL={}, Username={}", 
                properties.getUrl(), properties.getUsername());
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
    
    // DB 문제 발생시 주석 해제
    // /**
    //  * 데이터베이스 연결 테스트용 빈
    //  */
    // @Bean
    // public DatabaseConnectionTester databaseConnectionTester(@Autowired JdbcTemplate jdbcTemplate) {
    //     return new DatabaseConnectionTester(jdbcTemplate);
    // }
    
    // /**
    //  * 서버 시작 시 데이터베이스 연결을 테스트하는 내부 클래스
    //  */
    // static class DatabaseConnectionTester {
    //     private final JdbcTemplate jdbcTemplate;
        
    //     DatabaseConnectionTester(JdbcTemplate jdbcTemplate) {
    //         this.jdbcTemplate = jdbcTemplate;
    //         testConnection();
    //     }
        
    //     void testConnection() {
    //         try {
    //             String result = jdbcTemplate.queryForObject("SELECT 1", String.class);
    //             log.info("데이터베이스 연결 테스트 성공: {}", result);
    //         } catch (Exception e) {
    //             log.error("데이터베이스 연결 테스트 실패: {}", e.getMessage(), e);
    //         }
    //     }
    // }
}
