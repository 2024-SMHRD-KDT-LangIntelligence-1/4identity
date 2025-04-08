import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/bar.jsx";
import NewsForm from "../components/newsForm.jsx";
import "../pages/index.css";
import axios from "axios";
import { UserContext } from "../App";
import ImageLoader, { FALLBACK_IMAGE } from "../components/ImageLoader.jsx"; // FALLBACK_IMAGE 추가 임포트
import "../components/ImageLoader.css"; // ImageLoader.css 가져오기 추가

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userId, userInterest } = useContext(UserContext);

  useEffect(() => {
    // location.state에서 welcomeMessage 확인
    if (location.state?.welcomeMessage) {
      // 환영 메시지 표시 (Toast 또는 Alert 사용 가능)
      alert(location.state.welcomeMessage);

      // state 초기화 (메시지가 계속 표시되지 않도록)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  
  // 저장된 날짜가 있으면 불러오고, 없으면 현재 날짜 사용
  const savedDate = localStorage.getItem('selectedNewsDate');
  // 선택된 날짜 상태 관리
  const [selectedDate, setSelectedDate] = useState(savedDate || formattedDate);
  // 뉴스 데이터 상태 관리
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectNews, setSelectNews] = useState(null);
  const [error, setError] = useState(null);

  // 텍스트 줄임 기능 수정 - 50글자로 제한 (공백 포함)
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // 이미지 URL 체크 함수 개선
  const isValidImageUrl = (url) => {
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
  
  // 이미지 URL 처리 함수 개선
  const getFirstImageUrl = (imageUrls) => {
    if (!imageUrls) return fallbackImageUrl;
    
    try {
      // 쉼표로 분리된 URL 배열 생성
      const urls = imageUrls.split(',').map(url => url.trim()).filter(url => url !== '');
      
      // 유효한 첫 번째 URL 찾기
      for (const url of urls) {
        if (isValidImageUrl(url)) {
          return url;
        }
      }
      
      // 유효한 URL이 없으면 대체 이미지 사용
      return fallbackImageUrl;
    } catch (e) {
      console.error("이미지 URL 처리 중 오류:", e);
      return fallbackImageUrl;
    }
  };
  
  // 대체 이미지 URL을 ImageLoader에서 가져온 Base64 이미지로 업데이트
  const fallbackImageUrl = FALLBACK_IMAGE;
  
  // 날짜에 따른 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`뉴스 데이터 요청: ${selectedDate}`);
        
        // 날짜 형식 검증 (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
          throw new Error("날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.");
        }
        
        // 새로운 API 엔드포인트를 사용하여 뉴스 가져오기
        const response = await axios.get(`http://localhost:8082/api/news/allDailyNews?date=${selectedDate}`);
        console.log("서버 응답:", response);
        
        if (response.data && response.data.mainNews && Array.isArray(response.data.mainNews) && response.data.mainNews.length > 0) {
          console.log("메인 뉴스 데이터 수신 성공:", response.data.mainNews);
          setNewsData(response.data.mainNews);
          setSelectNews(response.data.mainNews[0]);
        } else {
          console.log("해당 날짜의 뉴스 데이터가 없습니다");
          setNewsData([]);
          setSelectNews(null);
        }
      } catch (error) {
        console.error("뉴스 데이터 가져오기 실패:", error.message);
        setError(error.message);
        setNewsData([]);
        setSelectNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [selectedDate]);

  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // 선택된 날짜를 localStorage에 저장
    localStorage.setItem('selectedNewsDate', newDate);
  };

  // 뉴스 클릭 시 상세 페이지로 이동하는 함수
  const handleNewsClick = (news) => {
    // NewsPage로 이동하면서 선택된 뉴스 데이터와 현재 선택된 날짜를 state로 전달
    navigate('/newspage', { 
      state: { 
        newsData: news,
        selectedDate: selectedDate 
      } 
    });
  };

  return (
    <>
      <main>
        <Header />
        <div className="home">
          {/* <div className="homeContainer">
            <h1>4identity - Home</h1>
            
            {isLoggedIn ? (
              <div className="userInfo">
                <h3>{userId}님 환영합니다</h3>
                {userInterest && (
                  <p>관심 카테고리: {userInterest}</p>
                )}
              </div>
            ) : (
              <p>로그인하시면 맞춤 콘텐츠를 확인하실 수 있습니다.</p>
            )}
          </div> */}
          <div className="mainNewsBox">
            <div className="dateSelector">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={handleDateChange}
                className="datePicker"
              />
            </div>
            <div className="mainNewsContainer">
              <div 
                className="mainNews" 
                onClick={() => selectNews && handleNewsClick(selectNews)}
                style={{ cursor: 'pointer' }}
              >
                {loading ? (
                  <p>뉴스를 불러오는 중입니다...</p>
                ) : error ? (
                  <p>오류 발생: {error}</p>
                ) : selectNews ? (
                  <>
                    <div className="newsImageContainer">
                      {/* ImageLoader 컴포넌트로 이미지 처리 개선 */}
                      <ImageLoader 
                        src={getFirstImageUrl(selectNews.images)}
                        alt={selectNews.titles || '뉴스 이미지'}
                        className="newsImage"
                        width="100%"
                        height="200px"
                        fallbackSrc={fallbackImageUrl}
                        lazyLoad={false} // 메인 이미지는 즉시 로드
                      />
                    </div>
                    <h3>{truncateText(selectNews.titles || '제목 없음', 40)}</h3>
                    <p>{truncateText(selectNews.summary || '내용 없음', 150)}</p>
                  </>
                ) : (
                  <p className="no-news-message">뉴스가 존재하지 않습니다.</p>
                )}
              </div>
            </div>
            <div className="newsListBox">
              <div className="newsList">
                {loading ? (
                  <div className="newsListItem">로딩 중...</div>
                ) : error ? (
                  <div className="newsListItem">데이터 불러오기 실패</div>
                ) : newsData && newsData.length > 0 ? (
                  newsData.map((news, index) => (
                    <div
                      key={index}
                      className={`newsListItem ${
                        selectNews && selectNews.newsIdx === news.newsIdx ? "selected" : ""
                      }`}
                      onClick={() => setSelectNews(news)}
                      title={news.titles || '제목 없음'} // 툴팁은 전체 제목 표시
                    >
                      {truncateText(news.titles || '제목 없음', 50)}
                    </div>
                  ))
                ) : (
                  <div className="newsListItem empty-message">뉴스가 존재하지 않습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <NewsForm selectedDate={selectedDate} />
      </main>
    </>
  );
}

export default Home;