import { useState, useEffect, createContext } from "react";
import "./App.css";
import Header from "./components/bar.jsx";
import SignUpPage from "./pages/signup.jsx";
import LoginPage from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import ProfilePage from "./pages/profile.jsx";
import NewsPage from "./pages/newspage.jsx";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// 사용자 정보 Context 생성
export const UserContext = createContext({
  isLoggedIn: false,
  userId: "",
  userInterest: "",
  setUserInfo: () => {},
  logout: () => {}
});

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 위치 정보 가져오기
  const [userState, setUserState] = useState({
    isLoggedIn: false,
    userId: "",
    userInterest: ""
  });

  // 사용자 정보 업데이트 함수
  const setUserInfo = (info) => {
    setUserState(prev => ({
      ...prev,
      ...info
    }));

    // 중요 정보를 localStorage에 저장
    if (info.userId) localStorage.setItem("userId", info.userId);
    if (info.userInterest) localStorage.setItem("userInterest", info.userInterest);
    if (info.isLoggedIn !== undefined) localStorage.setItem("isLoggedIn", info.isLoggedIn);
    
    // 사용자 정보를 하나의 객체로 localStorage에 저장
    localStorage.setItem("userInfo", JSON.stringify({
      userId: info.userId || userState.userId,
      userInterest: info.userInterest || userState.userInterest,
      isLoggedIn: info.isLoggedIn !== undefined ? info.isLoggedIn : userState.isLoggedIn
    }));
  };

  // 로그아웃 함수 개선
  const logout = () => {
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userInterest");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userInfo");

    setUserState({
      isLoggedIn: false,
      userId: "",
      userInterest: ""
    });
    
    // 현재 경로 확인 및 적절한 리다이렉션 처리
    const currentPath = location.pathname;
    
    if (currentPath === "/") {
      // 홈페이지에서 로그아웃한 경우, 페이지 새로고침
      console.log("홈페이지에서 로그아웃: 페이지 새로고침 실행");
      navigate("/", { replace: true });
      window.location.reload();
    } else {
      // 다른 페이지에서 로그아웃한 경우, 홈페이지로 이동
      console.log("다른 페이지에서 로그아웃: 홈페이지로 이동");
      navigate("/", { replace: true });
    }
  };

  // 앱 초기화시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        console.log("localStorage에서 사용자 정보 복원:", userInfo);
        
        // 세션 체크를 위해 서버에 확인 요청
        checkUserSession(userInfo.userId);
      } catch (e) {
        console.error("사용자 정보 파싱 오류:", e);
        // 오류 발생 시 localStorage 초기화
        localStorage.removeItem("userInfo");
      }
    } else {
      // 개별 항목에서 정보 복원 시도
      const userId = localStorage.getItem("userId");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userInterest = localStorage.getItem("userInterest") || "";
      
      if (userId && isLoggedIn) {
        console.log("개별 항목에서 사용자 정보 복원");
        
        // 세션 체크를 위해 서버에 확인 요청
        checkUserSession(userId);
      }
    }
  }, []);

  // 서버에 사용자 세션 유효성 확인
  const checkUserSession = async (userId) => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`/api/users/profile/${userId}`);
      
      if (response.data.success) {
        console.log("사용자 세션 유효성 확인 성공:", response.data);
        
        setUserState({
          isLoggedIn: true,
          userId: response.data.userId,
          userInterest: response.data.userInterest || ""
        });
        
        // localStorage 업데이트
        localStorage.setItem("userInfo", JSON.stringify({
          userId: response.data.userId,
          userInterest: response.data.userInterest || "",
          isLoggedIn: true
        }));
      } else {
        console.warn("사용자 세션 만료됨");
        logout();
      }
    } catch (error) {
      console.error("사용자 세션 확인 실패:", error);
      // 서버 오류 시 localStorage 기반으로 로그인 상태 유지
    }
  };

  return (
    <UserContext.Provider value={{
      ...userState,
      setUserInfo,
      logout
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newspage" element={<NewsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;