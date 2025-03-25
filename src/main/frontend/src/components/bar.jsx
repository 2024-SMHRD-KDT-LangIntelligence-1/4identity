import { useState } from "react";
import "./bar.css";
import { useNavigate } from "react-router-dom";

function Header() {
  let navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <header className="header">
        {/* <button className="headerBtn" onClick={() => setisOpen(!isOpen)}></button> */}
        <div className="headerNum">
          <div className="headerBtn">
            <button
              className="loginBtnH"
              onClick={() => {
                navigate("/login");
              }}
            >
              로그인
            </button>
            <button
              className="signUpBtnH"
              onClick={() => {
                navigate("/signup");
              }}
            >
              회원가입
            </button>
          </div>
        </div>
        <div className="headerList" style={{ paddingBottom: "8px" }}>
          <ul>
            <li onClick={() => alert("산업 및 트렌드")}>산업 및 트렌드</li>
            <li onClick={() => alert("제품리뷰")}>소비자 기술·제품 리뷰</li>
            <li onClick={() => alert("정책 및 법률")}>정책 및 법률</li>
            <li onClick={() => alert("기업 및 브랜드")}>기업 및 브랜드</li>
            <li onClick={() => alert("미래 기술 혁신")}>미래 기술·혁신</li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
