import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./bar.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 마운트될 때와 location이 변경될 때 로그인 상태 확인
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId); // userId가 존재하면 true, 아니면 false
  }, [location]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
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
        </nav>
      </header>
    </>
  );
}

export default Header;
