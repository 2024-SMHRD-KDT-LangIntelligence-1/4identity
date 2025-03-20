// /**
//  * 4Identity 웹사이트의 메인 TypeScript 파일
//  * 로그인/로그아웃 버튼의 UI 상태 관리
//  */

// // DOM 요소 가져오기
// document.addEventListener('DOMContentLoaded', () => {
//     // 버튼 요소 선택
//     const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
//     const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;
    
//     // 로그인 상태를 저장하는 변수 (나중에 실제 인증 시스템으로 대체)
//     let isLoggedIn = false;
    
//     /**
//      * 로그인 상태에 따라 버튼 표시 상태를 업데이트하는 함수
//      */
//     const updateAuthButtons = () => {
//         if (isLoggedIn) {
//             // 로그인 상태: 로그인 버튼 숨기고 로그아웃 버튼 표시
//             loginBtn.style.display = 'none';
//             logoutBtn.style.display = 'block';
//         } else {
//             // 로그아웃 상태: 로그인 버튼 표시하고 로그아웃 버튼 숨김
//             loginBtn.style.display = 'block';
//             logoutBtn.style.display = 'none';
//         }
//     };
    
//     // 로그인 버튼 클릭 이벤트 처리
//     loginBtn.addEventListener('click', () => {
//         // 나중에 실제 로그인 로직으로 대체
//         console.log('로그인 시도...');
//         isLoggedIn = true;
//         updateAuthButtons();
//         alert('로그인되었습니다.');
//     });
    
//     // 로그아웃 버튼 클릭 이벤트 처리
//     logoutBtn.addEventListener('click', () => {
//         // 나중에 실제 로그아웃 로직으로 대체
//         console.log('로그아웃 시도...');
//         isLoggedIn = false;
//         updateAuthButtons();
//         alert('로그아웃되었습니다.');
//     });
    
//     // 초기 버튼 상태 설정
//     updateAuthButtons();
// });

