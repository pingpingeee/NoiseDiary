"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsMenuOpen(false)
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

        {/* 액션 버튼들 */}
        <div className="header-actions">
          <button onClick={() => handleNavigation("/login")} className="btn btn-ghost">
            로그인
          </button>
          {/* <button onClick={() => handleNavigation("/register")} className="btn btn-primary">
            회원가입
          </button> */}
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
                    <span className="nav-icon">🏠</span>
                    홈
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/about")} className="mobile-nav-link">
                    <span className="nav-icon">ℹ️</span>
                    서비스 소개
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/features")} className="mobile-nav-link">
                    <span className="nav-icon">⚡</span>
                    기능
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/pricing")} className="mobile-nav-link">
                    <span className="nav-icon">💎</span>
                    요금제
                  </button>
                </li>
                <li className="mobile-nav-item">
                  <button onClick={() => handleNavigation("/support")} className="mobile-nav-link">
                    <span className="nav-icon">🎧</span>
                    고객지원
                  </button>
                </li>
              </ul>
            </nav>

            <div className="mobile-actions">
              <button onClick={() => handleNavigation("/login")} className="btn btn-ghost btn-full">
                로그인
              </button>
              <button onClick={() => handleNavigation("/register")} className="btn btn-primary btn-full">
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
