import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import Header from "../components/bar.jsx";
import NewsForm from "../components/newsForm.jsx";
import "../pages/index.css";

function Home() {
  const navigate = useNavigate();
  const testData = [
    {
      title: "가나다라마바사아자차카파타하치키차카초코촠",
      summary: "치키치키차카초코초코촠치키치키헉바나나킥먹고싶어지는디;",
    },
    {
      title: "집가고 싶다",
      summary: "집에가고싶다",
    },
    {
      title: "생각 안하기",
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
