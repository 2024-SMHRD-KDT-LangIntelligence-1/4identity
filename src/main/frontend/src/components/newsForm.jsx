import React, { useState, useEffect } from "react";
import Header from "./bar";
import "./newsForm.css";

function NewsForm() {
  const category = [
    "산업 및 트렌드",
    "제품 리뷰",
    "정책 및 법률",
    "기업 및 브랜드",
    "미래 기술·혁신",
  ];

  const [titles, setTitles] = useState([]);

  // useEffect 테스트 - 페이지가 열리자마자 실행되는 코드,, 렌더링 될 때 실행되는 코드
  // 임시 데이터로 테스트 테스트
  useEffect(() => {
    const testTitles = [
      "오늘의 뉴스 리스트 테스트 문구",
      "테스트 문구 20자 내로 잘 잘리는지 조금 긴 문구도 필요하여 이렇게 길게 적어봄 ",
      "test",
      "테스트용으로 적는데 쓸말이없네",
      "찌긴바나나찌낀바나냐",
    ];

    // 랜덤으로 보여주기
    const shuffled = testTitles.sort(() => 0.5 - Math.random());
    setTitles(shuffled.slice(0, 5));
  }, []);

  return (
    <>
      <div className="mainBox">
        <div className="todays">
          <h4 className="mainTitle">오늘의 주요 기사</h4>
          {titles.map((title, index) => (
            <div key={index} className="titleItem">
              {title.length > 20 ? `${title.slice(0, 20)}...` : title}
            </div>
          ))}
        </div>
        <div className="categoryName">
          <h4 className="mainTitle"> 카테고리명 </h4>
          <div>list</div>
          <div>list</div>
        </div>
        <div className="keyWords">
          <h4 className="mainTitle">오늘의 키워드</h4>
          <div>list</div>
        </div>
      </div>
    </>
  );
}

export default NewsForm;
