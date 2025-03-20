import { useState } from "react";
import "./App.css";
import Header from "./bar.jsx";

function App() {
  const [userId, setUserId] = useState("");
  const [passWord, setpassWord] = useState("");
  const [passWordCheck, setpassWordCheck] = useState("");
  const [userEmail, setuserEmail] = useState("");

  const handleIdInput = (e) => {
    setUserId(e.target.value);
  };

  const handlePwInput = (e) => {
    setpassWord(e.target.value);
  };

  const handlePwCheck = (e) => {
    setpassWordCheck(e.target.value);
  };

  const handleEmail = (e) => {
    setuserEmail(e.target.value);
  };

  return (
    <div className="App">
      <Header />

      <h2 className="signUpTitle">회원가입</h2>
      <hr className="signBar" />
      <div className="signUp">
        {}

        {/* <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디를 입력해주세요."
          className="inputBox"
        ></input>
        <button className="check" style={{ width: "75px", fontSize: "12px" }}>
          중복확인
        </button>
        <h4>비밀번호 입력</h4>
        <input
          type="test"
          value={passWord}
          onChange={(e) => setpassWord(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
          className="inputBox"
        ></input>
        <h4>비밀번호 확인</h4>
        <input
          type="text"
          value={passWordCheck}
          onChange={(e) => setpassWordCheck(e.target.value)}
          placeholder="비밀번호를 한 번 더 입력하세요."
          className="inputBox"
        ></input>
        <h4>이메일</h4>
        <input
          type="text"
          value={userEmail}
          onChange={(e) => setuserEmail(e.target.value)}
          placeholder="이메일을 입력해주세요."
          className="inputBox"
        ></input> */}
      </div>
    </div>
  );
}

export default App;
