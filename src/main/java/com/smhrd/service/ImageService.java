package com.smhrd.service;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Service
public class ImageService {
    
    private static final Logger log = LoggerFactory.getLogger(ImageService.class);
    
    // 기본 이미지 크기 설정
    private static final int DEFAULT_WIDTH = 400;
    private static final int DEFAULT_HEIGHT = 200;
    
    // 대체 이미지 URL (유효하지 않은 이미지 URL 대신 사용)
    private static final String FALLBACK_IMAGE_URL = "https://via.placeholder.com/400x200?text=No+Image+Available";
    
    // 이미지 캐시 설정 (캐시 크기 제한 및 만료 설정)
    private final Cache<String, String> imageCache = Caffeine.newBuilder()
            .maximumSize(500)       // 최대 500개 이미지 캐시
            .expireAfterWrite(24, TimeUnit.HOURS)  // 24시간 후 만료
            .build();
    
    // 로딩 실패한 URL 추적 (불필요한 재시도 방지)
    private final Map<String, Long> failedUrls = new HashMap<>();
    private static final long RETRY_DELAY = 3600000; // 1시간 후 재시도
    
    /**
     * 이미지 URL 프로세싱 처리 개선
     * - 이미지 캐싱, 리사이징, 오류 처리를 담당
     * - CORS 문제 처리 추가
     * 
     * @param imageUrls DB에서 가져온 이미지 URL (콤마로 구분된 여러 URL 가능)
     * @return 처리된 이미지 URL
     */
    public String processImageUrl(String imageUrls) {
        if (imageUrls == null || imageUrls.trim().isEmpty()) {
            log.debug("빈 이미지 URL, 대체 이미지 반환");
            return FALLBACK_IMAGE_URL;
        }
        
        try {
            // 첫 번째 URL만 사용 (콤마로 구분된 경우)
            String imageUrl = imageUrls.split(",")[0].trim();
            
            // URL 유효성 검사
            if (!isValidImageUrl(imageUrl)) {
                log.debug("유효하지 않은 이미지 URL 형식: {}", imageUrl);
                return FALLBACK_IMAGE_URL;
            }
            
            // CORS 문제가 있는 도메인인지 확인 (예: 일부 뉴스 사이트)
            if (hasCorsIssue(imageUrl)) {
                log.debug("CORS 이슈가 있는 URL: {}, 이미지 프록시 사용", imageUrl);
                return proxyImage(imageUrl);
            }
            
            // 이미 처리에 실패한 URL인지 확인
            if (isFailedUrl(imageUrl)) {
                log.debug("이전에 실패한 URL: {}", imageUrl);
                return FALLBACK_IMAGE_URL;
            }
            
            // 캐시에서 이미지 URL 확인
            String cachedUrl = imageCache.getIfPresent(imageUrl);
            if (cachedUrl != null) {
                log.debug("캐시된 이미지 URL 반환: {}", imageUrl);
                return cachedUrl;
            }
            
            // 이미지 URL에 접근하여 유효성 테스트
            HttpURLConnection connection = (HttpURLConnection) new URL(imageUrl).openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(3000); // 3초 타임아웃
            connection.setReadTimeout(3000);
            
            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                log.warn("이미지 URL 접근 불가 (응답 코드: {}): {}", responseCode, imageUrl);
                addFailedUrl(imageUrl);
                return FALLBACK_IMAGE_URL;
            }
            
            // 이미지 크기가 큰 경우 Base64로 인코딩하여 리사이징
            if (isLargeImage(connection)) {
                log.info("큰 이미지 감지, 리사이징 진행: {}", imageUrl);
                String optimizedImage = resizeAndOptimizeImage(imageUrl);
                if (optimizedImage != null) {
                    imageCache.put(imageUrl, optimizedImage);
                    return optimizedImage;
                }
            }
            
            // 표준 크기 이미지는 원본 URL 그대로 사용
            imageCache.put(imageUrl, imageUrl);
            return imageUrl;
            
        } catch (Exception e) {
            log.error("이미지 처리 중 오류 발생: {}", e.getMessage());
            addFailedUrl(imageUrls.split(",")[0].trim());
            return FALLBACK_IMAGE_URL;
        }
    }
    
    /**
     * 이미지 URL 유효성 검사
     */
    private boolean isValidImageUrl(String url) {
        return url != null && (
            url.startsWith("http://") || 
            url.startsWith("https://") || 
            url.startsWith("data:image/")
        );
    }
    
    /**
     * CORS 이슈가 있는 도메인인지 확인
     */
    private boolean hasCorsIssue(String url) {
        try {
            URL imageUrl = new URL(url);
            String host = imageUrl.getHost().toLowerCase();
            
            // CORS 이슈가 흔한 뉴스 사이트 도메인 목록
            return host.contains("news.com") || 
                   host.contains("img.") || 
                   host.contains("images.") || 
                   host.contains("photo.");
                   
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * 이미지 프록시 처리 (Base64 인코딩으로 변환)
     */
    private String proxyImage(String imageUrl) {
        try {
            // 캐시에서 먼저 확인
            String cachedUrl = imageCache.getIfPresent(imageUrl);
            if (cachedUrl != null) {
                return cachedUrl;
            }
            
            // 이미지 다운로드 및 Base64 인코딩
            URL url = new URL(imageUrl);
            
            // User-Agent 설정하여 차단 방지
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            BufferedImage image = ImageIO.read(connection.getInputStream());
            if (image == null) {
                log.warn("이미지를 읽을 수 없음: {}", imageUrl);
                return FALLBACK_IMAGE_URL;
            }
            
            // 이미지 리사이징
            BufferedImage resizedImage = new BufferedImage(DEFAULT_WIDTH, DEFAULT_HEIGHT, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resizedImage.createGraphics();
            g.drawImage(image.getScaledInstance(DEFAULT_WIDTH, DEFAULT_HEIGHT, Image.SCALE_SMOOTH), 0, 0, null);
            g.dispose();
            
            // Base64 인코딩
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpeg", outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
            String dataUrl = "data:image/jpeg;base64," + base64Image;
            
            // 캐시에 저장
            imageCache.put(imageUrl, dataUrl);
            
            return dataUrl;
            
        } catch (Exception e) {
            log.error("이미지 프록시 처리 중 오류: {}", e.getMessage());
            return FALLBACK_IMAGE_URL;
        }
    }
    
    /**
     * 이미지가 큰지 확인 (Content-Length 헤더 확인)
     */
    private boolean isLargeImage(HttpURLConnection connection) {
        try {
            String contentLength = connection.getHeaderField("Content-Length");
            if (contentLength != null) {
                long size = Long.parseLong(contentLength);
                return size > 500 * 1024; // 500KB 이상은 큰 이미지로 간주
            }
        } catch (NumberFormatException e) {
            log.warn("Content-Length 파싱 오류", e);
        }
        return false;
    }
    
    /**
     * 이미지 리사이징 및 최적화
     */
    private String resizeAndOptimizeImage(String imageUrl) {
        try {
            // 이미지 다운로드
            URL url = new URL(imageUrl);
            BufferedImage originalImage = ImageIO.read(url);
            if (originalImage == null) {
                log.warn("이미지를 읽을 수 없음: {}", imageUrl);
                return null;
            }
            
            // 이미지 리사이징
            BufferedImage resizedImage = new BufferedImage(DEFAULT_WIDTH, DEFAULT_HEIGHT, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = resizedImage.createGraphics();
            g.drawImage(originalImage.getScaledInstance(DEFAULT_WIDTH, DEFAULT_HEIGHT, Image.SCALE_SMOOTH), 0, 0, null);
            g.dispose();
            
            // 이미지를 Base64로 인코딩
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "jpeg", outputStream);
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
            return "data:image/jpeg;base64," + base64Image;
            
        } catch (Exception e) {
            log.error("이미지 리사이징 중 오류: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * 실패한 URL 추가
     */
    private synchronized void addFailedUrl(String url) {
        failedUrls.put(url, System.currentTimeMillis());
    }
    
    /**
     * URL이 실패 목록에 있고 재시도 시간이 지나지 않았는지 확인
     */
    private synchronized boolean isFailedUrl(String url) {
        if (!failedUrls.containsKey(url)) {
            return false;
        }
        
        long failedTime = failedUrls.get(url);
        long currentTime = System.currentTimeMillis();
        
        // 재시도 시간이 지났으면 목록에서 제거
        if (currentTime - failedTime > RETRY_DELAY) {
            failedUrls.remove(url);
            return false;
        }
        
        return true;
    }
    
    /**
     * 정기적으로 만료된 실패 URL 정리 (1시간마다)
     */
    @Scheduled(fixedRate = 3600000)
    public void cleanupFailedUrls() {
        long currentTime = System.currentTimeMillis();
        failedUrls.entrySet().removeIf(entry -> 
            currentTime - entry.getValue() > RETRY_DELAY);
        log.debug("실패한 URL 목록 정리 완료, 현재 개수: {}", failedUrls.size());
    }
    
    /**
     * 여러 이미지 URL에서 사용 가능한 첫 번째 URL 반환
     */
    public String getFirstValidImageUrl(String imageUrls) {
        if (imageUrls == null || imageUrls.trim().isEmpty()) {
            return FALLBACK_IMAGE_URL;
        }
        
        String[] urls = imageUrls.split(",");
        for (String url : urls) {
            String processedUrl = processImageUrl(url.trim());
            if (!processedUrl.equals(FALLBACK_IMAGE_URL)) {
                return processedUrl;
            }
        }
        
        return FALLBACK_IMAGE_URL;
    }
    
    /**
     * 대체 이미지 URL 반환
     */
    public String getFallbackImageUrl() {
        return FALLBACK_IMAGE_URL;
    }
}
