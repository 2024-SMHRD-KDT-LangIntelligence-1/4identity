import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/bar.jsx";
import NewsForm from "../components/newsForm.jsx";
import "../pages/index.css";
import axios from "axios";
import { UserContext } from "../App";

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
  
  // 선택된 날짜 상태 관리
  const [selectedDate, setSelectedDate] = useState(formattedDate);
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

  // 이미지 URL 체크 함수 추가
  const isValidImageUrl = (url) => {
    return url && url.trim() !== '' && (
      url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('data:image/')
    );
  };
  
  // 이미지 URL 처리 함수 추가
  const getFirstImageUrl = (imageUrls) => {
    if (!imageUrls) return fallbackImageUrl;
    
    // 쉼표로 분리된 URL 중 첫 번째만 사용
    const firstUrl = imageUrls.split(',')[0].trim();
    return isValidImageUrl(firstUrl) ? firstUrl : fallbackImageUrl;
  };
  
  // 대체 이미지 URL
  const fallbackImageUrl = "https://via.placeholder.com/400x150?text=No+Image+Available";
  
  // 이미지 로드 에러 처리 함수
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImageUrl;
  };

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
    setSelectedDate(e.target.value);
  };

  // 뉴스 클릭 시 상세 페이지로 이동하는 함수
  const handleNewsClick = (news) => {
    // NewsPage로 이동하면서 선택된 뉴스 데이터를 state로 전달
    navigate('/newspage', { state: { newsData: news } });
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
                      <img 
                        src={getFirstImageUrl(selectNews.images)}
                        alt={selectNews.titles || '뉴스 이미지'}
                        className="newsImage"
                        onError={handleImageError}
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