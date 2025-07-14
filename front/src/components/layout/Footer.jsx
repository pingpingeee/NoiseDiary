"use client"

import { useNavigate } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 메인 푸터 콘텐츠 */}
        <div className="footer-main">
          {/* 브랜드 섹션 */}
          <div className="footer-brand">
            <div className="footer-logo" onClick={() => handleNavigation("/")}>
              <div className="footer-logo-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                  <circle cx="12" cy="12" r="3" fill="white" />
                </svg>
              </div>
              <div className="footer-brand-text">
                <span className="footer-brand-name">소음일기</span>
                <span className="footer-brand-tagline">Noise Diary</span>
              </div>
            </div>
            <p className="footer-description">
              당신만의 특별한 순간들을 기록하고 공유하세요.
              <br />
              소음일기와 함께 더 풍부한 일상을 만들어보세요.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 링크 섹션들 */}
          <div className="footer-links">
            <div className="footer-section">
              <h3 className="footer-section-title">서비스</h3>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => handleNavigation("/about")} className="footer-link">
                    서비스 소개
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/features")} className="footer-link">
                    주요 기능
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/pricing")} className="footer-link">
                    요금제
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/updates")} className="footer-link">
                    업데이트
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">고객지원</h3>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => handleNavigation("/help")} className="footer-link">
                    도움말
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/faq")} className="footer-link">
                    자주 묻는 질문
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/contact")} className="footer-link">
                    문의하기
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/community")} className="footer-link">
                    커뮤니티
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">회사</h3>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => handleNavigation("/company")} className="footer-link">
                    회사 소개
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/careers")} className="footer-link">
                    채용 정보
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/press")} className="footer-link">
                    보도자료
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/blog")} className="footer-link">
                    블로그
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-section-title">법적 고지</h3>
              <ul className="footer-link-list">
                <li>
                  <button onClick={() => handleNavigation("/terms")} className="footer-link">
                    이용약관
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/privacy")} className="footer-link">
                    개인정보처리방침
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/cookies")} className="footer-link">
                    쿠키 정책
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigation("/licenses")} className="footer-link">
                    라이선스
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 뉴스레터 구독 */}
        {/* <div className="footer-newsletter">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">최신 소식을 받아보세요</h3>
              <p className="newsletter-description">새로운 기능과 업데이트 소식을 가장 먼저 전해드립니다.</p>
            </div>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  구독하기
                </button>
              </div>
              <p className="newsletter-privacy">
                구독 시 <button className="privacy-link">개인정보처리방침</button>에 동의하게 됩니다.
              </p>
            </form>
          </div>
        </div> */}

        {/* 하단 저작권 */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} 소음일기(Noise Diary). All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <button onClick={() => handleNavigation("/sitemap")} className="bottom-link">
                사이트맵
              </button>
              <button onClick={() => handleNavigation("/accessibility")} className="bottom-link">
                접근성
              </button>
              <button onClick={() => handleNavigation("/security")} className="bottom-link">
                보안
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
