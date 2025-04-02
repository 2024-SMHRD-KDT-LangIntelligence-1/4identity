import React, { useState } from "react";
import Header from "../components/bar.jsx";
import "../pages/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 추가

function LoginPage() {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  // 필드별 오류 메시지 상태 추가
  const [fieldErrors, setFieldErrors] = useState({
    userId: "",
    userPw: "",
  });

  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    // 사용자가 입력하면 해당 필드의 오류 메시지 초기화
    setFieldErrors({ ...fieldErrors, [field]: "" });
  };

  const validateFields = () => {
    let isValid = true;
    const newFieldErrors = { userId: "", userPw: "" };

    // 아이디 검증
    if (!formData.userId) {
      newFieldErrors.userId = "아이디를 입력하지 않았습니다";
      isValid = false;
    }

    // 비밀번호 검증
    if (!formData.userPw) {
      newFieldErrors.userPw = "비밀번호를 입력하지 않았습니다";
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleLogin = async () => {
    try {
      // 입력값 검증
      if (!validateFields()) {
        return;
      }

      console.log("로그인 시도", formData);

      // 로그인 API 호출
      const response = await axios.post("/api/users/login", {
        userId: formData.userId,
        userPw: formData.userPw,
      });

      console.log("로그인 응답:", response.data);

      if (response.data.success) {
        // 로그인 성공 - 모든 사용자 정보 저장
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userEmail", response.data.userEmail || "");
        localStorage.setItem("userInterest", response.data.userInterest || "");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginTime", new Date().toString());

        // 메인 페이지로 이동
        navigate("/", {
          state: {
            isLoggedIn: true,
            welcomeMessage: `${response.data.userId}님 환영합니다.`,
          },
        });
      } else {
        // 로그인 실패 처리
        const newFieldErrors = { userId: "", userPw: "" };
        
        if (response.data.status === 0) {
          // 아이디가 없는 경우
          newFieldErrors.userId = "가입 정보가 없습니다";
        } else if (response.data.status === 1) {
          // 비밀번호가 틀린 경우
          newFieldErrors.userPw = "비밀번호가 틀렸습니다";
        } else {
          // 기타 오류
          setErrorMessage(response.data.message || "로그인에 실패했습니다.");
        }

        setFieldErrors(newFieldErrors);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      // 서버 응답 오류 상세 정보 로깅
      if (error.response) {
        console.error("서버 응답 데이터:", error.response.data);
        console.error("서버 응답 상태:", error.response.status);
      }
      setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const logIn = [
    {
      label: "아이디",
      type: "text",
      state: "userId",
      placeholder: "아이디를 입력해주세요",
    },
    {
      label: "비밀번호",
      type: "password",
      state: "userPw",
      placeholder: "비밀번호를 입력해주세요",
    },
  ];

  return (
    <>
      <Header />
      <div className="logInBox">
        <h2> 로그인 </h2>
        <hr className="logInBar" />
        <div className="logInBoxCenter">
          <div className="loginInput">
            {logIn.map((field, i) => (
              <LogInFields
                key={i}
                label={field.label}
                type={field.type}
                value={formData[field.state]}
                onChange={(e) => handleChange(e, field.state)}
                placeholder={field.placeholder}
                errorMessage={fieldErrors[field.state]}
              />
            ))}
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          </div>
          <div className="logInBtn">
            <button onClick={handleLogin}>로그인</button>
          </div>
        </div>
      </div>
    </>
  );
}

function LogInFields({
  label,
  type,
  value,
  onChange,
  placeholder,
  errorMessage,
}) {
  return (
    <div className="inputField">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {errorMessage && (
        <div
          className="fieldError"
          style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
