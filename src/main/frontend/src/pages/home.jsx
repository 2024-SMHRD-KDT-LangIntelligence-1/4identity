import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import Header from "../components/bar.jsx";
import NewsForm from "../components/newsForm.jsx";
import "../pages/index.css";

function Home() {
  const navigate = useNavigate();
  const testData = [
    {
      title: "긴 글씨 15자 이내로 잘 잘리는지 확인하기 위한 긴 글씨 ",
      summary:
        "이건 요약으로 보여줄 내용 하지만 어떻게 될지 모르기 때문에 테스트용으로;",
    },
    {
      title: "테스트",
      summary: "테스트테스트테스트",
    },
    {
      title: "4차산업과인공지는머신러닝딥러닝",
      summary: "흐앙",
    },
  ];

  const [selectNews, setSelectNews] = useState(testData[0]);

  return (
    <>
      <main>
        <Header />
        <div className="home">
          <div className="mainNewsBox">
            <div className="mainNews" onClick={() => navigate("/newspage")}>
              {selectNews ? (
                <>
                  <h3>{selectNews.title}</h3>
                  <p>{selectNews.summary}</p>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="newsListBox">
              <div className="newsList">
                {testData.map((news, index) => (
                  <div
                    key={news.title}
                    className={`newsListItem ${
                      selectNews === news ? "selected" : ""
                    }`}
                    onClick={() => setSelectNews(news)}
                  >
                    {news.title.length > 15
                      ? `${news.title.slice(0, 15)}...`
                      : news.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <NewsForm />
      </main>
    </>
  );
}

export default Home;
