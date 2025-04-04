import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./newspage.css";
import Header from "../components/bar";
import { FaCircleCheck } from "react-icons/fa6"; // 아이콘 (npm install react-icons --save)

function NewsPage() {
  const location = useLocation();
  const [newsData, setNewsData] = useState(null);
  const [relatedNewsLinks, setRelatedNewsLinks] = useState([]);

  // 전달받은 뉴스 데이터 처리
  useEffect(() => {
    // 페이지 이동 시 전달된 state에서 뉴스 데이터 확인
    if (location.state && location.state.newsData) {
      setNewsData(location.state.newsData);
      console.log("전달된 뉴스 데이터:", location.state.newsData);
      
      // 전달받은 날짜가 있으면 localStorage에 저장
      if (location.state.selectedDate) {
        localStorage.setItem('selectedNewsDate', location.state.selectedDate);
      }
      
      // press와 urls 데이터 파싱하여 relatedNewsLinks 생성
      const press = location.state.newsData.press || '';
      const urls = location.state.newsData.urls || '';
      
      processRelatedNews(press, urls);
    }
  }, [location]);
  
  // press와 urls 데이터를 처리하는 함수
  const processRelatedNews = (press, urls) => {
    if (!press || !urls) {
      setRelatedNewsLinks([]);
      return;
    }
    
    // 쉼표로 구분된 데이터 분할
    const pressItems = press.split(',').map(item => item.trim()).filter(item => item !== '');
    const urlItems = urls.split(',').map(item => item.trim()).filter(item => item !== '');
    
    console.log("파싱된 언론사:", pressItems);
    console.log("파싱된 URL:", urlItems);
    
    // 두 배열의 길이 중 더 짧은 것을 기준으로 데이터 생성
    const minLength = Math.min(pressItems.length, urlItems.length);
    const result = [];
    
    for (let i = 0; i < minLength; i++) {
      result.push({
        word: pressItems[i],
        url: urlItems[i]
      });
    }
    
    // 데이터가 없으면 안내 메시지 추가
    if (result.length === 0 && (pressItems.length > 0 || urlItems.length > 0)) {
      console.warn("언론사와 URL 데이터가 일치하지 않음");
      
      // press만 있는 경우
      if (pressItems.length > 0 && urlItems.length === 0) {
        pressItems.forEach(press => {
          result.push({
            word: press,
            url: '#' // 기본 URL
          });
        });
      }
      
      // url만 있는 경우
      if (urlItems.length > 0 && pressItems.length === 0) {
        urlItems.forEach(url => {
          result.push({
            word: '관련 기사',
            url: url
          });
        });
      }
    }
    
    console.log("생성된 관련 뉴스 링크:", result);
    setRelatedNewsLinks(result);
  };

  // 이미지 URL 체크 함수
  const isValidImageUrl = (url) => {
    return url && url.trim() !== '' && (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('data:image/')
    );
  };
  
  // 이미지 URL 처리 함수
  const getFirstImageUrl = (imageUrls) => {
    if (!imageUrls) return "https://via.placeholder.com/400x150?text=No+Image+Available";
    
    // 쉼표로 분리된 URL 중 첫 번째만 사용
    const firstUrl = imageUrls.split(',')[0].trim();
    return isValidImageUrl(firstUrl) ? firstUrl : "https://via.placeholder.com/400x150?text=No+Image+Available";
  };

  return (
    <>
      <Header />
      <div className="pageBody">
        <div className="titleBox">
          <div className="img">
            <FaCircleCheck size={35} color="5FB404" id="checkImg" />
            {/* <div className="checkTag"> 검증 된 뉴스 요약입니다.</div> */}
          </div>
          <div className="titleBoxContent">
            <p style={{ fontSize: "13px" }}>
              {newsData ? newsData.dates : "생성일자"} • {newsData ? newsData.category || "일반" : "카테고리"}
            </p>
            <h2>
              {newsData ? newsData.titles : "광주 광산구, AI·미래기술 직접 배우는 진로교육 여기까지는 글자수 예쁨"}
            </h2>
          </div>
        </div>
        <div className="contentBox">
          <p style={{ letterSpacing: "0.05em", fontStretch: "condensed" }}>
            {newsData ? newsData.summary : "광주 광산구가 청소년들의 창의·융합 역량 강화를 위해 인공지능(AI), 미래기술 중심의 진로 교육 프로그램을 본격 운영한다. 4월부터는 '학교로 찾아가는 진로 교육'이 시작되며, 5월부터는 지역 대학 및 과학관과 연계한 '미래기술학교'도 문을 연다.광주 광산구가 청소년들의 창의·융합 역량 강화를 위해 인공지능(AI), 미래기술 중심의 진로 교육 프로그램을 본격 운영한다. 4월부터는 '학교로 찾아가는 진로 교육'이 시작되며, 5월부터는 지역 대학 및 과학관과 연계한 '미래기술학교'도 문을 연다."}
          </p>
          {newsData && newsData.images && (
            <div className="newsImageSection">
              <img 
                src={getFirstImageUrl(newsData.images)} 
                alt={newsData.titles || "뉴스 이미지"} 
                style={{ maxWidth: "100%", marginTop: "15px" }}
              />
            </div>
          )}
        </div>
        <div className="listBox">
          <h4> 관련 뉴스 바로가기 </h4>
          {relatedNewsLinks.length > 0 ? (
            relatedNewsLinks.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {index + 1}. {item.word}
                  <span className="desktopOnly"> : {item.url}</span>
                </a>
              </li>
            ))
          ) : (
            <li>관련 뉴스 정보가 없습니다.</li>
          )}
        </div>
      </div>
    </>
  );
}

export default NewsPage;
