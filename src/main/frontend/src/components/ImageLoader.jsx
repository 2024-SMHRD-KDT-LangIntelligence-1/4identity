import React, { useState, useEffect } from 'react';
import './ImageLoader.css';

// 전역 이미지 캐시 (컴포넌트 간 공유)
const imageCache = new Map();

// Base64로 인코딩된 간단한 "No Image" 이미지 (외부 URL 의존성 제거)
const BASE64_FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbW5pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

// 기본 대체 이미지 - 외부 URL 대신 Base64 이미지 사용
const DEFAULT_FALLBACK = BASE64_FALLBACK_IMAGE;

// 외부로 내보내서 다른 컴포넌트에서도 사용할 수 있게 함
export const FALLBACK_IMAGE = DEFAULT_FALLBACK;

/**
 * 이미지 로딩 및 오류 처리를 위한 컴포넌트
 * - 이미지 로드 실패 시 대체 이미지 표시
 * - 지연 로딩 지원
 * - 이미지 캐시 기능
 */
const ImageLoader = ({ 
  src, 
  alt = '이미지', 
  fallbackSrc = DEFAULT_FALLBACK, 
  className = '', 
  width, 
  height,
  lazyLoad = true, // 기본적으로 지연 로딩 활성화
  ...props 
}) => {
  // 실제 표시할 이미지 소스 상태
  const [imgSrc, setImgSrc] = useState(lazyLoad ? "" : src);
  // 이미지 로딩 상태
  const [loading, setLoading] = useState(true);
  // 이미지 오류 상태
  const [error, setError] = useState(false);
  
  // 이미지 URL 유효성 확인 함수 개선
  const isValidUrl = (url) => {
    if (!url) return false;
    
    // HTTP/HTTPS URL 검사
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    
    // Base64 이미지 검사 - 실제 데이터가 포함되어 있는지 확인
    if (url.startsWith('data:image/')) {
      // data:image/jpeg;base64, 형식이고 그 뒤에 실제 데이터가 있는지 확인
      const parts = url.split('base64,');
      return parts.length === 2 && parts[1].length > 0;
    }
    
    return false;
  };
  
  // 이미지 로드 오류 처리 함수
  const handleError = () => {
    console.warn(`이미지 로드 실패: ${src}`);
    setError(true);
    setImgSrc(fallbackSrc);
    setLoading(false);
  };
  
  // 이미지 로드 완료 처리 함수
  const handleLoad = () => {
    setLoading(false);
  };
  
  // 지연 로딩 및 캐싱 처리
  useEffect(() => {
    // 초기화 및 유효성 검사
    if (!src) {
      console.log("이미지 소스가 없음, 대체 이미지 사용");
      setImgSrc(fallbackSrc);
      setLoading(false);
      return;
    }
    
    // 대체 이미지 URL과 동일한 경우 바로 반환 (무한 루프 방지)
    if (src === DEFAULT_FALLBACK || src === fallbackSrc) {
      setImgSrc(src);
      setLoading(false);
      return;
    }
    
    // 유효하지 않은 URL이면 대체 이미지 사용
    if (!isValidUrl(src)) {
      console.warn(`유효하지 않은 이미지 URL: ${src}`);
      setImgSrc(fallbackSrc);
      setLoading(false);
      return;
    }
    
    // 이미 에러 상태면 변경하지 않음
    if (error) return;
    
    // 캐시된 이미지가 있는지 확인
    if (imageCache.has(src)) {
      setImgSrc(src);
      setLoading(false);
      return;
    }
    
    // 이미지 프리로딩 (이미지 유효성 검사)
    const preloadImage = () => {
      // Base64 이미지인 경우 바로 설정 (추가 검증은 이미 isValidUrl에서 수행됨)
      if (src.startsWith('data:image/')) {
        imageCache.set(src, true);
        setImgSrc(src);
        setLoading(false);
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        imageCache.set(src, true);
        setImgSrc(src);
        setLoading(false);
      };
      
      img.onerror = () => {
        console.warn(`이미지 프리로드 실패: ${src}`);
        setImgSrc(fallbackSrc);
        setError(true);
        setLoading(false);
      };
      
      // 마지막에 src 설정 (이벤트 핸들러 등록 후)
      img.src = src;
    };
    
    if (lazyLoad) {
      // Intersection Observer API를 사용한 지연 로딩 
      try {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            preloadImage();
            observer.disconnect();
          }
        });
        
        // 현재 DOM 요소 관찰 시작
        setTimeout(() => {
          const currentElement = document.querySelector(`[data-src="${src}"]`);
          if (currentElement) {
            observer.observe(currentElement);
          } else {
            // 요소를 찾을 수 없으면 바로 이미지 로드
            preloadImage();
          }
        }, 0);
        
        return () => {
          observer.disconnect();
        };
      } catch (e) {
        console.error(`Intersection Observer 오류: ${e.message}`);
        // 오류 발생 시 일반 로딩으로 폴백
        preloadImage();
      }
    } else {
      // 지연 로딩을 사용하지 않는 경우 바로 이미지 프리로드
      preloadImage();
    }
  }, [src, fallbackSrc, error, lazyLoad]);
  
  return (
    <>
      {loading && (
        <div className={`image-placeholder ${className}`} style={{ width, height }}>
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        className={`${className} ${loading ? 'loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        data-src={src}
        style={{ 
          display: loading ? 'none' : 'block',
          width: width,
          height: height,
          objectFit: 'cover'  // 이미지 비율 유지하면서 컨테이너 채우기
        }}
        {...props}
      />
    </>
  );
};

export default ImageLoader;
