import { useState } from "react";
import "./bar.css";
/* lucide-react 아이콘 라이브러리에서 햄버거 메뉴, 엑스 아이콘 가져오기 */
/* 이 아이콘들은 SVG 형태로 제공되는 React 컴포넌트 */

function Header() {
  const [isOpen, setisOpen] = useState(false);

  return (
    <header>
      {/* <button className="headerBtn" onClick={() => setisOpen(!isOpen)}></button> */}
      <ul>
        <li>홈</li>
        <li>메뉴1</li>
        <li>메뉴2</li>
        <li>메뉴3</li>
        <li>메뉴4</li>
        <li>메뉴5</li>
      </ul>
    </header>
  );
}

export default Header;
