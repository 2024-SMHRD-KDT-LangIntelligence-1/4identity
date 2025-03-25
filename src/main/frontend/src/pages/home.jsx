import React from "react";
import Header from "../components/bar.jsx";
import SignUpPage from "./signup.jsx";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function Testpage() {
  return (
    <>
      <Header />
      <div className="backGreen"></div>
    </>
  );
}

export default Testpage;
