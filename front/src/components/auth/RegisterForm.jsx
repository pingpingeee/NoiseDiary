"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import Header from "./components/layout/Header"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import { userService } from "../../services/userService"
import "./RegisterForm.css"
import "../../styles/index.css"

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
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

  // 이메일 인증 관련 상태
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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

const handleChange = (e) => {
  const { name, value } = e.target
  
  let formattedValue = value
  
  // 전화번호 자동 하이픈 추가
  if (name === "phone") {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '')
    
    // 010-0000-0000 형식으로 포맷팅
    if (numbers.length <= 3) {
      formattedValue = numbers
    } else if (numbers.length <= 7) {
      formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 11) {
      formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    } else {
      // 11자리 초과 시 자르기
      formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }
  
  setFormData({
    ...formData,
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
          setFormData({
            ...formData,
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
    if (!formData.userId) {
      setError("사용자 ID를 입력해주세요.")
      // 아이디 인풋란에 포커스
      const userIdInput = document.querySelector('input[name="userId"]')
      if (userIdInput) userIdInput.focus()
      return false
    }

    setLoading(true)
    setError("")

    try {
      const result = await userService.checkUserId(formData.userId)
      if (result.exists) {
        setError("이미 존재하는 사용자 ID입니다.")
        setUserIdChecked(false)
        // 아이디 인풋란에 포커스
        const userIdInput = document.querySelector('input[name="userId"]')
        if (userIdInput) userIdInput.focus()
        return false
      } else {
        setError("")
        setUserIdChecked(true)
        return true
      }
    } catch (error) {
      setError("중복 확인 중 오류가 발생했습니다.")
      setUserIdChecked(false)
      // 아이디 인풋란에 포커스
      const userIdInput = document.querySelector('input[name="userId"]')
      if (userIdInput) userIdInput.focus()
      return false
    } finally {
      setLoading(false)
    }
  }

  const sendVerificationCode = async () => {
    setSendingCode(true)
    setError("")
    try {
      await userService.sendEmailVerification(formData.email)
      setCodeSent(true)
      setTimeLeft(300)
    } catch (error) {
      setError(error.response?.data?.message || "인증코드 발송에 실패했습니다.")
    }
    setSendingCode(false)
  }

  const verifyEmailCode = async () => {
    if (!verificationCode) {
      setError("인증코드를 입력해주세요.")
      return
    }
    setVerifying(true)
    setError("")
    try {
      await userService.verifyEmailCode(formData.email, verificationCode)
      setEmailVerified(true)
      setFormData({
        ...formData,
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


  // 유효성 검사 함수들
const validateForm = () => {
  // 아이디 검증 (영문, 숫자 4~12자)
  const userIdRegex = /^[a-zA-Z0-9]{4,12}$/
  if (!userIdRegex.test(formData.userId)) {
    setError("아이디는 영문, 숫자를 조합하여 4~12자로 입력해주세요.")
    document.querySelector('input[name="userId"]')?.focus()
    return false
  }
  
  // 이름 검증 (한글 2~4자)
  const nameRegex = /^[가-힣]{2,4}$/
  if (!nameRegex.test(formData.name)) {
    setError("이름은 한글 2~4자로 입력해주세요.")
    document.querySelector('input[name="name"]')?.focus()
    return false
  }
  
  // 비밀번호 검증 (영문, 숫자, 특수문자 포함 8~16자)
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,16}$/
  if (!passwordRegex.test(formData.password)) {
    setError("비밀번호는 영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.")
    document.querySelector('input[name="password"]')?.focus()
    return false
  }
  
  // 전화번호 검증 (010-0000-0000 형식)
  const phoneRegex = /^010-\d{4}-\d{4}$/
  if (!phoneRegex.test(formData.phone)) {
    setError("전화번호는 010-0000-0000 형식으로 입력해주세요.")
    document.querySelector('input[name="phone"]')?.focus()
    return false
  }
  
  return true
}


const nextStep = async () => {
  if (currentStep === 1) {
    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      setError("필수 약관에 동의해주세요.")
      return
    }
  } else if (currentStep === 2) {
    if (!emailVerified) {
      setError("이메일 인증을 완료해주세요.")
      return
    }
  } else if (currentStep === 3) {
    // 필수 입력 필드 검증
    if (!formData.userId.trim()) {
      setError("아이디를 입력해주세요.")
      document.querySelector('input[name="userId"]')?.focus()
      return
    }
    
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.")
      document.querySelector('input[name="name"]')?.focus()
      return
    }
    
    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.")
      document.querySelector('input[name="password"]')?.focus()
      return
    }
    
    if (!formData.confirmPassword.trim()) {
      setError("비밀번호 확인을 입력해주세요.")
      document.querySelector('input[name="confirmPassword"]')?.focus()
      return
    }
    
    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요.")
      document.querySelector('input[name="phone"]')?.focus()
      return
    }
    
    if (!formData.birthDate.trim()) {
      setError("생년월일을 선택해주세요.")
      document.querySelector('input[name="birthDate"]')?.focus()
      return
    }
    
    if (!formData.zipCode.trim() || !formData.roadAddress.trim()) {
      setError("주소를 입력해주세요.")
      return
    }

    // 유효성 검사 실행 (여기에 추가!)
    if (!validateForm()) {
      return // 유효성 검사 실패 시 다음 단계로 진행하지 않음
    }

    // 자동 중복확인 실행
    const isUserIdValid = await checkUserId()
    if (!isUserIdValid) {
      return // 중복확인 실패 시 다음 단계로 진행하지 않음
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      document.querySelector('input[name="confirmPassword"]')?.focus()
      return
    }
  }
  setError("")
  setCurrentStep(currentStep + 1)
}

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError("")
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await userService.register(formData)
      setCurrentStep(5)
    } catch (error) {
      setError(error.response?.data?.message || "회원가입에 실패했습니다.")
    }
    setLoading(false)
  }

  const togglePasswordVisibility = (inputId) => {
    const input = document.getElementById(inputId)
    const icon = document.querySelector(`#${inputId} + .toggle-password`)
    if (input.type === "password") {
      input.type = "text"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
    } else {
      input.type = "password"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
    }
  }

  // 완료 단계
  if (currentStep === 5) {
    return (
      <>
        <Header />
        <div className="register-page">
          <div className="container">
            <div className="completion-container">
              <div className="completion-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>회원가입이 완료되었습니다!</h3>
              <p>소음일기에 오신 것을 환영합니다.</p>
              <div className="button-group">
                <button onClick={() => navigate("/login")} className="btn btn-primary">
                  로그인하러 가기
                </button>
              </div>
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
      <div className="register-page">
        <div className="container">
          <h2>소음일기 회원가입</h2>
          {/* <div className="form-intro">
            <p>
              소음일기 이용을 위한 회원가입 페이지입니다.
              <br />
              아래 정보를 입력하여 회원가입을 완료해주세요.
            </p>
          </div> */}

          <form id="joinForm">
            {/* 단계 1: 이용약관 동의 */}
            {currentStep === 1 && (
              <div className="form-step active">
                <div className="terms-container">
                  <div className="terms-title">
                    이용약관 동의 <span className="required-mark">*</span>
                  </div>
                  <div className="terms-scroll">
                    제1조 (목적)
                    <br />
                    목적적자
                    <br />
                    <br />
                    제2조 (정의)
                    <br />
                    정의적자
                    <br />
                  </div>
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="termsAgree"
                      name="termsOfService"
                      checked={agreements.termsOfService}
                      onChange={handleAgreementChange}
                      required
                    />
                    <label htmlFor="termsAgree">이용약관에 동의합니다. (필수)</label>
                  </div>
                </div>

                <div className="terms-container">
                  <div className="terms-title">
                    개인정보 수집 및 이용 동의 <span className="required-mark">*</span>
                  </div>
                  <div className="terms-scroll">
                    1. 수집하는 개인정보 항목
                    <br />- 필수항목: 아이디, 비밀번호, 이름, 이메일, 전화번호, 생년월일, 주소
                    <br />- 선택항목: 상세 주소
                    <br />
                    <br />
                    2. 개인정보의 수집 및 이용목적
                    <br />- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지와 비인가
                    사용 방지, 가입의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달
                    <br />- 서비스 제공: 아파트 시세 정보 제공, 관심 아파트 관리 등
                    <br />
                    <br />
                    3. 개인정보의 보유 및 이용기간
                    <br />- 회원 탈퇴 시까지 (단, 관계법령에 따라 필요한 경우 일정기간 보존할 수 있음)
                    <br />
                    <br />
                    4. 동의 거부권 및 거부 시 불이익
                    <br />- 귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우
                    회원가입이 제한됩니다.
                    <br />
                  </div>
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="privacyAgree"
                      name="privacyPolicy"
                      checked={agreements.privacyPolicy}
                      onChange={handleAgreementChange}
                      required
                    />
                    <label htmlFor="privacyAgree">개인정보 수집 및 이용에 동의합니다. (필수)</label>
                  </div>
                </div>

                {error && <div className="error-message show">{error}</div>}

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate("/login")}>
                    뒤로가기
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    다음 단계
                  </button>
                </div>
              </div>
            )}

            {/* 단계 2: 이메일 인증 */}
            {currentStep === 2 && (
              <div className="form-step active">
                <div className="form-group full-width">
                  <label>
                    이메일 <span className="required-mark">*</span>
                  </label>
                  <div className="email-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      disabled={emailVerified}
                    />
                    <button
                      type="button"
                      className="verify-button"
                      onClick={sendVerificationCode}
                      disabled={sendingCode || emailVerified}
                    >
                      {sendingCode ? "발송 중..." : emailVerified ? "인증완료" : "인증번호 발송"}
                    </button>
                  </div>
                  <span className="input-hint">이메일 주소를 입력해주세요.</span>
                  {codeSent && !emailVerified && (
                    <div className="email-group" style={{ marginTop: "10px" }}>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8))}
                        placeholder="인증번호 입력"
                        maxLength="8"
                        disabled={verifying || timeLeft === 0}
                      />
                      <button
                        type="button"
                        className="verify-button"
                        onClick={verifyEmailCode}
                        disabled={!verificationCode || verifying || timeLeft === 0}
                      >
                        {verifying ? "인증 중..." : "인증 확인"}
                      </button>
                    </div>
                  )}
                  {codeSent && timeLeft > 0 && !emailVerified && (
                    <div style={{ marginTop: "5px", fontSize: "12px", color: "#f59e0b" }}>
                      남은 시간: {formatTime(timeLeft)}
                    </div>
                  )}
                  {timeLeft === 0 && !emailVerified && (
                    <div style={{ marginTop: "5px", fontSize: "12px", color: "#ef4444" }}>
                      인증 시간이 만료되었습니다. 다시 발송해주세요.
                    </div>
                  )}
                  {emailVerified && (
                    <div style={{ marginTop: "5px", fontSize: "12px", color: "#22c55e" }}>
                      ✓ 이메일 인증이 완료되었습니다.
                    </div>
                  )}
                </div>

                {error && <div className="error-message show">{error}</div>}

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    이전 단계
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    다음 단계
                  </button>
                </div>
              </div>
            )}

            {/* 단계 3: 정보 입력 */}
            {currentStep === 3 && (
              <div className="form-step active">
                {/* 아이디와 이름 반반 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      아이디 <span className="required-mark">*</span>
                    </label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      required
                      placeholder="영문, 숫자로 4~12자 입력"
                    />
                    <span className="input-hint">영문, 숫자를 조합하여 4~12자로 입력해주세요.</span>
                    {userIdChecked && (
                      <span style={{ fontSize: "12px", color: "#22c55e", marginTop: "5px", display: "block" }}>
                        {/* ✓ 사용 가능한 ID입니다. */}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>
                      이름 <span className="required-mark">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="한글 2~4자 입력"
                    />
                    <span className="input-hint">한글 2~4자로 입력해주세요.</span>
                  </div>
                </div>

                {/* 비밀번호와 비밀번호 확인 반반 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      비밀번호 <span className="required-mark">*</span>
                    </label>
                    <div className="password-input-container">
                      <input
                        type="password"
                        name="password"
                        id="userPw"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="영문, 숫자, 특수문자 포함 8~16자"
                      />
                      <i
                        className="toggle-password fas fa-eye-slash"
                        onClick={() => togglePasswordVisibility("userPw")}
                      ></i>
                    </div>
                    <div className="password-strength">
                      <div
                        className="password-strength-bar"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor:
                            passwordStrength < 50 ? "#ef4444" : passwordStrength < 80 ? "#f59e0b" : "#22c55e",
                        }}
                      ></div>
                    </div>
                    <span className="input-hint">영문, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.</span>
                  </div>
                  <div className="form-group">
                    <label>
                      비밀번호 확인 <span className="required-mark">*</span>
                    </label>
                    <div className="password-input-container">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="pwdConfirm"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="비밀번호를 다시 입력"
                      />
                      <i
                        className="toggle-password fas fa-eye-slash"
                        onClick={() => togglePasswordVisibility("pwdConfirm")}
                      ></i>
                    </div>
                    <span className="input-hint">비밀번호를 한번 더 입력해주세요.</span>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", display: "block" }}>
                        비밀번호가 일치하지 않습니다.
                      </span>
                    )}
                  </div>
                </div>

                {/* 전화번호와 생년월일 반반 */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      전화번호 <span className="required-mark">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="010-0000-0000"
                      maxLength="13"
                    />
                    <span className="input-hint">010-0000-0000 형식으로 입력해주세요.</span>
                  </div>
                  <div className="form-group">
                    <label>
                      생년월일 <span className="required-mark">*</span>
                    </label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                    <span className="input-hint">생년월일을 선택해주세요.</span>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>
                    주소 <span className="required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    placeholder="우편번호 입력"
                    readOnly
                  />
                  <span className="input-hint">우편번호를 입력해주세요.</span>
                  <div className="address-search">
                    <input
                      type="text"
                      name="roadAddress"
                      value={formData.roadAddress}
                      onChange={handleChange}
                      required
                      placeholder="도로명 또는 지번 주소 입력"
                      readOnly
                    />
                    <button type="button" onClick={searchAddress}>
                      주소 검색
                    </button>
                  </div>
                  <span className="input-hint">도로명 또는 지번 주소를 입력해주세요.</span>
                </div>

                <div className="form-group full-width">
                  <label>상세 주소</label>
                  <input
                    type="text"
                    name="detailAddress"
                    value={formData.detailAddress}
                    placeholder="상세 주소 입력 (선택사항)"
                  />
                  <span className="input-hint">아파트/호수 등 상세 주소를 입력해주세요.</span>
                </div>

                {error && <div className="error-message show">{error}</div>}

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    이전 단계
                  </button>
                  <button type="button" className="btn btn-primary" onClick={nextStep} disabled={loading}>
                    {loading ? "확인 중..." : "다음 단계"}
                  </button>
                </div>
              </div>
            )}

            {/* 단계 4: 가입 완료 */}
            {currentStep === 4 && (
              <div className="form-step active">
                <div className="completion-container">
                  <div className="completion-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>회원가입 정보 확인</h3>
                  <p>입력하신 정보를 확인하시고 가입 버튼을 클릭하세요.</p>
                  <div className="user-info-summary">
                    <div className="info-row">
                      <div className="info-label">아이디</div>
                      <div className="info-value">{formData.userId}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">이름</div>
                      <div className="info-value">{formData.name}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">이메일</div>
                      <div className="info-value">{formData.email}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">전화번호</div>
                      <div className="info-value">{formData.phone}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">주소</div>
                      <div className="info-value">
                        ({formData.zipCode}) {formData.roadAddress} {formData.detailAddress}
                      </div>
                    </div>
                  </div>
                </div>

                {error && <div className="error-message show">{error}</div>}

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    이전 단계
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "가입 중..." : "회원가입"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default RegisterPage
