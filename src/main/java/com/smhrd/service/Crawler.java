package com.smhrd.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class Crawler {

    private final String apiUrl = "http://211.188.56.71:8000/crawl_news";

    public String getCrawledNews() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(apiUrl, String.class);
    }

    // 10분마다 크롤링 실행
    @Scheduled(fixedRate = 600000, initialDelay = 0)
    public void scheculedCrawling() {
        System.out.println("10분 마다 크롤링 실행중...");
        String result = getCrawledNews();
        System.out.println("크롤링 결과: " + result);
    }
}
