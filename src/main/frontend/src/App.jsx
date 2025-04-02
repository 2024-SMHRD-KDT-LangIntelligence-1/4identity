import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/bar.jsx";
import SignUpPage from "./pages/signup.jsx";
import LoginPage from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import ProfilePage from "./pages/profile.jsx";
import NewsPage from "./pages/newspage.jsx";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

function App() {
  let navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 앱 초기화시 세션 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        return;
      }
      
      try {
        // 서버에 사용자 정보 확인 요청
        const response = await axios.get(`/api/users/profile/${userId}`);
        if (response.data.success) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        } else {
          // 서버에 사용자 정보가 없는 경우 로그아웃 처리
          handleLogout();
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error);
        // 서버 오류시 로그아웃 처리 (선택적)
        // handleLogout();
      }
    };
    
    checkLoginStatus();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userInterest");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
    setIsLoggedIn(false);
  };

  let goSignUpPage = () => {
    navigate("/signup");
  };

  let goLoginPage = () => {
    navigate("/login");
  };

  let gonewspage = () => {
    navigate("/newspage");
  };

  return (
    <>
      <Routes>
        {/* Route 는 페이지라고 생각하면 됨 */}
        <Route path="/" element={<Home />} />
        <Route path="/newspage" element={<NewsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
