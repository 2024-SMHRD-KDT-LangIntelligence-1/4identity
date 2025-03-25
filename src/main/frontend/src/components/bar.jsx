import { useState } from "react";
import "./bar.css";
import { useNavigate } from "react-router-dom";

function Header() {
  let navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false);

  return (
    <header className="header">
      {/* <button className="headerBtn" onClick={() => setisOpen(!isOpen)}></button> */}
      <div className="headerLogo">
        <button
          className="loginBtn"
          onClick={() => {
            navigate("/login");
          }}
        >
          {" "}
          로그인{" "}
        </button>
      </div>
      <div className="headerList" style={{ paddingBottom: "8px" }}>
        <ul>
          <li onClick={() => alert("산업 및 트렌드 클릭!")}>산업 및 트렌드</li>
          <li onClick={() => alert("제품리뷰 클릭!")}>제품리뷰</li>
          <li onClick={() => alert("정책 및 법률 클릭!")}>정책 및 법률</li>
          <li onClick={() => alert("기업 및 브랜드 클릭!")}>기업 및 브랜드</li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
