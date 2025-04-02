package com.smhrd.controller;

import com.smhrd.model.News;
import com.smhrd.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class NewsController {
    
    private static final Logger log = LoggerFactory.getLogger(NewsController.class);
    
    @Autowired
    private NewsService newsService;
    
    @GetMapping("/byDate")
    public ResponseEntity<?> getNewsByDate(@RequestParam String date) {
        log.info("뉴스 조회 요청 - 날짜: {}", date);
        
        try {
            if (date == null || date.trim().isEmpty()) {
                log.error("날짜 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("날짜 파라미터가 필요합니다");
            }
            
            List<News> newsList = newsService.getNewsByDate(date);
            
            // 결과 로깅
            if (newsList.isEmpty()) {
                log.warn("해당 날짜({})에 해당하는 뉴스가 없습니다", date);
                return ResponseEntity.ok(newsList); // 빈 배열 반환
            } else {
                log.info("뉴스 조회 결과 - 날짜: {}, 조회된 뉴스 수: {}", date, newsList.size());
            }
            
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            log.error("뉴스 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
    
    @GetMapping("/topFive")
    public ResponseEntity<?> getTopFiveNewsByDate(
            @RequestParam String date, 
            @RequestParam(required = false) List<String> excludeTitles) {
        
        log.info("오늘의 주요 기사 조회 요청 - 날짜: {}, 제외할 제목 수: {}", 
                 date, 
                 excludeTitles != null ? excludeTitles.size() : 0);
        
        if (excludeTitles != null && !excludeTitles.isEmpty()) {
            log.debug("제외할 제목 샘플: {}", excludeTitles.get(0));
        }
        
        try {
            if (date == null || date.trim().isEmpty()) {
                log.error("날짜 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("날짜 파라미터가 필요합니다");
            }
            
            List<News> newsList = newsService.getTopFiveNewsByDate(date, excludeTitles);
            
            // 결과 로깅
            if (newsList.isEmpty()) {
                log.warn("해당 날짜({})에 해당하는 추가 뉴스가 없습니다", date);
                return ResponseEntity.ok(newsList); // 빈 배열 반환
            } else {
                log.info("주요 기사 조회 결과 - 날짜: {}, 조회된 뉴스 수: {}", date, newsList.size());
                if (newsList.size() > 0) {
                    log.debug("첫 번째 뉴스 제목: {}", newsList.get(0).getTitles());
                }
            }
            
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            log.error("주요 기사 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
    
    @GetMapping("/allDailyNews")
    public ResponseEntity<?> getAllDailyNews(@RequestParam String date) {
        log.info("일일 전체 뉴스 조회 요청 - 날짜: {}", date);
        
        try {
            if (date == null || date.trim().isEmpty()) {
                log.error("날짜 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("날짜 파라미터가 필요합니다");
            }
            
            Map<String, Object> allNews = newsService.getAllDailyNews(date);
            
            // 결과 로깅 (키워드 정보 포함)
            List<?> mainNews = (List<?>) allNews.get("mainNews");
            List<?> additionalNews = (List<?>) allNews.get("additionalNews");
            List<?> topKeywords = (List<?>) allNews.get("topKeywords");
            
            log.info("일일 전체 뉴스 조회 결과 - 날짜: {}, 메인 뉴스: {}, 추가 뉴스: {}, 상위 키워드: {}", 
                    date, 
                    mainNews != null ? mainNews.size() : 0, 
                    additionalNews != null ? additionalNews.size() : 0,
                    topKeywords != null ? topKeywords.size() : 0);
            
            return ResponseEntity.ok(allNews);
        } catch (Exception e) {
            log.error("일일 전체 뉴스 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
    
    // 키워드만 따로 가져오는 API 추가
    @GetMapping("/topKeywords")
    public ResponseEntity<?> getTopKeywordsByDate(@RequestParam String date) {
        log.info("날짜별 상위 키워드 조회 요청 - 날짜: {}", date);
        
        try {
            if (date == null || date.trim().isEmpty()) {
                log.error("날짜 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("날짜 파라미터가 필요합니다");
            }
            
            List<Map<String, Object>> topKeywords = newsService.getTopKeywordsByDate(date);
            
            // 결과 로깅
            log.info("날짜별 상위 키워드 조회 결과 - 날짜: {}, 키워드 수: {}", date, topKeywords.size());
            
            return ResponseEntity.ok(topKeywords);
        } catch (Exception e) {
            log.error("키워드 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
    
    /**
     * 사용자 관심사에 맞는 뉴스 조회 API
     */
    @GetMapping("/byUserInterest")
    public ResponseEntity<?> getNewsByUserInterest(
            @RequestParam String date,
            @RequestParam String userInterest) {
        
        log.info("사용자 관심사 기반 뉴스 조회 요청 - 날짜: {}, 관심사: {}", date, userInterest);
        
        try {
            if (date == null || date.trim().isEmpty()) {
                log.error("날짜 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("날짜 파라미터가 필요합니다");
            }
            
            if (userInterest == null || userInterest.trim().isEmpty()) {
                log.error("사용자 관심사 파라미터가 비어 있습니다");
                return ResponseEntity.badRequest().body("사용자 관심사 파라미터가 필요합니다");
            }
            
            List<News> newsList = newsService.getNewsByUserInterest(date, userInterest);
            
            // 결과 로깅
            if (newsList.isEmpty()) {
                log.warn("해당 날짜({})와 관심사({})에 해당하는 뉴스가 없습니다", date, userInterest);
                return ResponseEntity.ok(newsList); // 빈 배열 반환
            } else {
                log.info("사용자 관심사 기반 뉴스 조회 결과 - 날짜: {}, 관심사: {}, 조회된 뉴스 수: {}", 
                         date, userInterest, newsList.size());
                if (newsList.size() > 0) {
                    log.debug("첫 번째 뉴스 제목: {}", newsList.get(0).getTitles());
                }
            }
            
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            log.error("사용자 관심사 기반 뉴스 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
    
    // 서버 상태 확인용 엔드포인트
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("API 서버가 정상적으로 작동 중입니다");
    }
}
