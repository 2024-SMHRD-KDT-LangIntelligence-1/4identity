import React from "react";
import Header from "../components/bar.jsx";
import SignUpPage from "./signup.jsx";
import "../pages/index.css";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function Testpage() {
  return (
    <>
      <main>
        <Header />
        {/* <div className="backGreen"></div> */}
        <div className="mainNewsBox">
          <div className="mainNews"> alal</div>
        </div>
      </main>
    </>
  );
}

export default Testpage;
