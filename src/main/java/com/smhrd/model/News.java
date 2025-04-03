package com.smhrd.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Data;

@Data
@Entity
@Table(name = "TB_NEWS")
public class News {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NEWS_IDX")
    private Long newsIdx;
    
    @Column(name = "Titles")
    private String titles;
    
    @Column(name = "Summary")
    private String summary;
    
    @Column(name = "Dates")
    private String dates;
    
    @Column(name = "Press")
    private String press;
    
    @Column(name = "Images")
    private String images;
    
    @Column(name = "Keywords")
    private String keywords;
    
    @Column(name = "Category")
    private String category;
    
    @Column(name = "URLs")
    private String urls;
    
    // 필드명과 게터/세터 이름 일치시키기
    public String getTitles() {
        return titles;
    }
    
    public void setTitles(String titles) {
        this.titles = titles;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
    
    public String getDates() {
        return dates;
    }
    
    public void setDates(String dates) {
        this.dates = dates;
    }
    
    public String getImages() {
        return images;
    }
    
    public void setImages(String images) {
        this.images = images;
    }
    
    public String getKeywords() {
        return keywords;
    }
    
    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getUrls() {
        return urls;
    }
    
    public void setUrls(String urls) {
        this.urls = urls;
    }
    
    public String getPress() {
        return press;
    }
    
    public void setPress(String press) {
        this.press = press;
    }
}
