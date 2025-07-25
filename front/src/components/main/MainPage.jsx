"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import { authService } from "../../services/authService"
// import diaryService from "../../services/diaryService"
import "./MainPage.css"

const MainPage = () => {
  const [user, setUser] = useState(null)
  const [todayMood, setTodayMood] = useState("")
  const [recentDiaries, setRecentDiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingMood, setSubmittingMood] = useState(false)
  const [stats, setStats] = useState({
    totalDiaries: 0,
    thisWeekDiaries: 0,
    averageMood: 0,
    streak: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    const initializePage = async () => {
      try {
        console.log("🏠 MainPage: Initializing...")

        // 사용자 정보 가져오기
        const userInfo = authService.getCurrentUser()
        if (userInfo) {
          setUser(userInfo)
          console.log("👤 MainPage: User info loaded:", userInfo)
        }

        // 데이터 로드
        await Promise.all([loadRecentDiaries(), loadTodayMood(), loadUserStats()])
      } catch (error) {
        console.error("❌ MainPage: Error initializing:", error)
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [navigate])

  const loadRecentDiaries = async () => {
    try {
      console.log("📖 MainPage: Loading recent diaries...")
      const diaries = await diaryService.getRecentDiaries(6)
      setRecentDiaries(diaries)
      console.log("✅ MainPage: Recent diaries loaded:", diaries.length)
    } catch (error) {
      console.error("❌ MainPage: Error loading recent diaries:", error)
      setRecentDiaries([])
    }
  }

  const loadTodayMood = async () => {
    try {
      console.log("💭 MainPage: Loading today's mood...")
      const today = new Date().toISOString().split("T")[0]
      const todayDiary = await diaryService.getDiaryByDate(today)
      if (todayDiary) {
        setTodayMood(todayDiary.diary_content)
        console.log("✅ MainPage: Today's mood loaded")
      }
    } catch (error) {
      console.error("❌ MainPage: Error loading today's mood:", error)
    }
  }

  const loadUserStats = async () => {
    try {
      setStats({
        totalDiaries: 42,
        thisWeekDiaries: 5,
        averageMood: 7.2,
        streak: 12,
      })
    } catch (error) {
      console.error("❌ MainPage: Error loading stats:", error)
    }
  }

  const handleMoodSubmit = async (e) => {
    e.preventDefault()
    if (!todayMood.trim()) return

    setSubmittingMood(true)
    try {
      const today = new Date().toISOString().split("T")[0]

      const diaryData = {
        diary_title: `${today} 기분 일기`,
        diary_content: todayMood,
        diary_date: today,
        mood_score: 5,
      }

      await diaryService.createDiary(diaryData)
      console.log("✅ MainPage: Today's mood saved successfully")

      await loadRecentDiaries()
      await loadUserStats()

      showSuccessToast("오늘의 기분이 저장되었습니다!")
    } catch (error) {
      console.error("❌ MainPage: Error saving mood:", error)
      showErrorToast("기분 저장 중 오류가 발생했습니다.")
    } finally {
      setSubmittingMood(false)
    }
  }

  const showSuccessToast = (message) => {
    const toast = document.createElement("div")
    toast.className = "success-toast"
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }

  const showErrorToast = (message) => {
    const toast = document.createElement("div")
    toast.className = "error-toast"
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: "#22c55e",
      sad: "#3b82f6",
      angry: "#ef4444",
      excited: "#f59e0b",
      calm: "#8b5cf6",
      anxious: "#f97316",
      neutral: "#6b7280",
    }
    return emotionColors[emotion] || "#6b7280"
  }

  const getEmotionText = (emotion) => {
    const emotionTexts = {
      happy: "기쁨",
      sad: "슬픔",
      angry: "화남",
      excited: "신남",
      calm: "평온",
      anxious: "불안",
      neutral: "보통",
    }
    return emotionTexts[emotion] || "알 수 없음"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "오늘"
    if (diffDays === 2) return "어제"
    if (diffDays <= 7) return `${diffDays - 1}일 전`

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="main-page">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">데이터를 불러오는 중입니다...</p>
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
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">안녕하세요, {user?.name || user?.userId}님!</h1>
            <p className="welcome-subtitle">오늘도 소중한 하루를 기록해보세요</p>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalDiaries}</div>
                <div className="stat-label">총 일기</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.thisWeekDiaries}</div>
                <div className="stat-label">이번 주</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.averageMood}</div>
                <div className="stat-label">평균 기분</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.streak}</div>
                <div className="stat-label">연속 기록</div>
              </div>
            </div>
          </div>

          {/* Today's Mood Section */}
          <div className="mood-section">
            <div className="mood-card">
              <div className="mood-header">
                <div className="mood-title-container">
                  <div className="mood-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                      <rect x="2" y="9" width="20" height="11" rx="2" ry="2" />
                      <circle cx="12" cy="15" r="1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="mood-title">오늘의 마음을 들려주세요</h2>
                    <p className="mood-subtitle">지금 이 순간의 감정과 생각을 자유롭게 표현해보세요</p>
                  </div>
                </div>
                <div className="mood-date">
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </div>
              </div>

              <form onSubmit={handleMoodSubmit} className="mood-form">
                <div className="textarea-container">
                  <textarea
                    value={todayMood}
                    onChange={(e) => setTodayMood(e.target.value)}
                    placeholder="오늘 어떤 하루를 보내고 계신가요? 기분, 생각, 경험했던 일들을 자유롭게 적어보세요..."
                    className="mood-textarea"
                    rows="6"
                    disabled={submittingMood}
                    maxLength="1000"
                  />
                  <div className="char-counter">
                    <span className={todayMood.length > 800 ? "warning" : ""}>{todayMood.length}</span>
                    <span>/1000</span>
                  </div>
                </div>

                <div className="mood-actions">
                  <div className="mood-tips">
                    <svg className="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className="tip-text">솔직한 감정 표현이 더 의미 있는 기록을 만듭니다</span>
                  </div>
                  <button
                    type="submit"
                    className={`mood-submit-btn ${submittingMood ? "submitting" : ""}`}
                    disabled={!todayMood.trim() || submittingMood}
                  >
                    {submittingMood ? (
                      <>
                        <div className="btn-spinner"></div>
                        <span>저장하는 중...</span>
                      </>
                    ) : (
                      <>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17,21 17,13 7,13 7,21" />
                          <polyline points="7,3 7,8 15,8" />
                        </svg>
                        <span>오늘의 기분 저장하기</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Recent Diaries Section */}
          <div className="recent-diaries-section">
            <div className="section-header">
              <div className="section-title-container">
                <h2 className="section-title">
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  최근의 이야기들
                </h2>
                <p className="section-subtitle">당신이 기록한 소중한 순간들을 다시 만나보세요</p>
              </div>
              <button onClick={() => navigate("/diary/list")} className="view-all-btn">
                <span>전체보기</span>
                <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="recent-diaries-grid">
              {recentDiaries.length > 0 ? (
                recentDiaries.map((diary, index) => (
                  <div key={diary.diary_no} className="diary-card" onClick={() => navigate(`/diary/${diary.diary_no}`)}>
                    <div className="diary-header">
                      <div className="diary-date-badge">{formatDate(diary.diary_date)}</div>
                      <div className="diary-emotion">
                        <div
                          className="emotion-badge"
                          style={{ backgroundColor: getEmotionColor(diary.diary_emotion) }}
                        >
                          {getEmotionText(diary.diary_emotion)}
                        </div>
                      </div>
                    </div>

                    <div className="diary-content">
                      <h3 className="diary-title">{diary.diary_title}</h3>
                      <div className="diary-preview">
                        {diary.diary_content.length > 120
                          ? `${diary.diary_content.substring(0, 120)}...`
                          : diary.diary_content}
                      </div>
                    </div>

                    <div className="diary-footer">
                      <div className="diary-meta">
                        <span className="read-time">
                          <svg className="clock-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {Math.ceil(diary.diary_content.length / 200)}분 읽기
                        </span>
                      </div>
                      <div className="diary-arrow">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                  </div>
                  <div className="empty-content">
                    <h3 className="empty-title">첫 번째 이야기를 시작해보세요</h3>
                    <p className="empty-description">
                      당신의 소중한 순간들을 기록하고 추억을 만들어보세요.
                      <br />
                      매일의 작은 기록이 큰 변화를 만들어냅니다.
                    </p>
                    <button onClick={() => navigate("/diary/write")} className="empty-action-btn">
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <span>첫 일기 작성하기</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MainPage
