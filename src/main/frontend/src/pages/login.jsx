import React, { useState } from "react";
import Header from "../components/bar.jsx";
import "../pages/login.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    userid: "",
    password: "",
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const logIn = [
    {
      label: "아이디",
      type: "text",
      state: "id",
      placeholder: "아이디를 입력해주세요",
    },
    {
      label: "비밀번호",
      type: "password",
      state: "password",
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
        </div>
        <button
          onClick={() => {
            console.log("로그인", formData);
            navigate("/");
          }}
        >
          로그인
        </button>
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
