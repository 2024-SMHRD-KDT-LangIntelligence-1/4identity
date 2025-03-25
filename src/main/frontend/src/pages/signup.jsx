import { useState } from "react";
import Header from "../components/bar.jsx";
import "./SignUp.css"; // 기존 App.css에서 분리하여 반응형 스타일 적용
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function SignUpPage() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordCheck: "",
    userEmail: "",
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const signUpFields = [
    {
      label: "비밀번호",
      type: "password",
      state: "password",
      placeholder: "사용할 비밀번호를 입력해주세요",
    },
    {
      label: "비밀번호 확인",
      type: "password",
      state: "passwordCheck",
      placeholder: "비밀번호를 다시 입력해주세요",
    },
  ];

  const emailDrops = ["naver.com", "gmail.com", "daum.net"];

  return (
    <>
      <Header />
      <div className="signUpPage">
        <h2 className="signUpTitle">회원가입</h2>
        <hr className="signBar" />

        <div className="signUpForm">
          {/* 아이디 */}
          <div className="inputWithButton">
            <div className="inputField">
              <label>아이디</label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => handleChange(e, "userId")}
                placeholder="아이디를 입력해주세요."
                id="inputId"
              />
            </div>
            <button className="checkBtn">중복확인</button>
          </div>

          {/* 이메일 */}
          <div className="inputField">
            <label>이메일</label>
            <div className="emailInput">
              <input
                id="inputEmail"
                type="text"
                value={formData.userEmail}
                onChange={(e) => handleChange(e, "userEmail")}
                placeholder="이메일을 입력해주세요."
                style={{ marginRight: "5px" }}
              />
              <span>@</span>
              <select>
                {emailDrops.map((domain, i) => (
                  <option key={i} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 비밀번호 */}
          {signUpFields.map((field, i) => (
            <SignUpField
              key={i}
              label={field.label}
              type={field.type}
              value={formData[field.state]}
              onChange={(e) => handleChange(e, field.state)}
              placeholder={field.placeholder}
            />
          ))}
        </div>

        <button
          className="signUpBtn"
          onClick={() => {
            navigate("/");
          }}
        >
          회원가입
        </button>
      </div>
    </>
  );
}

function SignUpField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="inputField">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SignUpPage;
