import React, { useState } from "react";
import Header from "./bar";
import "./newsForm.css";

function NewsForm() {
  return (
    <>
      <div className="todays"> 오늘의 주요 기사 </div>
      <div className="categoryName"> 카테고리명 </div>
      <div className="keyWords"> 오늘의 키워드 </div>
    </>
  );
}

export default NewsForm;
