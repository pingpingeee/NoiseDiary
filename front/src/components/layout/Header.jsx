"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../services/authService"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await authService.isAuthenticated()
        setIsAuthenticated(authStatus)

        if (authStatus) {
          const userInfo = authService.getCurrentUser()
          setUser(userInfo)
          console.log("유저정보:", userInfo)
        }
      } catch (error) {
        console.error("인증 상태 에러 :", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      console.log("로그아웃")
      await authService.logout()
      setIsAuthenticated(false)
      setUser(null)
      navigate("/", { replace: true })
      setIsMenuOpen(false)
    } catch (error) {
      console.error("로그아웃에러", error)
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* 로고 섹션 */}
        <div className="header-logo" onClick={() => handleNavigation("/")}>
          <div className="header-logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
          <div className="header-logo-text">
            <span className="header-brand-name">소음일기</span>
            <span className="header-brand-tagline">Noise Diary</span>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className={`header-nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <button onClick={() => handleNavigation("/")} className="nav-link">
                홈
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/about")} className="nav-link">
                서비스 소개
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/features")} className="nav-link">
                기능
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/pricing")} className="nav-link">
                요금제
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => handleNavigation("/support")} className="nav-link">
                고객지원
              </button>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          {loading ? (
            // 로딩 중일 때
            <div className="auth-loading">
              <i className="fas fa-spinner fa-spin" style={{ color: "#666" }}></i>
            </div>
          ) : isAuthenticated ? (
            // 로그인된 상태
            <div className="user-menu">
              {/* <div className="user-info">
                <span className="user-name">
                  <i className="fas fa-user" style={{ marginRight: "0.5rem" }}></i>
                  {user?.name || user?.userId || "사용자"}님
                </span>
              </div> */}

              <button onClick={handleLogout} className="btn btn-outline">
                <i className="fas fa-sign-out-alt" style={{ marginRight: "0.5rem" }}></i>
                로그아웃
              </button>
            </div>
          ) : (
            // 로그인되지 않은 상태
            <div className="auth-buttons">
              <button onClick={() => handleNavigation("/login")} className="btn btn-ghost">
                로그인 & 회원가입
              </button>
              {/* <button onClick={() => handleNavigation("/login")} className="btn btn-primary">
                회원가입
              </button> */}
            </div>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className={`mobile-menu-btn ${isMenuOpen ? "menu-open" : ""}`} onClick={toggleMenu}>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <div className="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      fill="currentColor"
                    />
                    <circle cx="12" cy="12" r="3" fill="white" />
                  </svg>
                </div>
                <span className="mobile-brand-name">소음일기</span>
              </div>
              <button className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/")} className="mobile-nav-link">
                    <span className="nav-icon">
                      <i className="fas fa-home"></i>
                    </span>
                    홈
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/about")} className="mobile-nav-link">
                    <span className="nav-icon">
                      <i className="fas fa-info-circle"></i>
                    </span>
                    서비스 소개
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/features")} className="mobile-nav-link">
                    <span className="nav-icon">
                      <i className="fas fa-magic"></i>
                    </span>
                    기능
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/pricing")} className="mobile-nav-link">
                    <span className="nav-icon">
                      <i className="fas fa-crown"></i>
                    </span>
                    요금제
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/support")} className="mobile-nav-link">
                    <span className="nav-icon">
                      <i className="fas fa-headset"></i>
                    </span>
                    고객지원
                  </button>
                </li>
              </ul>
            </nav>

            {/* <div className="mobile-actions">
              <button onClick={() => handleNavigation("/login")} className="btn btn-ghost btn-full">
                로그인 & 회원가입
              </button>
            </div> */}


            <div className="mobile-actions">
              {loading ? (
                <div className="mobile-auth-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              ) : isAuthenticated ? (
                // 로그인된 상태 - 모바일
                <div className="mobile-user-menu">
                  {/* <div className="mobile-user-info">
                    <i className="fas fa-user"></i>
                    <span>{user?.name || user?.userId || "사용자"}님</span>
                  </div> */}

                  <button onClick={handleLogout} className="btn btn-outline btn-full">
                    <i className="fas fa-sign-out-alt" style={{ marginRight: "0.5rem" }}></i>
                    로그아웃
                  </button>
                </div>
              ) : (
                // 로그인되지 않은 상태 - 모바일
                <button onClick={() => handleNavigation("/login")} className="btn btn-ghost btn-full">
                  로그인 & 회원가입
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}

export default Header
