"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
// import { authService } from "../../services/authService"
import { authService } from ".././services/authService"
import "./MainPage.css"

const MainPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        navigate("/login")
        return
      }

      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // 에러가 발생해도 로그아웃 처리
      navigate("/login")
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="main-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p>로딩 중...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="main-page">
        <div className="main-container">
          {/* 헤더 섹션 */}
          <div className="main-header">
            <div className="welcome-section">
              <h1>안녕하세요, {user?.name || user?.userId}님! 👋</h1>
              <p>소음일기에 오신 것을 환영합니다.</p>
            </div>
            <div className="user-actions">
              <button className="btn-profile">
                <i className="fas fa-user"></i>
                프로필
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                로그아웃
              </button>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="main-content">
            <div className="content-grid">
              {/* 일기 작성 카드 */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-pen"></i>
                  </div>
                  <h3>새 일기 작성</h3>
                </div>
                <p>오늘의 특별한 순간을 기록해보세요.</p>
                <button className="card-button">
                  <i className="fas fa-plus"></i>
                  일기 쓰기
                </button>
              </div>

              {/* 일기 목록 카드 */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <h3>내 일기</h3>
                </div>
                <p>지금까지 작성한 일기들을 확인해보세요.</p>
                <button className="card-button">
                  <i className="fas fa-list"></i>
                  일기 보기
                </button>
              </div>

              {/* 통계 카드 */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <h3>통계</h3>
                </div>
                <p>일기 작성 현황과 통계를 확인해보세요.</p>
                <button className="card-button">
                  <i className="fas fa-analytics"></i>
                  통계 보기
                </button>
              </div>

              {/* 설정 카드 */}
              <div className="content-card">
                <div className="card-header">
                  <div className="card-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <h3>설정</h3>
                </div>
                <p>계정 정보와 앱 설정을 관리하세요.</p>
                <button className="card-button">
                  <i className="fas fa-gear"></i>
                  설정하기
                </button>
              </div>
            </div>
          </div>

          {/* 최근 활동 섹션 */}
          <div className="recent-activity">
            <h2>최근 활동</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-pen"></i>
                </div>
                <div className="activity-content">
                  <h4>새로운 일기 작성</h4>
                  <p>첫 번째 일기를 작성해보세요!</p>
                  <span className="activity-time">방금 전</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="activity-content">
                  <h4>회원가입 완료</h4>
                  <p>소음일기에 가입해주셔서 감사합니다!</p>
                  <span className="activity-time">방금 전</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MainPage
