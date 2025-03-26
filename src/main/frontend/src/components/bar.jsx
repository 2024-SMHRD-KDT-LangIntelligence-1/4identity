import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bar.css";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="header">
        <div className="headerBox">
          <div className="logo">4identity</div>

          <div className="right-side">
            <div className="headerBtn">
              <button onClick={() => navigate("/login")}>로그인</button>
              <button onClick={() => navigate("/signup")}>회원가입</button>
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
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
