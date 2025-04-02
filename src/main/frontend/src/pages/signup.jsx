import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/bar.jsx";
import "./SignUp.css";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

// axios 기본 설정 간소화
axios.defaults.timeout = 5000; // 타임아웃 설정

function SignUpPage() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordCheck: "",
    userEmail: "",
    emailDomain: "naver.com",
  });

  // 상태 변수 추가
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNames] = useState([
    "산업 및 트렌드",
    "소비자 기술·제품 리뷰",
    "정책 및 법률",
    "기업 및 브랜드",
    "미래 기술·혁신",
  ]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    // 아이디가 변경되면 중복 확인 초기화
    if (field === "userId") {
      setIsIdChecked(false);
      setIdCheckMessage("");
    }

    // 비밀번호 확인 로직
    if (field === "password" || field === "passwordCheck") {
      if (field === "password") {
        setPasswordMatch(
          formData.passwordCheck === "" || value === formData.passwordCheck
        );
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };

  // 아이디 중복 확인 - 간소화된 버전
  const checkDuplicateId = async () => {
    if (!formData.userId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      console.log("아이디 중복 확인 요청:", formData.userId);

      const response = await axios.get(`/api/users/check-id`, {
        params: { userId: formData.userId },
      });

      console.log("서버 응답:", response.data);
      setIsIdChecked(true);
      setIdCheckMessage(response.data.message || "사용 가능한 아이디입니다.");
    } catch (error) {
      console.error("아이디 중복 확인 중 오류 발생:", error);
      setIdCheckMessage(
        "서버 연결에 실패했습니다. 서버가 실행 중인지 확인하세요."
      );
    }
  };

  // 회원가입 제출 함수
  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.userId || !formData.password || !formData.userEmail) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (!isIdChecked || idCheckMessage === "이미 존재하는 아이디입니다.") {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (selectedCategory === null) {
      alert("관심 분야를 선택해주세요.");
      return;
    }

    // 서버에 전송할 데이터 구성
    const fullEmail = `${formData.userEmail}@${formData.emailDomain}`;
    const userData = {
      userId: formData.userId,
      userPw: formData.password,
      userEmail: fullEmail,
      userInterest: categoryNames[selectedCategory],
    };

    try {
      const response = await axios.post("/api/users/register", userData);
      console.log("회원가입 응답:", response.data);

      if (response.data.success) {
        alert("회원가입이 완료되었습니다!");
        navigate("/");
      } else {
        alert(response.data.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
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

  const handleCategoryClick = (categoryIndex) => {
    setSelectedCategory(
      categoryIndex === selectedCategory ? null : categoryIndex
    );
  };

  const handleDomainChange = (e) => {
    setFormData({ ...formData, emailDomain: e.target.value });
  };

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
              {idCheckMessage && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "5px",
                    color: idCheckMessage.includes("사용 가능")
                      ? "green"
                      : "red",
                  }}
                >
                  {idCheckMessage}
                </div>
              )}
            </div>
            <button className="checkBtn" onClick={checkDuplicateId}>
              중복확인
            </button>
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
              <select
                value={formData.emailDomain}
                onChange={handleDomainChange}
              >
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
          {!passwordMatch && (
            <div
              style={{
                color: "red",
                fontSize: "0.8rem",
                marginTop: "-20px",
                marginBottom: "20px",
              }}
            >
              비밀번호가 일치하지 않습니다.
            </div>
          )}
        </div>

        <div className="signUpCategory">
          <h4> 어떤 분야에 관심이 있나요?</h4>
          <p style={{ fontSize: "13px", color: "#535151" }}>
            관심 있는 분야를 먼저 요약해드릴게요.
          </p>
          <div className="categoryNum" id="category1">
            <div
              className={selectedCategory === 0 ? "selected" : ""}
              onClick={() => handleCategoryClick(0)}
            >
              산업 및 트렌드
            </div>
            <div
              className={selectedCategory === 1 ? "selected" : ""}
              onClick={() => handleCategoryClick(1)}
            >
              소비자 기술·제품 리뷰
            </div>
          </div>
          <div className="categoryNum" id="category2">
            <div
              className={selectedCategory === 2 ? "selected" : ""}
              onClick={() => handleCategoryClick(2)}
            >
              정책 및 법률
            </div>
            <div
              className={selectedCategory === 3 ? "selected" : ""}
              onClick={() => handleCategoryClick(3)}
            >
              기업 및 브랜드
            </div>
            <div
              className={selectedCategory === 4 ? "selected" : ""}
              onClick={() => handleCategoryClick(4)}
            >
              미래 기술·혁신
            </div>
          </div>
        </div>

        <button className="signUpBtn" onClick={handleSubmit}>
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
