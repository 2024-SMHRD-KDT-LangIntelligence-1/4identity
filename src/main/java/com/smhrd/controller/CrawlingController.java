package com.smhrd.controller;

import org.springframework.web.bind.annotation.GetMapping;

import com.smhrd.service.Crawler;

public class CrawlingController {
    private final Crawler crawler;

    public CrawlingController(Crawler crawler) {
        this.crawler = crawler;
    }

    @GetMapping("/start-crawl")
    public String startCrawl() {
        return crawler.getCrawledNews();
    }
}
