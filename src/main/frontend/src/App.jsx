import { useState } from "react";
import "./App.css";
import Header from "./components/bar.jsx";
import SignUpPage from "./pages/signup.jsx";
import LoginPage from "./pages/login.jsx";
import Testpage from "./pages/home.jsx";
import ProfilePage from "./pages/profile.jsx";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function App() {
  let navigate = useNavigate();

  let goSignUpPage = () => {
    navigate("/signup");
  };

  let goLoginPage = () => {
    navigate("/login");
  };

  return (
    <>
      <Routes>
        {/* Route 는 페이지라고 생각하면 됨 */}
        <Route
          path="/"
          element={
            <>
              <Testpage />
            </>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
