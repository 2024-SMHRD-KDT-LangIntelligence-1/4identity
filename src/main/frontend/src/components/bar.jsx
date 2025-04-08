import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./bar.css";
import { UserContext } from "../App";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // UserContext에서 사용자 정보와 로그아웃 함수 가져오기
  const { isLoggedIn, userId, userInterest, logout } = useContext(UserContext);

  // 디버깅용 로그
  useEffect(() => {
    if (isLoggedIn) {
      console.log("로그인된 사용자 정보:", { userId, userInterest });
    } else {
      console.log("로그인된 사용자 없음");
    }
  }, [isLoggedIn, userId, userInterest]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // 로고 클릭 핸들러 추가 - 홈으로 이동 후 페이지 새로고침
  const handleLogoClick = () => {
    // 현재 경로가 이미 홈('/')인 경우 새로고침만 수행
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      // 다른 페이지에 있는 경우 홈으로 이동 (이동 후 자동으로 페이지가 로드됨)
      navigate("/");
    }
  };

  return (
    <>
      <header className="header">
        <div className="headerBox">
          <div 
            className="logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }} // 커서 스타일을 포인터로 변경
          >
            TinkOn
          </div>

          <div className="rightSide">
            <div className="headerBtn">
              {isLoggedIn ? (
                // 로그인 상태일 때 표시되는 버튼
                <>
                  <button onClick={() => navigate("/profile")}>
                    개인정보 수정
                  </button>
                  <button onClick={logout}>로그아웃</button>
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
          <ul>
            {isLoggedIn ? (
              <li className="mobileOnly">
                <button onClick={() => navigate("/profile")}>
                  개인정보 수정
                </button>
                <button onClick={logout}>로그아웃</button>
              </li>
            ) : (
              <li className="mobileOnly">
                <button onClick={() => navigate("/login")}>로그인</button>
                <button onClick={() => navigate("/signup")}>회원가입</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
