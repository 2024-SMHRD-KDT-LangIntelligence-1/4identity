import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./bar.css";
import axios from "axios"; // axios 추가

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userInterest: ""
  });

  // 세션 체크 함수
  const checkSession = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoggedIn(false);
      setUserInfo({ userId: "", userInterest: "" });
      return;
    }

    try {
      // 사용자 프로필 정보 가져오기 (세션 유효성 검증용)
      const response = await axios.get(`/api/users/profile/${userId}`);
      
      if (response.data.success) {
        setIsLoggedIn(true);
        setUserInfo({
          userId: response.data.userId,
          userInterest: response.data.userInterest || ""
        });
        
        // 최신 정보로 localStorage 업데이트
        localStorage.setItem("userInterest", response.data.userInterest || "");
        localStorage.setItem("userEmail", response.data.userEmail || "");
      } else {
        // 서버에서 사용자 정보를 찾을 수 없음 - 로그아웃 처리
        handleLogout();
      }
    } catch (error) {
      console.error("세션 체크 실패:", error);
      
      // 404 에러인 경우 (사용자를 찾을 수 없음) - 로그아웃 처리
      if (error.response && error.response.status === 404) {
        console.log("서버에서 사용자 정보를 찾을 수 없음 - 로그아웃 처리");
        handleLogout();
        return;
      }
      
      // 다른 오류의 경우 localStorage 기반으로 상태 유지
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUserId = localStorage.getItem("userId");
      const storedUserInterest = localStorage.getItem("userInterest");
      
      setIsLoggedIn(storedIsLoggedIn === "true");
      setUserInfo({
        userId: storedUserId || "",
        userInterest: storedUserInterest || ""
      });
    }
  };

  // 컴포넌트가 마운트될 때와 location이 변경될 때 로그인 상태 확인
  useEffect(() => {
    checkSession();
  }, [location]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 모든 사용자 관련 정보 삭제
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userInterest");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
    
    setIsLoggedIn(false);
    setUserInfo({ userId: "", userInterest: "" });
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="headerBox">
          <div className="logo" onClick={() => navigate("/")}>
            4identity
          </div>

          <div className="rightSide">
            <div className="headerBtn">
              {isLoggedIn ? (
                // 로그인 상태일 때 표시되는 버튼
                <>
                  <button onClick={() => navigate("/profile")}>
                    개인정보 수정
                  </button>
                  <button onClick={handleLogout}>로그아웃</button>
                </>
              ) : (
                // 로그아웃 상태일 때 표시되는 버튼
                <>
                  <button onClick={() => navigate("/login")}>로그인</button>
                  <button onClick={() => navigate("/signup")}>회원가입</button>
                </>
              )}
            </div>

            <div className="headerHam" onClick={toggleMenu}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {isLoggedIn ? (
            <ul>
              <li>
                <button onClick={() => navigate("/profile")}>
                  개인정보 수정{" "}
                </button>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            </ul>
          ) : (
            <ul>
              <li className="mobileOnly">
                <button onClick={() => navigate("/login")}>로그인</button>
                <button onClick={() => navigate("/signup")}>회원가입</button>
              </li>
            </ul>
          )}
        </nav>
        {/* <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => alert("산업 및 트렌드")}>산업 및 트렌드</li>
            <li onClick={() => alert("제품리뷰")}>제품 리뷰</li>
            <li onClick={() => alert("정책 및 법률")}>정책 및 법률</li>
            <li onClick={() => alert("기업 및 브랜드")}>기업 및 브랜드</li>
            <li onClick={() => alert("미래 기술")}>미래 기술·혁신</li>

            <div className="mobileBtn">
              <li className="mobileOnly">
                <button onClick={() => navigate("/login")}>로그인</button>
              </li>
              <li className="mobileOnly">
                <button onClick={() => navigate("/signup")}>회원가입</button>
              </li>
            </div>
          </ul>
        </nav> */}
      </header>
    </>
  );
}

export default Header;
