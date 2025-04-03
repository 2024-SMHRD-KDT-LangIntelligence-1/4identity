import React, { useState, useEffect } from 'react';

// 전역 이미지 캐시 (컴포넌트 간 공유)
const imageCache = new Map();

// 기본 대체 이미지 URL
const DEFAULT_FALLBACK = "https://via.placeholder.com/400x200?text=No+Image+Available";

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
  
  // 디버깅 로그 출력
  console.log(`ImageLoader 렌더링 - src: ${src}, imgSrc: ${imgSrc}, loading: ${loading}, error: ${error}`);
  
  // 이미지 URL 유효성 확인 함수
  const isValidUrl = (url) => {
    if (!url) return false;
    return (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('data:image/')
    );
  };
  
  // 이미지 로드 오류 처리 함수
  const handleError = () => {
    console.warn(`이미지 로드 실패: ${src}`);
    setError(true);
    setImgSrc(fallbackSrc);
  };
  
  // 이미지 로드 완료 처리 함수
  const handleLoad = () => {
    console.log(`이미지 로드 완료: ${imgSrc}`);
    setLoading(false);
  };
  
  // 지연 로딩 및 캐싱 처리
  useEffect(() => {
    console.log(`ImageLoader useEffect - src: ${src}`);
    
    if (!src) {
      console.log('소스 없음, 대체 이미지 사용');
      setImgSrc(fallbackSrc);
      return;
    }
    
    // 유효하지 않은 URL이면 대체 이미지 사용
    if (!isValidUrl(src)) {
      console.log(`유효하지 않은 URL: ${src}, 대체 이미지 사용`);
      setImgSrc(fallbackSrc);
      return;
    }
    
    // 이미 에러 상태면 변경하지 않음
    if (error) return;
    
    // 캐시된 이미지가 있는지 확인
    if (imageCache.has(src)) {
      console.log(`캐시된 이미지 사용: ${src}`);
      setImgSrc(src);
      setLoading(false);
      return;
    }
    
    // 이미지 프리로딩 (이미지 유효성 검사)
    const preloadImage = () => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        console.log(`이미지 프리로드 성공: ${src}`);
        imageCache.set(src, true);
        setImgSrc(src);
        setLoading(false);
      };
      
      img.onerror = () => {
        console.warn(`이미지 프리로드 실패: ${src}`);
        setImgSrc(fallbackSrc);
        setError(true);
      };
    };
    
    if (lazyLoad) {
      // Intersection Observer API를 사용한 지연 로딩 
      try {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            console.log(`화면에 표시됨, 이미지 로딩 시작: ${src}`);
            preloadImage();
            observer.disconnect();
          }
        });
        
        // 현재 DOM 요소 관찰 시작
        setTimeout(() => {
          const currentElement = document.querySelector(`[data-src="${src}"]`);
          if (currentElement) {
            observer.observe(currentElement);
            console.log(`요소 관찰 시작: ${src}`);
          } else {
            console.warn(`관찰할 요소를 찾을 수 없음: ${src}`);
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
      console.log(`즉시 로딩 시작: ${src}`);
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
