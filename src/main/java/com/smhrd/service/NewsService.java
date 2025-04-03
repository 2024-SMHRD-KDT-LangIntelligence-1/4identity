package com.smhrd.service;

import com.smhrd.model.News;
import com.smhrd.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NewsService {
    
    private static final Logger log = LoggerFactory.getLogger(NewsService.class);
    
    @Autowired
    private NewsRepository newsRepository;
    
    // 해당 날짜의 키워드 순위를 가져오는 메소드 추가
    public List<Map<String, Object>> getTopKeywordsByDate(String date) {
        log.info("날짜별 상위 키워드 조회 시작: {}", date);
        
        if (date == null || date.trim().isEmpty()) {
            log.error("날짜 파라미터가 비어 있습니다");
            return Collections.emptyList();
        }
        
        try {
            // 해당 날짜의 뉴스 목록 조회
            List<News> newsList = newsRepository.findNewsByDate(date);
            log.info("날짜 {} 에 해당하는 뉴스 수: {}", date, newsList.size());
            
            if (newsList.isEmpty()) {
                log.warn("해당 날짜({})에 뉴스가 없습니다", date);
                return Collections.emptyList();
            }
            
            // 키워드 카운트를 위한 맵
            Map<String, Integer> keywordCountMap = new HashMap<>();
            
            // 각 뉴스에서 키워드 추출 및 카운트
            for (News news : newsList) {
                String keywordsStr = news.getKeywords();
                if (keywordsStr == null || keywordsStr.trim().isEmpty()) {
                    continue;
                }
                
                try {
                    // JSON 배열 형식의 키워드 파싱 (["키워드1","키워드2",...])
                    keywordsStr = keywordsStr.trim();
                    if (keywordsStr.startsWith("[") && keywordsStr.endsWith("]")) {
                        keywordsStr = keywordsStr.substring(1, keywordsStr.length() - 1);
                        
                        // 쉼표로 분리하고 따옴표 제거
                        String[] keywords = keywordsStr.split(",");
                        for (String keyword : keywords) {
                            keyword = keyword.trim();
                            if (keyword.startsWith("\"") && keyword.endsWith("\"")) {
                                keyword = keyword.substring(1, keyword.length() - 1);
                            }
                            
                            if (!keyword.isEmpty()) {
                                keywordCountMap.put(keyword, keywordCountMap.getOrDefault(keyword, 0) + 1);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("키워드 파싱 중 오류: {}", e.getMessage(), e);
                }
            }
            
            log.info("총 고유 키워드 수: {}", keywordCountMap.size());
            
            // 카운트 결과를 리스트로 변환하고 정렬
            List<Map<String, Object>> sortedKeywords = new ArrayList<>();
            keywordCountMap.forEach((keyword, count) -> {
                Map<String, Object> keywordMap = new HashMap<>();
                keywordMap.put("keyword", keyword);
                keywordMap.put("count", count);
                sortedKeywords.add(keywordMap);
            });
            
            // 카운트 내림차순으로 정렬
            sortedKeywords.sort((a, b) -> {
                Integer countA = (Integer) a.get("count");
                Integer countB = (Integer) b.get("count");
                return countB.compareTo(countA);
            });
            
            // 상위 10개만 반환 (또는 전체 목록이 10개 미만이면 전체 반환)
            int limit = Math.min(10, sortedKeywords.size());
            List<Map<String, Object>> topKeywords = sortedKeywords.subList(0, limit);
            
            // 로그로 상위 키워드 출력
            if (!topKeywords.isEmpty()) {
                StringBuilder sb = new StringBuilder("상위 키워드: ");
                for (int i = 0; i < topKeywords.size(); i++) {
                    Map<String, Object> kw = topKeywords.get(i);
                    sb.append(kw.get("keyword")).append("(").append(kw.get("count")).append(")");
                    if (i < topKeywords.size() - 1) {
                        sb.append(", ");
                    }
                }
                log.info(sb.toString());
            }
            
            return topKeywords;
            
        } catch (Exception e) {
            log.error("키워드 처리 중 오류 발생: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    // 한 번에 8건의 뉴스를 선정하는 메소드 수정
    public Map<String, Object> getAllDailyNews(String date) {
        log.info("일일 전체 뉴스(메인 3건 + 추가 5건) 조회 시작: {}", date);
        
        if (date == null || date.trim().isEmpty()) {
            log.error("날짜 파라미터가 비어 있습니다");
            Map<String, Object> result = new HashMap<>();
            result.put("mainNews", Collections.emptyList());
            result.put("additionalNews", Collections.emptyList());
            result.put("topKeywords", Collections.emptyList());
            return result;
        }
        
        try {
            // 개선된 쿼리로 정확한 날짜를 포함하는 뉴스 검색
            List<News> allNewsList = newsRepository.findNewsByDate(date);
            log.info("검색된 총 뉴스 수: {}", allNewsList.size());
            
            if (allNewsList.isEmpty()) {
                log.warn("해당 날짜({})를 포함하는 뉴스가 없습니다", date);
                Map<String, Object> result = new HashMap<>();
                result.put("mainNews", Collections.emptyList());
                result.put("additionalNews", Collections.emptyList());
                result.put("topKeywords", Collections.emptyList());
                return result;
            }
            
            // 쉼표가 없는 뉴스만 필터링
            List<News> newsWithoutCommas = new ArrayList<>();
            
            for (News news : allNewsList) {
                String dates = news.getDates();
                if (dates == null) {
                    continue;
                }
                
                // 쉼표가 없는 뉴스만 선택
                if (!dates.contains(",")) {
                    newsWithoutCommas.add(news);
                }
            }
            
            log.info("쉼표가 없는 뉴스 수: {}", newsWithoutCommas.size());
            
            // 중복 제목을 확인하기 위한 Set (제목의 첫 6글자)
            Set<String> titlePrefixes = new HashSet<>();
            List<News> selectedNews = new ArrayList<>();
            
            // 제목의 첫 6글자가 중복되지 않는 뉴스를 최대 8개 선택
            for (News news : newsWithoutCommas) {
                String title = news.getTitles();
                
                // null이나 빈 제목은 건너뜀
                if (title == null || title.trim().isEmpty() || title.length() < 6) {
                    continue;
                }
                
                // 제목의 첫 6글자 추출
                String prefix = title.substring(0, Math.min(6, title.length()));
                
                // 첫 6글자가 중복되지 않는 경우만 추가
                if (!titlePrefixes.contains(prefix)) {
                    titlePrefixes.add(prefix);
                    selectedNews.add(news);
                    
                    // 8개 채우면 종료
                    if (selectedNews.size() == 8) {
                        break;
                    }
                }
            }
            
            // 충분한 뉴스를 찾지 못했다면, 내용이 다른 뉴스를 추가로 검색
            if (selectedNews.size() < 8) {
                log.info("첫 6글자 기준 뉴스가 부족하여 내용 기준으로 추가 검색합니다.");
                
                // 이미 선택된 뉴스의 요약 내용 집합
                Set<String> existingSummaries = selectedNews.stream()
                    .map(n -> n.getSummary() != null ? normalizeTitle(n.getSummary()) : "")
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());
                
                for (News news : newsWithoutCommas) {
                    // 이미 선택된 뉴스는 건너뜀
                    if (selectedNews.contains(news)) {
                        continue;
                    }
                    
                    String summary = news.getSummary();
                    if (summary == null || summary.trim().isEmpty()) {
                        continue;
                    }
                    
                    // 내용 정규화하여 중복 확인
                    String normalizedSummary = normalizeTitle(summary);
                    
                    // 중복되지 않는 내용의 뉴스만 추가
                    if (!normalizedSummary.isEmpty() && !existingSummaries.contains(normalizedSummary)) {
                        selectedNews.add(news);
                        existingSummaries.add(normalizedSummary);
                        
                        // 8개 채우면 종료
                        if (selectedNews.size() == 8) {
                            break;
                        }
                    }
                }
            }
            
            // 그래도 충분하지 않다면 남은 뉴스 추가
            if (selectedNews.size() < 8) {
                log.info("여전히 뉴스가 부족하여 남은 뉴스를 포함합니다.");
                
                for (News news : newsWithoutCommas) {
                    if (!selectedNews.contains(news)) {
                        selectedNews.add(news);
                        if (selectedNews.size() == 8) {
                            break;
                        }
                    }
                }
            }
            
            // 메인 뉴스와 추가 뉴스로 분리
            List<News> mainNews = selectedNews.size() > 3 ? selectedNews.subList(0, 3) : selectedNews;
            List<News> additionalNews = selectedNews.size() > 3 ? 
                selectedNews.subList(3, Math.min(8, selectedNews.size())) : 
                Collections.emptyList();
            
            log.info("최종 선정된 뉴스 - 메인: {}, 추가: {}", mainNews.size(), additionalNews.size());
            
            // 키워드 순위 가져오기
            List<Map<String, Object>> topKeywords = getTopKeywordsByDate(date);
            
            // 결과 맵 구성
            Map<String, Object> result = new HashMap<>();
            result.put("mainNews", mainNews);
            result.put("additionalNews", additionalNews);
            result.put("topKeywords", topKeywords);
            
            return result;
            
        } catch (Exception e) {
            log.error("일일 뉴스 조회 중 오류 발생: {}", e.getMessage(), e);
            Map<String, Object> result = new HashMap<>();
            result.put("mainNews", Collections.emptyList());
            result.put("additionalNews", Collections.emptyList());
            result.put("topKeywords", Collections.emptyList());
            return result;
        }
    }
    
    // 기존 메소드는 새 메소드를 호출하도록 수정
    public List<News> getNewsByDate(String date) {
        Map<String, Object> allDailyNews = getAllDailyNews(date);
        return (List<News>) allDailyNews.get("mainNews");
    }
    
    // 기존 메소드 수정하여 새 메소드를 호출하도록 변경
    public List<News> getTopFiveNewsByDate(String date, List<String> excludeTitles) {
        // 이제 이 메소드는 사용하지 않지만, 호환성을 위해 유지
        Map<String, Object> allDailyNews = getAllDailyNews(date);
        return (List<News>) allDailyNews.get("additionalNews");
    }
    
    // 제목 정규화 함수 추가
    private String normalizeTitle(String title) {
        if (title == null) return "";
        // 대소문자 구분 없이, 공백 및 특수문자 제거
        return title.toLowerCase()
                .replaceAll("\\s+", "")
                .replaceAll("[^a-z0-9가-힣]", "");
    }

    // 뉴스와 쉼표 수를 함께 관리하는 내부 클래스
    private static class NewsWithCommaCount {
        private final News news;
        private final long commaCount;
        
        public NewsWithCommaCount(News news, long commaCount) {
            this.news = news;
            this.commaCount = commaCount;
        }
        
        public News getNews() {
            return news;
        }
        
        public long getCommaCount() {
            return commaCount;
        }
    }
    
    /**
     * 사용자 관심사에 맞는 뉴스 조회
     * @param date 날짜
     * @param userInterest 사용자 관심사
     * @return 사용자 관심사에 맞는 뉴스 목록 (최대 5개)
     */
    public List<News> getNewsByUserInterest(String date, String userInterest) {
        log.info("사용자 관심사 기반 뉴스 조회 시작 - 날짜: {}, 관심사: {}", date, userInterest);
        
        if (date == null || date.trim().isEmpty()) {
            log.error("날짜 파라미터가 비어 있습니다");
            return Collections.emptyList();
        }
        
        if (userInterest == null || userInterest.trim().isEmpty()) {
            log.error("사용자 관심사 파라미터가 비어 있습니다");
            return Collections.emptyList();
        }
        
        try {
            // 사용자 관심사에 맞는 뉴스 검색
            List<News> matchedNews;
            
            // 콤마로 구분된 여러 관심사 처리
            if (userInterest.contains(",")) {
                List<String> categories = Arrays.stream(userInterest.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
                
                log.info("사용자가 여러 관심사를 가지고 있습니다: {}", categories);
                
                if (categories.isEmpty()) {
                    return Collections.emptyList();
                }
                
                matchedNews = newsRepository.findNewsByDateAndCategories(date, categories);
            } else {
                // 단일 관심사 처리
                matchedNews = newsRepository.findNewsByDateAndCategory(date, userInterest.trim());
            }
            
            log.info("사용자 관심사와 일치하는 뉴스를 {}개 찾았습니다", matchedNews.size());
            
            // 중복 제목 처리를 위한 Set
            Set<String> titlePrefixes = new HashSet<>();
            List<News> uniqueNews = new ArrayList<>();
            
            // 제목 중복 제거 및 최대 5개 선택
            for (News news : matchedNews) {
                String title = news.getTitles();
                
                // null이나 빈 제목은 건너뜀
                if (title == null || title.trim().isEmpty() || title.length() < 6) {
                    continue;
                }
                
                // 제목의 첫 6글자 추출
                String prefix = title.substring(0, Math.min(6, title.length()));
                
                // 첫 6글자가 중복되지 않는 경우만 추가
                if (!titlePrefixes.contains(prefix)) {
                    titlePrefixes.add(prefix);
                    uniqueNews.add(news);
                    
                    // 5개 채우면 종료
                    if (uniqueNews.size() == 5) {
                        break;
                    }
                }
            }
            
            log.info("최종 반환할 사용자 관심사 기반 뉴스: {}개", uniqueNews.size());
            return uniqueNews;
            
        } catch (Exception e) {
            log.error("사용자 관심사 기반 뉴스 조회 중 오류 발생: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}
