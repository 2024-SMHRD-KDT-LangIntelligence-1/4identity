import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import "./newspage.css";
import Header from "../components/bar";
import { FaClipboardCheck } from "react-icons/fa6"; // 아이콘 (npm install react-icons --save)

function NewsPage() {
  return (
    <>
      <Header />
      <div className="pageBody">
        <div className="titleBox">
          <div className="img">
            <FaClipboardCheck size={35} color="04B404" id="checkImg" />
            {/* <div className="checkTag"> 검증 된 뉴스 요약입니다.</div> */}
          </div>
          <div className="titleBoxContent">
            <p style={{ fontSize: "13px" }}>생성일자.카테고리</p>
            <h2> 뉴스 제목 </h2>
          </div>
        </div>
        <div className="contentBox">
          <p> 요약 본문 </p>
        </div>
        <div className="listBox"> 두두두두 </div>
      </div>
    </>
  );
}

export default NewsPage;
