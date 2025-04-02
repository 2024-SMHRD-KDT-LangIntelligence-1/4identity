import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import "./newspage.css";
import Header from "../components/bar";
import { FaCircleCheck } from "react-icons/fa6"; // 아이콘 (npm install react-icons --save)

function NewsPage() {
  const [keyword, setKeyword] = useState([]);

  const dummyData = [
    {
      word: "조선일보",
      url: "https://biz.chosun.com/it-science/ict/2025/04/02/MGYGJJ2M3BCVFHKK7DD5BWOLV4/",
    },
    {
      word: "컴퓨터미디어",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "경향신문",
      url: "https://www.inews24.com/view/1829813",
    },
    {
      word: "연합뉴스",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "중앙일보",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "지디넷코리아",
      url: "https://n.news.naver.com/mnews/article/092/0002369033",
    },
    {
      word: "아이뉴스24",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "kbc 광주방송",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "서울경제",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
    {
      word: "디지털데일리",
      url: "https://n.news.naver.com/mnews/article/366/0001065814",
    },
  ];

  return (
    <>
      <Header />
      <div className="pageBody">
        <div className="titleBox">
          <div className="img">
            <FaCircleCheck size={35} color="5FB404" id="checkImg" />
            {/* <div className="checkTag"> 검증 된 뉴스 요약입니다.</div> */}
          </div>
          <div className="titleBoxContent">
            <p style={{ fontSize: "13px" }}>생성일자.카테고리</p>
            <h2>
              광주 광산구, AI·미래기술 직접 배우는 진로교육 여기까지는 글자수
              예쁨
            </h2>
          </div>
        </div>
        <div className="contentBox">
          <p style={{ letterSpacing: "0.05em", fontStretch: "condensed" }}>
            광주 광산구가 청소년들의 창의·융합 역량 강화를 위해 인공지능(AI),
            미래기술 중심의 진로 교육 프로그램을 본격 운영한다. 4월부터는
            ‘학교로 찾아가는 진로 교육’이 시작되며, 5월부터는 지역 대학 및
            과학관과 연계한 ‘미래기술학교’도 문을 연다.광주 광산구가 청소년들의
            창의·융합 역량 강화를 위해 인공지능(AI), 미래기술 중심의 진로 교육
            프로그램을 본격 운영한다. 4월부터는 ‘학교로 찾아가는 진로 교육’이
            시작되며, 5월부터는 지역 대학 및 과학관과 연계한 ‘미래기술학교’도
            문을 연다.
          </p>
        </div>
        <div className="listBox">
          <h4> 관련 뉴스 바로가기 </h4>
          {dummyData.map((item, index) => (
            <li key={item.word}>
              <a href={item.url}>
                {index + 1}. {item.word}
                <span className="desktopOnly"> : {item.url}</span>
              </a>
            </li>
          ))}
        </div>
      </div>
    </>
  );
}

export default NewsPage;
