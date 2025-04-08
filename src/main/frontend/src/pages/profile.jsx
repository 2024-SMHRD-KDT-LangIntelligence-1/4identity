import React, { useState, useEffect } from "react";
import Header from "../components/bar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // 이메일 도메인 옵션
  const emailDomains = ["naver.com", "gmail.com", "daum.net"];

  // 개별 필드 오류 메시지 상태
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    email: ""
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    emailId: "",
    emailDomain: emailDomains[0],
    userInterest: ""
  });

  const [userData, setUserData] = useState({
    userId: "",
    userEmail: "",
    userInterest: ""
  });

  // 카테고리 관련 상태
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryNames] = useState([
    "산업 및 트렌드",
    "소비자 기술·제품 리뷰",
    "정책 & 법률",
    "기업 및 브랜드",
    "미래 기술·혁신"
  ]);

  // 모달 관련 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [deleteResult, setDeleteResult] = useState({ success: false, message: "" });

  useEffect(() => {
    // 로그인 확인
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    // 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/profile/${userId}`);
        if (response.data.success) {
          setUserData(response.data);
          
          // 이메일 분리
          if (response.data.userEmail) {
            const [emailId, domain] = response.data.userEmail.split('@');
            setFormData(prev => ({
              ...prev,
              emailId: emailId,
              emailDomain: domain || emailDomains[0],
            }));
          }
          
          // 카테고리 찾기
          if (response.data.userInterest) {
            const categoryIndex = categoryNames.findIndex(cat => cat === response.data.userInterest);
            setSelectedCategory(categoryIndex !== -1 ? categoryIndex : null);
          }
          
          setLoading(false);
        } else {
          setErrorMessage("사용자 정보를 불러올 수 없습니다.");
          setLoading(false);
        }
      } catch (error) {
        console.error("사용자 정보 조회 오류:", error);
        setErrorMessage("서버 오류로 사용자 정보를 불러올 수 없습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, categoryNames]);

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    // 입력 시 해당 필드의 에러 메시지 초기화
    setFieldErrors({...fieldErrors, [field]: ""});
  };

  const handleEmailDomainChange = (e) => {
    setFormData({ ...formData, emailDomain: e.target.value });
  };

  const handleCategoryClick = (categoryIndex) => {
    setSelectedCategory(categoryIndex === selectedCategory ? null : categoryIndex);
  };

  const handleUpdateProfile = async () => {
    try {
      // 오류 상태 초기화
      setErrorMessage("");
      setSuccessMessage("");
      setFieldErrors({
        currentPassword: "",
        newPassword: "",
        email: ""
      });

      // 필수 필드 검증
      if (!formData.currentPassword) {
        setFieldErrors(prev => ({...prev, currentPassword: "현재 비밀번호를 입력해주세요"}));
        return;
      }

      // 이메일 검증
      if (!formData.emailId) {
        setFieldErrors(prev => ({...prev, email: "이메일을 입력해주세요"}));
        return;
      }
      
      // 관심사 선택 확인
      if (selectedCategory === null) {
        setErrorMessage("관심 분야를 선택해주세요.");
        return;
      }

      // 완성된 이메일
      const fullEmail = `${formData.emailId}@${formData.emailDomain}`;

      // 관심사 값 설정 - "소비자 기술·제품 리뷰"를 "제품 리뷰"로 변환
      let userInterest = categoryNames[selectedCategory];
      if (userInterest === "소비자 기술·제품 리뷰") {
        userInterest = "제품 리뷰";
      }

      const userId = localStorage.getItem("userId");
      const updateData = {
        currentPassword: formData.currentPassword,
        userEmail: fullEmail,
        userInterest: userInterest
      };

      // 새 비밀번호가 있는 경우만 포함
      if (formData.newPassword) {
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(`/api/users/profile/${userId}`, updateData);
      
      if (response.data.success) {
        setSuccessMessage("프로필이 성공적으로 업데이트되었습니다.");
        
        // 중요: 프로필 업데이트 성공 시 localStorage의 userInfo 업데이트
        const currentUserInfo = localStorage.getItem("userInfo");
        if (currentUserInfo) {
          try {
            const userInfoObj = JSON.parse(currentUserInfo);
            userInfoObj.userEmail = fullEmail;
            userInfoObj.userInterest = userInterest;
            
            // 업데이트된 정보 저장
            localStorage.setItem("userInfo", JSON.stringify(userInfoObj));
            console.log("localStorage userInfo 업데이트 완료:", userInfoObj);
            
            // 다른 탭에 변경 알림을 위해 storage 이벤트 발생시키기
            const storageEvent = new StorageEvent('storage', {
              key: 'userInfo',
              newValue: JSON.stringify(userInfoObj),
              oldValue: currentUserInfo,
              storageArea: localStorage
            });
            window.dispatchEvent(storageEvent);
          } catch (e) {
            console.error("localStorage userInfo 업데이트 실패:", e);
          }
        }
        
        // 폼 초기화
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: ""
        });
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      
      // 현재 비밀번호 불일치 에러 처리 (status 400)
      if (error.response && error.response.status === 400) {
        if (error.response.data.field === "currentPassword") {
          setFieldErrors(prev => ({
            ...prev, 
            currentPassword: "기존 비밀번호가 일치하지 않습니다"
          }));
        } else {
          setErrorMessage(error.response.data.message || "입력 정보를 확인해주세요.");
        }
      } else {
        setErrorMessage("서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 회원 탈퇴 모달 표시
  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };
  
  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      // 비밀번호 확인 로직 제거
      
      const response = await axios.delete(`/api/users/${userId}`, {
        data: {} // 비밀번호 전송 제거
      });
      
      setDeleteResult({
        success: response.data.success,
        message: response.data.message
      });
      
      setShowDeleteModal(false);
      setShowResultModal(true);
      
      if (response.data.success) {
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      
      setDeleteResult({
        success: false,
        message: "서버 오류가 발생했습니다. 다시 시도해주세요."
      });
      
      setShowDeleteModal(false);
      setShowResultModal(true);
    }
  };
  
  // 결과 모달 닫기 및 리다이렉트
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    
    // 탈퇴 성공 시 메인 페이지로 이동
    if (deleteResult.success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profileWrapper">
          <div className="profilePage">
            <h2>프로필 로딩 중...</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profileWrapper">
        <div className="profilePage">
          <h2 className="profileTitle">개인정보 수정</h2>
          <hr className="profileBar" />
          
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          {successMessage && <div className="successMessage">{successMessage}</div>}
          
          <div className="profileForm">
            {/* 아이디 필드 */}
            <div className="inputField">
              <label>아이디</label>
              <input 
                type="text" 
                value={userData.userId || ""} 
                disabled 
                className="disabledInput"
              />
            </div>
            
            {/* 현재 비밀번호 */}
            <div className="inputField">
              <label>현재 비밀번호</label>
              <input 
                type="password" 
                value={formData.currentPassword} 
                onChange={(e) => handleChange(e, "currentPassword")} 
                placeholder="현재 비밀번호를 입력하세요"
              />
              {fieldErrors.currentPassword && (
                <div className="fieldError">{fieldErrors.currentPassword}</div>
              )}
            </div>
            
            {/* 새 비밀번호 */}
            <div className="inputField">
              <label>새 비밀번호 (선택사항)</label>
              <input 
                type="password" 
                value={formData.newPassword} 
                onChange={(e) => handleChange(e, "newPassword")} 
                placeholder="변경할 비밀번호를 입력하세요"
              />
              {fieldErrors.newPassword && (
                <div className="fieldError">{fieldErrors.newPassword}</div>
              )}
            </div>
            
            {/* 이메일 */}
            <div className="inputField">
              <label>이메일</label>
              <div className="emailInput">
                <input 
                  type="text" 
                  value={formData.emailId} 
                  onChange={(e) => handleChange(e, "emailId")} 
                  placeholder="이메일"
                  id="inputEmail"
                  style={{ marginRight: "5px" }}
                />
                <span>@</span>
                <select 
                  value={formData.emailDomain} 
                  onChange={handleEmailDomainChange}
                >
                  {emailDomains.map((domain, index) => (
                    <option key={index} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.email && (
                <div className="fieldError">{fieldErrors.email}</div>
              )}
            </div>
            
            {/* 카테고리 선택 */}
            <div className="signUpCategory">
              <h4>관심 분야 변경</h4>
              <p style={{ fontSize: "13px", color: "#535151" }}>
                {" "}
                 관심 있는 분야를 먼저 요약해드릴게요.
            </p>
              <div className="categoryNum" id="category1">
                <div 
                  className={selectedCategory === 0 ? "selected" : ""} 
                  onClick={() => handleCategoryClick(0)}
                > 산업 및 트렌드 </div>
                <div 
                  className={selectedCategory === 1 ? "selected" : ""} 
                  onClick={() => handleCategoryClick(1)}
                > 소비자 기술·제품 리뷰 </div>
              </div>
              <div className="categoryNum" id="category2">
                <div 
                  className={selectedCategory === 2 ? "selected" : ""} 
                  onClick={() => handleCategoryClick(2)}
                > 정책 & 법률 </div>
                <div 
                  className={selectedCategory === 3 ? "selected" : ""} 
                  onClick={() => handleCategoryClick(3)}
                > 기업 및 브랜드 </div>
                <div 
                  className={selectedCategory === 4 ? "selected" : ""} 
                  onClick={() => handleCategoryClick(4)}
                > 미래 기술·혁신 </div>
              </div>
            </div>
            
            {/* 버튼 컨테이너 수정 */}
            <div className="buttonContainer">
              <button onClick={handleUpdateProfile} className="profileBtn">
                정보 수정
              </button>
              <button onClick={handleShowDeleteModal} className="deleteAccountBtn">
                회원 탈퇴
              </button>
            </div>
          </div>
          
          {/* 회원 탈퇴 확인 모달 */}
          {showDeleteModal && (
            <div className="modalOverlay">
              <div className="modalContent">
                <h3 className="modalTitle">회원 탈퇴</h3>
                <p className="modalMessage">정말 회원탈퇴 하시겠습니까?</p>
                <div className="modalButtons">
                  <button className="modalCancel" onClick={() => setShowDeleteModal(false)}>
                    아니오
                  </button>
                  <button className="modalConfirm" onClick={handleDeleteAccount}>
                    예
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 회원 탈퇴 결과 모달 */}
          {showResultModal && (
            <div className="modalOverlay">
              <div className="modalContent">
                <h3 className="modalTitle">
                  {deleteResult.success ? "회원 탈퇴 완료" : "오류"}
                </h3>
                <p className="modalMessage">{deleteResult.message}</p>
                <div className="modalButtons">
                  <button 
                    className={deleteResult.success ? "modalConfirm" : "modalCancel"} 
                    onClick={handleCloseResultModal}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
