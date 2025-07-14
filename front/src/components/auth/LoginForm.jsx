// "use client"
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import Header from "../layout/Header"
// import Footer from "../layout/Footer"
// import { authService } from "../../services/authService"
// import "./LoginForm.css"

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     userId: "",
//     password: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//     // 입력 시 에러 메시지 제거
//     if (error) setError("")
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!formData.userId || !formData.password) {
//       setError("아이디와 비밀번호를 모두 입력해주세요.")
//       return
//     }

//     setLoading(true)
//     setError("")

//     try {
//       console.log("Attempting login with:", { userId: formData.userId })
//       const result = await authService.login(formData)
//       console.log("Login successful:", result)
//       // 로그인 성공 시 메인 페이지로 이동
//       navigate("/dashboard")
//     } catch (error) {
//       console.error("Login failed:", error)
//       if (error.response?.data?.message) {
//         setError(error.response.data.message)
//       } else if (error.response?.status === 401) {
//         setError("아이디 또는 비밀번호가 올바르지 않습니다.")
//       } else if (error.response?.status >= 500) {
//         setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
//       } else {
//         setError("로그인 중 오류가 발생했습니다.")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword)
//   }

//   return (
//     <>
//       <Header />
//       <div className="login-page">
//         <div className="login-container">
//           <div className="login-card">
//             {/* 좌측 브랜딩 섹션 */}
//             <div className="login-brand-section">
//               <div className="brand-content">
//                 <div className="login-logo">
//                   <div className="logo-icon">
//                     <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
//                       <path
//                         d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
//                         fill="currentColor"
//                       />
//                       <circle cx="12" cy="12" r="3" fill="white" />
//                     </svg>
//                   </div>
//                   <div className="brand-text">
//                     <span className="brand-name">소음일기</span>
//                     <span className="brand-tagline">Noise Diary</span>
//                   </div>
//                 </div>
                
//                 <div className="welcome-content">
//                   <h2>다시 만나서 반가워요!</h2>
//                   <p>
//                     소음일기와 함께 특별한 순간들을 기록하고<br />
//                     더 풍부한 일상을 만들어보세요.
//                   </p>
                  
//                   <div className="features">
//                     <div className="feature-item">
//                       <i className="fas fa-book"></i>
//                       <span>개인 일기 작성</span>
//                     </div>
//                     <div className="feature-item">
//                       <i className="fas fa-share-alt"></i>
//                       <span>순간 공유</span>
//                     </div>
//                     <div className="feature-item">
//                       <i className="fas fa-heart"></i>
//                       <span>추억 보관</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 우측 로그인 폼 섹션 */}
//             <div className="login-form-section">
//               <div className="form-header">
//                 <h3>로그인</h3>
//                 <p>계정에 로그인하여 서비스를 이용하세요</p>
//               </div>

//               <form onSubmit={handleSubmit} className="login-form">
//                 <div className="form-group">
//                   <label htmlFor="userId">
//                     <i className="fas fa-user"></i>
//                     아이디
//                   </label>
//                   <input
//                     type="text"
//                     id="userId"
//                     name="userId"
//                     value={formData.userId}
//                     onChange={handleChange}
//                     placeholder="아이디를 입력하세요"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password">
//                     <i className="fas fa-lock"></i>
//                     비밀번호
//                   </label>
//                   <div className="password-input-container">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       id="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="비밀번호를 입력하세요"
//                       required
//                       disabled={loading}
//                     />
//                     <button type="button" className="password-toggle" onClick={togglePasswordVisibility} disabled={loading}>
//                       <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="login-options">
//                   <div className="remember-me">
//                     <input
//                       type="checkbox"
//                       id="rememberMe"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                     />
//                     <label htmlFor="rememberMe">
//                       <span className="checkmark"></span>
//                       로그인 상태 유지
//                     </label>
//                   </div>
//                   <button type="button" className="forgot-password">
//                     비밀번호 찾기
//                   </button>
//                 </div>

//                 {error && (
//                   <div className="error-message">
//                     <i className="fas fa-exclamation-triangle"></i>
//                     <span>{error}</span>
//                   </div>
//                 )}

//                 <button type="submit" className="login-button" disabled={loading}>
//                   {loading ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin"></i>
//                       <span>로그인 중...</span>
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-sign-in-alt"></i>
//                       <span>로그인</span>
//                     </>
//                   )}
//                 </button>

//                 <div className="divider">
//                   <span>또는</span>
//                 </div>

//                 <div className="social-login">
//                   <button type="button" className="social-button google">
//                     <i className="fab fa-google"></i>
//                     <span>Google 로그인</span>
//                   </button>
//                   <button type="button" className="social-button kakao">
//                     <i className="fas fa-comment"></i>
//                     <span>카카오 로그인</span>
//                   </button>
//                 </div>

//                 <div className="signup-link">
//                   <p>
//                     아직 계정이 없으신가요?{" "}
//                     <button type="button" onClick={() => navigate("/register")} className="signup-button">
//                       회원가입
//                     </button>
//                   </p>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default LoginForm
