import React, { useState } from "react";
import Header from "../components/bar.jsx";
import "../pages/index.css";

function Testpage() {
  const testData = [
    {
      title: "개졸림 사건",
      summary: "개졸린사건이다",
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

  const [selectNews, setSelectNews] = useState(null);

  return (
    <>
      <main>
        <Header />
        <div className="home">
          <div className="mainNewsBox">
            <div className="mainNews">
              {selectNews ? (
                <>
                  <h3>{selectNews.title}</h3>
                  <p>{selectNews.summary}</p>
                </>
              ) : (
                <h3>뉴스를 선택해주세요</h3>
              )}
            </div>
            <div className="newsListBox">
              <div className="newsList">
                {testData.map((news, index) => (
                  <div
                    key={index}
                    className={`newsListItem ${
                      selectNews === news ? "selected" : ""
                    }`}
                    onClick={() => setSelectNews(news)}
                  >
                    {news.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Testpage;
