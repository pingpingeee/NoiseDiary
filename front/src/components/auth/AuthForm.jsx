"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import { authService } from "../../services/authService"
import { userService } from "../../services/userService"
import "./AuthForm.css"

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true) // 로그인/회원가입 모드
  const [currentStep, setCurrentStep] = useState(1)

  // 로그인 폼 데이터
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  })

  // 회원가입 폼 데이터
  const [registerData, setRegisterData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    zipCode: "",
    roadAddress: "",
    detailAddress: "",
    emailVerificationCode: "",
  })

  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
  })

  // 공통 상태
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // 회원가입 관련 상태
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [userIdChecked, setUserIdChecked] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const navigate = useNavigate()

  // Daum 우편번호 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // 이메일 인증 타이머
  useEffect(() => {
    if (codeSent && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [codeSent, timeLeft])

  // 에러 상태 변경 감지
  useEffect(() => {
    if (error) {
      console.log("Error state changed:", error)
    }
  }, [error])

  // 모드 전환 함수
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setCurrentStep(1)
    // 상태 초기화
    setEmailVerified(false)
    setUserIdChecked(false)
    setCodeSent(false)
    setVerificationCode("")
  }

  // 로그인 핸들러
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!loginData.userId || !loginData.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await authService.login(loginData)
      navigate("/dashboard")
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.status === 401) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.")
      } else if (error.response?.status >= 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      } else {
        setError("로그인 중 오류가 발생했습니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  // 회원가입 핸들러
  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    // 전화번호 자동 하이픈 추가
    if (name === "phone") {
      const numbers = value.replace(/[^0-9]/g, "")
      if (numbers.length <= 3) {
        formattedValue = numbers
      } else if (numbers.length <= 7) {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else if (numbers.length <= 11) {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
      } else {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
      }
    }

    setRegisterData({
      ...registerData,
      [name]: formattedValue,
    })

    if (name === "userId") {
      setUserIdChecked(false)
    }
    if (name === "password") {
      checkPasswordStrength(formattedValue)
    }
  }

  const handleAgreementChange = (e) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked,
    })
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25
    setPasswordStrength(Math.min(strength, 100))
  }

  const searchAddress = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          setRegisterData({
            ...registerData,
            zipCode: data.zonecode,
            roadAddress: data.roadAddress,
          })
        },
      }).open()
    } else {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.")
    }
  }

  const checkUserId = async () => {
    if (!registerData.userId) {
      setError("사용자 ID를 입력해주세요.")
      return false
    }

    // 아이디 형식 검증
    const userIdRegex = /^[a-zA-Z0-9]{4,12}$/
    if (!userIdRegex.test(registerData.userId)) {
      setError("아이디는 영문, 숫자를 조합하여 4~12자로 입력해주세요.")
      return false
    }

    setLoading(true)
    setError("") // 에러 초기화

    try {
      const result = await userService.checkUserId(registerData.userId)
      if (result.exists) {
        const errorMessage = "이미 존재하는 사용자 ID입니다. 다른 아이디를 사용해주세요."
        console.log("Setting error message:", errorMessage)
        setError(errorMessage)
        setUserIdChecked(false)
        return false
      } else {
        setError("")
        setUserIdChecked(true)
        console.log("아이디 사용 가능")
        return true
      }
    } catch (error) {
      console.error("User ID check error:", error)

      let errorMessage = ""
      if (error.response?.status >= 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      } else {
        errorMessage = "중복 확인 중 오류가 발생했습니다. 다시 시도해주세요."
      }

      console.log("Setting error message:", errorMessage)
      setError(errorMessage)
      setUserIdChecked(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  const sendVerificationCode = async () => {
    if (!registerData.email) {
      setError("이메일을 입력해주세요.")
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return
    }

    setSendingCode(true)
    setError("") // 에러 초기화

    try {
      await userService.sendEmailVerification(registerData.email)
      setCodeSent(true)
      setTimeLeft(300)
      console.log("이메일 인증 코드 발송 성공")
    } catch (error) {
      console.error("Email verification error:", error)

      let errorMessage = ""
      if (error.response?.status === 409) {
        errorMessage = "이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status >= 500) {
        errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      } else {
        errorMessage = "인증코드 발송에 실패했습니다. 다시 시도해주세요."
      }

      console.log("Setting error message:", errorMessage)
      setError(errorMessage)
    } finally {
      setSendingCode(false)
    }
  }

  const verifyEmailCode = async () => {
    if (!verificationCode) {
      setError("인증코드를 입력해주세요.")
      return
    }
    setVerifying(true)
    setError("")
    try {
      await userService.verifyEmailCode(registerData.email, verificationCode)
      setEmailVerified(true)
      setRegisterData({
        ...registerData,
        emailVerificationCode: verificationCode,
      })
    } catch (error) {
      setError(error.response?.data?.message || "인증코드가 올바르지 않습니다.")
    }
    setVerifying(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const validateStep2 = () => {
    // 아이디 검증
    const userIdRegex = /^[a-zA-Z0-9]{4,12}$/
    if (!userIdRegex.test(registerData.userId)) {
      setError("아이디는 영문, 숫자를 조합하여 4~12자로 입력해주세요.")
      return false
    }

    // 비밀번호 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,16}$/
    if (!passwordRegex.test(registerData.password)) {
      setError("비밀번호는 영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.")
      return false
    }

    // 비밀번호 확인
    if (registerData.password !== registerData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return false
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.")
      return false
    }

    return true
  }

  const validateStep3 = () => {
    // 기본 필드 체크
    if (!registerData.name) {
      setError("이름을 입력해주세요.")
      return false
    }

    if (!registerData.phone) {
      setError("전화번호를 입력해주세요.")
      return false
    }

    if (!registerData.birthDate) {
      setError("생년월일을 선택해주세요.")
      return false
    }

    if (!registerData.zipCode || !registerData.roadAddress) {
      setError("주소를 입력해주세요.")
      return false
    }

    // 이름 검증
    const nameRegex = /^[가-힣]{2,4}$/
    if (!nameRegex.test(registerData.name)) {
      setError("이름은 한글 2~4자로 입력해주세요.")
      return false
    }

    // 전화번호 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(registerData.phone)) {
      setError("전화번호는 010-0000-0000 형식으로 입력해주세요.")
      return false
    }

    return true
  }

  const nextStep = async () => {
    console.log("nextStep called, currentStep:", currentStep)

    if (currentStep === 1) {
      // 약관 동의 확인
      if (!agreements.termsOfService || !agreements.privacyPolicy) {
        setError("필수 약관에 동의해주세요.")
        return
      }
    } else if (currentStep === 2) {
      console.log("2단계 검증 시작")

      // 기본 필드 검증
      if (!registerData.userId.trim()) {
        setError("아이디를 입력해주세요.")
        console.log("아이디 미입력")
        return
      }

      if (!registerData.password.trim()) {
        setError("비밀번호를 입력해주세요.")
        console.log("비밀번호 미입력")
        return
      }

      if (!registerData.confirmPassword.trim()) {
        setError("비밀번호 확인을 입력해주세요.")
        console.log("비밀번호 확인 미입력")
        return
      }

      if (!registerData.email.trim()) {
        setError("이메일을 입력해주세요.")
        console.log("이메일 미입력")
        return
      }

      // 형식 검증
      if (!validateStep2()) {
        console.log("2단계 형식 검증 실패")
        return
      }

      // 아이디 중복 확인
      console.log("아이디 중복 확인 시작")
      const isUserIdValid = await checkUserId()
      if (!isUserIdValid) {
        console.log("아이디 중복 확인 실패")
        return
      }

      // 이메일 인증 확인
      if (!emailVerified) {
        setError("이메일 인증을 완료해주세요.")
        console.log("이메일 인증 미완료")
        return
      }

      console.log("2단계 검증 완료")
    } else if (currentStep === 3) {
      // 3단계: 개인정보 입력 확인
      if (!validateStep3()) return
    }

    setError("")
    setCurrentStep(currentStep + 1)
    console.log("다음 단계로 이동:", currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError("")
  }

  const handleRegisterSubmit = async () => {
    setLoading(true)
    try {
      await userService.register(registerData)
      setCurrentStep(5)
    } catch (error) {
      setError(error.response?.data?.message || "회원가입에 실패했습니다.")
    }
    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // 회원가입 완료 단계
  if (!isLogin && currentStep === 5) {
    return (
      <>
        <Header />
        <div className="auth-page">
          <div className="completion-page">
            <div className="completion-container">
              <div className="completion-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>회원가입이 완료되었습니다!</h3>
              <p>소음일기에 오신 것을 환영합니다.</p>
              <button onClick={() => setIsLogin(true)} className="btn btn-primary">
                로그인
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-container">
          <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>
            {/* 브랜딩 섹션 */}
            <div className="brand-section">
              <div className="brand-content">
                <div className="auth-logo">
                  <div className="logo-icon">
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                      <circle cx="12" cy="12" r="3" fill="white" />
                    </svg>
                  </div>
                  <div className="brand-text">
                    <span className="brand-name">소음일기</span>
                    <span className="brand-tagline">Noise Diary</span>
                  </div>
                </div>

                <div className="welcome-content">
                  <h2>{isLogin ? "다시 만나서 반가워요!" : "새로운 시작을 환영합니다!"}</h2>
                  <p>
                    소음일기와 함께 특별한 순간들을 기록하고
                    <br />더 풍부한 일상을 만들어보세요.
                  </p>

                  <div className="features">
                    <div className="feature-item">
                      <i className="fas fa-book"></i>
                      <span>개인 일기 작성</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-share-alt"></i>
                      <span>순간 공유</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-heart"></i>
                      <span>추억 보관</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 폼 섹션 */}
            <div className="form-section">
              {isLogin ? (
                // 로그인 폼
                <div className="login-form-container">
                  <div className="form-header">
                    <h3>로그인</h3>
                    <p>계정에 로그인하여 서비스를 이용하세요</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="userId">
                        <i className="fas fa-user"></i>
                        아이디
                      </label>
                      <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={loginData.userId}
                        onChange={handleLoginChange}
                        placeholder="아이디를 입력하세요"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">
                        <i className="fas fa-lock"></i>
                        비밀번호
                      </label>
                      <div className="password-input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="비밀번호를 입력하세요"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                          disabled={loading}
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="login-options">
                      <div className="remember-me">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">
                          <span className="checkmark"></span>
                          로그인 상태 유지
                        </label>
                      </div>
                      <button type="button" className="forgot-password">
                        비밀번호 찾기
                      </button>
                    </div>

                    {error && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{error}</span>
                      </div>
                    )}

                    <button type="submit" className="auth-button" disabled={loading}>
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          <span>로그인 중...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt"></i>
                          <span>로그인</span>
                        </>
                      )}
                    </button>

                    <div className="divider">
                      <span>또는</span>
                    </div>

                    <div className="social-login">
                      <button type="button" className="social-button google">
                        <i className="fab fa-google"></i>
                        <span>Google</span>
                      </button>
                      <button type="button" className="social-button kakao">
                        <i className="fas fa-comment"></i>
                        <span>카카오</span>
                      </button>
                    </div>

                    <div className="switch-mode">
                      <p>
                        아직 계정이 없으신가요?{" "}
                        <button type="button" onClick={toggleMode} className="switch-button">
                          회원가입
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                // 회원가입 폼
                <div className="register-form-container">
                  <div className="form-header">
                    <h3>회원가입</h3>
                    <p>새로운 계정을 만들어 서비스를 시작하세요</p>
                    {/* <p style={{ fontSize: "12px", color: "#666" }}>현재 단계: {currentStep}</p> */}
                  </div>

                  {/* 단계 표시기 임시 주석 처리 */}
                  {/* <div className="step-indicator">
                    <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
                    <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
                    <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
                    <div className={`step ${currentStep >= 4 ? "active" : ""}`}>4</div>
                  </div> */}

                  {/* 단계 1: 약관 동의 */}
                  {currentStep === 1 && (
                    <div className="form-step" style={{ display: "block" }}>
                      <h4 style={{ marginBottom: "1rem" }}>약관 동의</h4>
                      <div className="terms-container">
                        <div className="terms-item">
                          <div className="terms-header">
                            <h4>이용약관 동의</h4>
                            <span className="required">*</span>
                          </div>
                          <div className="terms-content">
                            제1조 (목적) 본 약관은 서비스 이용에 관한 기본적인 사항을 규정합니다...
                          </div>
                          <div className="terms-checkbox">
                            <input
                              type="checkbox"
                              id="termsAgree"
                              name="termsOfService"
                              checked={agreements.termsOfService}
                              onChange={handleAgreementChange}
                            />
                            <label htmlFor="termsAgree">
                              <span className="checkmark"></span>
                              이용약관에 동의합니다 (필수)
                            </label>
                          </div>
                        </div>

                        <div className="terms-item">
                          <div className="terms-header">
                            <h4>개인정보 수집 및 이용 동의</h4>
                            <span className="required">*</span>
                          </div>
                          <div className="terms-content">
                            개인정보 수집 항목: 아이디, 비밀번호, 이름, 이메일, 전화번호...
                          </div>
                          <div className="terms-checkbox">
                            <input
                              type="checkbox"
                              id="privacyAgree"
                              name="privacyPolicy"
                              checked={agreements.privacyPolicy}
                              onChange={handleAgreementChange}
                            />
                            <label htmlFor="privacyAgree">
                              <span className="checkmark"></span>
                              개인정보 수집 및 이용에 동의합니다 (필수)
                            </label>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="error-message">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="button-group">
                        <button type="button" className="btn-secondary" onClick={toggleMode}>
                          로그인으로
                        </button>
                        <button type="button" className="btn-primary" onClick={nextStep}>
                          다음 단계
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 단계 2: 아이디, 비밀번호, 이메일 인증 */}
                  {currentStep === 2 && (
                    <div className="form-step" style={{ display: "block" }}>
                      <h4 style={{ marginBottom: "1rem" }}>계정 정보 및 이메일 인증</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <i className="fas fa-user"></i>
                            아이디 <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="userId"
                            value={registerData.userId}
                            onChange={handleRegisterChange}
                            placeholder="영문, 숫자 4~12자"
                          />
                          {/* {userIdChecked && (
                            <div className="success-message">
                              <i className="fas fa-check-circle"></i>
                              사용 가능한 아이디입니다.
                            </div>
                          )} */}
                        </div>
                        <div className="form-group">
                          <label>
                            <i className="fas fa-lock"></i>
                            비밀번호 <span className="required">*</span>
                          </label>
                          <div className="password-input-container">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              placeholder="영문, 숫자, 특수문자 포함"
                            />
                            <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                          </div>
                          <div className="password-strength">
                            <div
                              className="strength-bar"
                              style={{
                                width: `${passwordStrength}%`,
                                backgroundColor:
                                  passwordStrength < 50 ? "#ef4444" : passwordStrength < 80 ? "#f59e0b" : "#22c55e",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          <i className="fas fa-lock"></i>
                          비밀번호 확인 <span className="required">*</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="비밀번호 재입력"
                        />
                        {registerData.confirmPassword && registerData.password !== registerData.confirmPassword && (
                          <div className="error-text">비밀번호가 일치하지 않습니다.</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>
                          <i className="fas fa-envelope"></i>
                          이메일 <span className="required">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            placeholder="example@email.com"
                            disabled={emailVerified}
                          />
                          <button
                            type="button"
                            className="verify-btn"
                            onClick={sendVerificationCode}
                            disabled={sendingCode || emailVerified || !registerData.email}
                          >
                            {sendingCode ? "발송중..." : emailVerified ? "인증완료" : "인증발송"}
                          </button>
                        </div>
                      </div>

                      {codeSent && !emailVerified && (
                        <div className="form-group">
                          <label>인증번호</label>
                          <div className="input-group">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.slice(0, 8))}
                              placeholder="인증번호 입력"
                              maxLength="8"
                            />
                            <button type="button" className="verify-btn" onClick={verifyEmailCode} disabled={verifying}>
                              {verifying ? "확인중..." : "인증확인"}
                            </button>
                          </div>
                          {timeLeft > 0 && <div className="timer">남은 시간: {formatTime(timeLeft)}</div>}
                        </div>
                      )}

                      {emailVerified && (
                        <div className="success-message">
                          <i className="fas fa-check-circle"></i>
                          이메일 인증이 완료되었습니다.
                        </div>
                      )}

                      {error && (
                        <div className="error-message" style={{ display: "block", marginTop: "1rem" }}>
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="button-group">
                        <button type="button" className="btn-secondary" onClick={prevStep}>
                          이전 단계
                        </button>
                        <button type="button" className="btn-primary" onClick={nextStep} disabled={loading}>
                          {loading ? "확인중..." : "다음 단계"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 단계 3: 개인정보 입력 */}
                  {currentStep === 3 && (
                    <div className="form-step" style={{ display: "block" }}>
                      <h4 style={{ marginBottom: "1rem" }}>개인정보 입력</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            <i className="fas fa-id-card"></i>
                            이름 <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            placeholder="한글 2~4자"
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <i className="fas fa-phone"></i>
                            전화번호 <span className="required">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={registerData.phone}
                            onChange={handleRegisterChange}
                            placeholder="010-0000-0000"
                            maxLength="13"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          <i className="fas fa-calendar"></i>
                          생년월일 <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={registerData.birthDate}
                          onChange={handleRegisterChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <i className="fas fa-map-marker-alt"></i>
                          주소 <span className="required">*</span>
                        </label>
                        <div className="address-group">
                          <input
                            type="text"
                            name="zipCode"
                            value={registerData.zipCode}
                            placeholder="우편번호"
                            readOnly
                          />
                          <div className="input-group">
                            <input
                              type="text"
                              name="roadAddress"
                              value={registerData.roadAddress}
                              placeholder="도로명 주소"
                              readOnly
                            />
                            <button type="button" className="address-btn" onClick={searchAddress}>
                              주소검색
                            </button>
                          </div>
                          <input
                            type="text"
                            name="detailAddress"
                            value={registerData.detailAddress}
                            onChange={handleRegisterChange}
                            placeholder="상세 주소 (선택)"
                          />
                        </div>
                      </div>
{/* 
                      {error && (
                        <div className="error-message">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{error}</span>
                        </div>
                      )} */}
                      {error && (
                        <div className="error-message" style={{ display: "block", marginTop: "1rem" }}>
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{error}</span>
                        </div>
                      )}
                      <div className="button-group">
                        <button type="button" className="btn-secondary" onClick={prevStep}>
                          이전 단계
                        </button>
                        <button type="button" className="btn-primary" onClick={nextStep}>
                          다음 단계
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 단계 4: 정보 확인 */}
                  {currentStep === 4 && (
                    <div className="form-step" style={{ display: "block" }}>
                      <h4 style={{ marginBottom: "1rem" }}>정보 확인</h4>
                      <div className="info-summary">
                        {/* <h4>입력 정보 확인</h4> */}
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="label">아이디:</span>
                            <span className="value">{registerData.userId}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">이름:</span>
                            <span className="value">{registerData.name}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">이메일:</span>
                            <span className="value">{registerData.email}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">전화번호:</span>
                            <span className="value">{registerData.phone}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">생년월일:</span>
                            <span className="value">{registerData.birthDate}</span>
                          </div>
                          <div className="info-item">
                            <span className="label">주소:</span>
                            <span className="value">
                              ({registerData.zipCode}) {registerData.roadAddress} {registerData.detailAddress}
                            </span>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="error-message">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="button-group">
                        <button type="button" className="btn-secondary" onClick={prevStep}>
                          이전 단계
                        </button>
                        <button type="button" className="btn-primary" onClick={handleRegisterSubmit} disabled={loading}>
                          {loading ? "가입중..." : "회원가입"}
                        </button>
                      </div>
                    </div>
                  )}
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

export default AuthForm
