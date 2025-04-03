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
          {isLoggedIn ? (
            <ul>
              <li>
                <button onClick={() => navigate("/profile")}>
                  개인정보 수정{" "}
                </button>
                <button onClick={logout}>로그아웃</button>
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
      </header>
    </>
  );
}

export default Header;