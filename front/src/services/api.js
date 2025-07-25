import axios from "axios"

// API 기본 설정 (쿠키 방식)
const api = axios.create({
  baseURL: "http://localhost:8485/api",
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송을 위해 필요
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터 (쿠키 방식에서는 토큰을 수동으로 추가할 필요 없음)
api.interceptors.request.use(
  (config) => {
    // 공개 엔드포인트 확인
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/test",
      "/users/register",
      "/users/check-userid",
      "/users/check-email",
      "/email/send-verification",
      "/email/verify-code",
    ]

    const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint))

    console.log("📤 API Request:", {
      url: config.url,
      method: config.method?.toUpperCase(),
      withCredentials: config.withCredentials,
      isPublic: isPublicEndpoint,
    })

    return config
  },
  (error) => {
    console.error("❌ Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log("📥 API Response:", {
      url: response.config.url,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
    })
    return response
  },
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    })

    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      console.log("🔒 Authentication failed - clearing user data")
      localStorage.removeItem("user")

      if (window.location.pathname !== "/login" && window.location.pathname !== "/auth") {
        console.log("🔄 Redirecting to login page")
        window.location.href = "/auth"
      }
    }

    return Promise.reject(error)
  },
)

export default api