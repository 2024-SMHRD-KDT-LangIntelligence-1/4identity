import React, { useState } from "react";
import Header from "../components/bar.jsx";
import "../pages/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 추가

function LoginPage() {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: "", // userid에서 userId로 변경하여 백엔드와 일치시킴
    userPw: "", // password에서 userPw로 변경하여 백엔드와 일치시킴
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      // 입력값 검증
      if (!formData.userId || !formData.userPw) {
        setErrorMessage("아이디와 비밀번호를 모두 입력해주세요");
        return;
      }

      console.log("로그인 시도", formData);
      
      // 로그인 API 호출
      const response = await axios.post("/api/users/login", {
        userId: formData.userId,
        userPw: formData.userPw
      });

      console.log("로그인 응답:", response.data);

      if (response.data.success) {
        // 로그인 성공 - 사용자 정보 저장
        localStorage.setItem("userId", response.data.userId);
        
        // 메인 페이지로 이동
        navigate("/", { 
          state: { 
            isLoggedIn: true, 
            welcomeMessage: `${response.data.userId}님 환영합니다.`
          } 
        });
      } else {
        // 로그인 실패 - 에러 메시지 표시
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const logIn = [
    {
      label: "아이디",
      type: "text",
      state: "userId", // userid에서 userId로 변경
      placeholder: "아이디를 입력해주세요",
    },
    {
      label: "비밀번호",
      type: "password",
      state: "userPw", // password에서 userPw로 변경
      placeholder: "비밀번호를 입력해주세요",
    },
  ];

  return (
    <>
      <Header />
      <div className="logInBox">
        <div className="loginInput">
          {logIn.map((field, i) => (
            <LogInFields
              key={i}
              label={field.label}
              type={field.type}
              value={formData[field.state]}
              onChange={(e) => handleChange(e, field.state)}
              placeholder={field.placeholder}
            />
          ))}
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
        </div>
        <button onClick={handleLogin}>로그인</button>
      </div>
    </>
  );
}

function LogInFields({ label, type, value, onChange, placeholder }) {
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

export default LoginPage;
