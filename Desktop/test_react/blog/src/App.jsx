import { use, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  let post = "글 제목";
  let [a, b] = useState(["잠깐 저장할 내용", "블로그 제목", "브으으을로그"]);
  let [good, setGood] = useState([0, 0, 0]);
  let [modal, setModal] = useState(false);
  let [title, setTitle] = useState(1);

  return (
    <div className="App">
      <div className="black-nav">
        <h4>제목</h4>
      </div>
      {/* 
      <div className="list">
        <h4 style={{ color: "green", fontSize: "16px" }}>
          {a[0]}
          <span
            onClick={() => {
              setGood(good + 1);
            }}
          >
            굿₩
          </span>{" "}
          {good}
        </h4>
        <p>글발행일</p>
      </div>
      <div className="list">
        <h4 style={{ color: "green", fontSize: "16px" }}>{a[1]}</h4>
        <p>글발행일</p>
      </div>
      <div className="list">
        <h4
          style={{ color: "green", fontSize: "16px" }}
          onClick={() => {
            modal == false ? setModal(true) : setModal(false);
            // setModal(true);
          }}
        >
          {a[2]}
        </h4>
        <p>글발행일</p>
      </div>
       */}
      {a.map(function (a, i) {
        return (
          <div className="list" key={i}>
            <h4
              onClick={() => {
                modal == false ? setModal(true) : setModal(false);
                setTitle(i);
              }}
            >
              {a}
              <span
                onClick={() => {
                  let copyGood = [...good];
                  copyGood[i] = copyGood[i] + 1;
                  setGood(copyGood);
                }}
              >
                굿
              </span>{" "}
              {good[i]}
            </h4>
            <p>발행일자</p>
          </div>
        );
      })}

      <button
        onClick={() => {
          let copy = [...a];
          copy[0] = "변경할 내용";
          b(copy);
        }}
        변경
      >
        변경
      </button>
      <button
        onClick={() => {
          let titlecopy = [...a];
          titlecopy.sort((titleA, titleB) =>
            titleA.localeCompare(titleB, "ko")
          );
          b(titlecopy);
        }}
      >
        가나다순 정렬
      </button>

      <button
        onClick={() => {
          setTitle(0);
        }}
      >
        글제목
      </button>

      {
        /* 조건식 : 삼항 연산자 사용( if xxx) */
        /* 조건식 ? 참일 때 실행할 코드 : 거짓일 때 실행할 코드 */
        modal == true ? <Modal 제목={title} 작명={a} /> : null
      }
    </div>
  );
}

function Modal(props) {
  return (
    <div className="modal">
      <h4>{props.작명[props.제목]}</h4>
      <p>날짜</p>
      <p>상세내용</p>
      <button>글수정</button>
    </div>
  );
}

export default App;
