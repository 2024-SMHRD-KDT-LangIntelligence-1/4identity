import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./newsForm.css";
import { useNavigate } from "react-router-dom"; // 네비게이션 훅 추가
import ImageLoader from "./ImageLoader.jsx"; // 이미지 로더 컴포넌트 가져오기

function NewsForm({ selectedDate }) {
  // 네비게이션 훅 사용
  const navigate = useNavigate();

  // 사용자 관심사 카테고리 목록
  const categoryOptions = [
    "산업 및 트렌드",
    "제품 리뷰",
    "정책 및 법률",
    "기업 및 브랜드",
    "미래 기술·혁신",
  ];

  // 상태 정의 - titles 대신 newsData로 전체 데이터 저장
  const [newsData, setNewsData] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [userInterestNews, setUserInterestNews] = useState([]);
  const [userInterestNewsData, setUserInterestNewsData] = useState([]); // 전체 데이터 저장
  const [userInterest, setUserInterest] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interestError, setInterestError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // 뉴스 클릭 핸들러 함수
  const handleNewsClick = (news) => {
    // NewsPage로 이동하면서 선택된 뉴스 데이터와 현재 날짜를 state로 전달
    navigate('/newspage', { 
      state: { 
        newsData: news,
        selectedDate: selectedDate 
      } 
    });
  };

  // 세션 스토리지에서 사용자 정보를 확인하는 함수
  const checkLoginStatus = useCallback(() => {
    console.log("[NewsForm] ===== 사용자 정보 확인 함수 실행 =====");

    // 세션 스토리지 전체 내용 출력
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      console.log(`[NewsForm] 세션 스토리지 키[${i}]: ${key}, 값: ${sessionStorage.getItem(key)}`);
    }

    const userInfo = localStorage.getItem("userInfo");
    console.log("[NewsForm] 세션 스토리지에서 가져온 userInfo:", userInfo);

    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        console.log("[NewsForm] 파싱된 사용자 정보:", userData);

        // 명시적으로 로그인 상태 true로 설정
        const loggedInStatus = true;
        let interestValue = "";

        if (userData.userInterest) {
          console.log("[NewsForm] 유효한 사용자 관심사 감지:", userData.userInterest);
          interestValue = userData.userInterest;
        } else {
          console.log("[NewsForm] 사용자 관심사가 없습니다. userData 객체 키:", Object.keys(userData));

          // userData 객체의 모든 속성을 확인
          for (const key in userData) {
            console.log(`[NewsForm] 속성 ${key}:`, userData[key]);
          }
        }

        // 상태 업데이트
        setIsLoggedIn(loggedInStatus);
        setUserInterest(interestValue);
        console.log("[NewsForm] 상태 업데이트 설정 - isLoggedIn:", loggedInStatus, "userInterest:", interestValue);

        return { isLoggedIn: loggedInStatus, userInterest: interestValue };
      } catch (e) {
        console.error("[NewsForm] 사용자 정보 파싱 오류:", e);
        console.error("[NewsForm] 파싱 실패한 문자열:", userInfo);

        // 상태 업데이트
        setIsLoggedIn(false);
        setUserInterest("");

        return { isLoggedIn: false, userInterest: "" };
      }
    } else {
      console.log("[NewsForm] 로그인된 사용자 정보가 없습니다");

      // 상태 업데이트
      setIsLoggedIn(false);
      setUserInterest("");

      return { isLoggedIn: false, userInterest: "" };
    }
  }, []);

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    console.log("[NewsForm] 초기화 useEffect 실행");
    const status = checkLoginStatus();
    setInitialized(true);
    console.log("[NewsForm] 초기화 완료 - 로그인 상태:", status.isLoggedIn, "관심사:", status.userInterest);
  }, [checkLoginStatus]);

  // 상태 변경 확인용 useEffect
  useEffect(() => {
    if (initialized) {
      console.log("[NewsForm] 상태 변경 감지 - isLoggedIn:", isLoggedIn, "userInterest:", userInterest);
    }
  }, [isLoggedIn, userInterest, initialized]);

  // 일반 뉴스 및 키워드 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // 선택된 날짜 사용 (props로 전달받음)
        // 날짜가 없으면 현재 날짜를 사용
        const dateToUse = selectedDate || new Date().toISOString().split('T')[0];

        console.log(`[NewsForm] 뉴스 API 요청 URL: http://localhost:8082/api/news/allDailyNews?date=${dateToUse}`);

        // 뉴스 데이터 요청
        const response = await axios.get(`http://localhost:8082/api/news/allDailyNews?date=${dateToUse}`);

        // 응답 전체 구조 로깅 (디버깅용)
        console.log("[NewsForm] API 응답 데이터 전체:", response.data);

        // additionalNews 속성 확인
        if (response.data && response.data.additionalNews) {
          console.log("[NewsForm] 추가 뉴스 데이터:", response.data.additionalNews);
          console.log("[NewsForm] 추가 뉴스 개수:", response.data.additionalNews.length);

          if (Array.isArray(response.data.additionalNews) && response.data.additionalNews.length > 0) {
            // 첫 번째 뉴스 항목 확인 (디버깅용)
            if (response.data.additionalNews[0]) {
              console.log("[NewsForm] 첫 번째 추가 뉴스:", response.data.additionalNews[0]);
              console.log("[NewsForm] 첫 번째 추가 뉴스 제목:", response.data.additionalNews[0].titles);
            }

            // 전체 뉴스 데이터 저장
            const validNewsData = response.data.additionalNews.filter(
              news => news && news.titles && news.titles.trim() !== ''
            );

            console.log("[NewsForm] 표시할 뉴스 데이터:", validNewsData);
            setNewsData(validNewsData); // 전체 뉴스 데이터 저장
          } else {
            console.log("[NewsForm] 추가 뉴스 배열이 비어있거나 배열이 아닙니다");
            setNewsData([]);
          }
        } else {
          console.log("[NewsForm] additionalNews 속성이 응답에 없습니다:", response.data);
          setNewsData([]);
        }

        // 키워드 데이터 확인 및 설정
        if (response.data && response.data.topKeywords) {
          console.log("[NewsForm] 키워드 데이터:", response.data.topKeywords);

          if (Array.isArray(response.data.topKeywords) && response.data.topKeywords.length > 0) {
            // 상위 10개 키워드 사용 (5개에서 10개로 변경)
            const topTenKeywords = response.data.topKeywords.slice(0, 10).map(item => item.keyword);
            console.log("[NewsForm] 표시할 상위 키워드:", topTenKeywords);
            setKeywords(topTenKeywords);
          } else {
            console.log("[NewsForm] 키워드 배열이 비어있거나 배열이 아닙니다");
            setKeywords([]);
          }
        } else {
          console.log("[NewsForm] topKeywords 속성이 응답에 없습니다:", response.data);
          setKeywords([]);
        }
      } catch (error) {
        console.error("[NewsForm] 데이터 가져오기 실패:", error);
        console.error("[NewsForm] 에러 메시지:", error.message);
        if (error.response) {
          console.error("[NewsForm] 에러 응답:", error.response.data);
          console.error("[NewsForm] 에러 상태:", error.response.status);
        }
        setError(error.message);
        setNewsData([]);
        setKeywords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedDate]);

  // 사용자 관심사에 맞는 뉴스 가져오기
  useEffect(() => {
    // 초기화가 완료되지 않았으면 실행하지 않음
    if (!initialized) {
      console.log("[NewsForm] 아직 초기화 중이므로 관심사 뉴스 요청 건너뜀");
      return;
    }

    const fetchUserInterestNews = async () => {
      console.log("[NewsForm] 관심사 뉴스 요청 검토 - isLoggedIn:", isLoggedIn, "userInterest:", userInterest);

      // 사용자 관심사나 선택 날짜가 없으면 요청하지 않음
      if (!userInterest || !isLoggedIn) {
        console.log("[NewsForm] 사용자 관심사가 없거나 로그인 상태가 아니어서 관심사 뉴스를 가져오지 않습니다");
        setInterestLoading(false);
        setUserInterestNews([]);
        setUserInterestNewsData([]);
        return;
      }

      try {
        setInterestLoading(true);
        setInterestError(null);

        // 선택된 날짜 사용 (props로 전달받음)
        // 날짜가 없으면 현재 날짜를 사용
        const dateToUse = selectedDate || new Date().toISOString().split('T')[0];

        // URL에 직접 쿼리 파라미터 포함 (params 객체 대신)
        const encodedInterest = encodeURIComponent(userInterest);
        const apiUrl = `http://localhost:8082/api/news/byUserInterest?date=${dateToUse}&userInterest=${encodedInterest}`;

        console.log(`[NewsForm] 사용자 관심사 뉴스 API 요청 URL: ${apiUrl}`);

        // 사용자 관심사에 맞는 뉴스 데이터 요청 - 직접 URL에 파라미터 추가
        const response = await axios.get(apiUrl);

        console.log("[NewsForm] 사용자 관심사 뉴스 응답:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          // 유효한 뉴스 데이터 필터링
          const validNewsData = response.data.filter(
            news => news && news.titles && news.titles.trim() !== ''
          );

          // 뉴스 제목만 추출하여 상태 업데이트
          const interestNewsTitles = validNewsData.map(news => news.titles);

          console.log("[NewsForm] 표시할 사용자 관심사 뉴스 제목:", interestNewsTitles);
          console.log("[NewsForm] 사용자 관심사 뉴스 전체 데이터:", validNewsData);

          setUserInterestNews(interestNewsTitles);
          setUserInterestNewsData(validNewsData); // 전체 데이터 저장
        } else {
          console.log("[NewsForm] 사용자 관심사에 맞는 뉴스가 없습니다");
          setUserInterestNews([]);
          setUserInterestNewsData([]);
        }
      } catch (error) {
        console.error("[NewsForm] 사용자 관심사 뉴스 가져오기 실패:", error);
        if (error.response) {
          console.error("[NewsForm] 에러 응답 상태:", error.response.status);
          console.error("[NewsForm] 에러 응답 데이터:", error.response.data);
          console.error("[NewsForm] 요청 URL:", error.config.url);
          console.error("[NewsForm] 요청 메서드:", error.config.method);
          console.error("[NewsForm] 요청 헤더:", error.config.headers);
        } else if (error.request) {
          console.error("[NewsForm] 요청은 전송되었으나 응답을 받지 못함:", error.request);
        } else {
          console.error("[NewsForm] 에러 메시지:", error.message);
        }
        setInterestError(error.message);
        setUserInterestNews([]);
        setUserInterestNewsData([]);
      } finally {
        setInterestLoading(false);
      }
    };

    fetchUserInterestNews();
  }, [userInterest, selectedDate, isLoggedIn, initialized]);

  // 사용자 관심사 표시용 이름 포맷팅
  const formatUserInterest = (interest) => {
    // 비로그인 상태이면 '카테고리명'으로 표시
    if (!isLoggedIn) return "카테고리명";

    if (!interest) return "관심 카테고리";

    // 첫 번째 관심사만 표시 (콤마로 구분된 경우)
    if (interest.includes(",")) {
      return interest.split(",")[0].trim();
    }

    return interest.trim();
  };

  return (
    <>
      <div className="mainBox">
        <div className="todays">
          <h4 className="mainTitle">오늘의 주요 기사</h4>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>데이터를 불러올 수 없습니다: {error}</div>
          ) : newsData.length > 0 ? (
            newsData.map((news, index) => (
              <div 
                key={index} 
                className="titleItem" 
                title={news.titles}
                onClick={() => handleNewsClick(news)} // 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 마우스 커서 스타일 변경
              >
                {news.titles.length > 25 ? `${news.titles.slice(0, 25)}...` : news.titles}
              </div>
            ))
          ) : (
            <div className="titleItem">주요 기사가 없습니다</div>
          )}
        </div>
        <div className="categoryName">
          <h4 className="mainTitle">{formatUserInterest(userInterest)}</h4>
          {!isLoggedIn ? (
            // 비로그인 상태일 때 메시지 표시
            <div className="titleItem">
              로그인을 하여 본인에 맞는 카테고리를 확인해봐요!
            </div>
          ) : interestLoading ? (
            <div>로딩 중...</div>
          ) : interestError ? (
            <div>데이터를 불러올 수 없습니다: {interestError}</div>
          ) : userInterestNewsData.length > 0 ? (
            userInterestNewsData.map((news, index) => (
              <div 
                key={index} 
                className="titleItem" 
                title={news.titles}
                onClick={() => handleNewsClick(news)} // 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 마우스 커서 스타일 변경
              >
                {news.titles.length > 25 ? `${news.titles.slice(0, 25)}...` : news.titles}
              </div>
            ))
          ) : (
            <div className="titleItem">현재 날짜에 어울리는 뉴스가 없습니다 (관심사: {userInterest || "없음"})</div>
          )}
        </div>
        <div className="keyWords">
          <h4 className="mainTitle">오늘의 키워드</h4>
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>데이터를 불러올 수 없습니다: {error}</div>
          ) : keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <div key={index} className="keywordItem">
                {`${index + 1}. ${keyword}`}
              </div>
            ))
          ) : (
            <div className="keywordItem">키워드가 없습니다</div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewsForm;