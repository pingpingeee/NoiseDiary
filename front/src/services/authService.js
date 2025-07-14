import api from "./api"

export const authService = {
  // 로그인 (쿠키 방식)
  login: async (credentials) => {
    try {
      console.log("🔐 Login attempt:", { userId: credentials.userId })

      const response = await api.post("/auth/login", {
        userId: credentials.userId,
        password: credentials.password,
      })

      console.log("✅ Login response received:", {
        status: response.status,
        hasUser: !!response.data.user,
        message: response.data.message,
      })

      // 쿠키 방식에서는 서버가 자동으로 쿠키를 설정
      // 응답 본문에서는 사용자 정보만 확인
      if (response.data.user) {
        // 사용자 정보만 localStorage에 저장 (선택사항)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log("💾 User info saved to localStorage")

        // 쿠키에서 토큰 확인
        const tokenFromCookie = authService.getTokenFromCookie()
        console.log("🍪 Token in cookie:", !!tokenFromCookie)

        return {
          success: true,
          user: response.data.user,
          message: response.data.message || "로그인 성공",
          tokenInCookie: !!tokenFromCookie,
        }
      } else {
        console.error("❌ No user data in response:", response.data)
        throw new Error(response.data.message || "사용자 정보가 없습니다.")
      }
    } catch (error) {
      console.error("❌ Login error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      throw error
    }
  },

  // 쿠키에서 토큰 가져오기
  getTokenFromCookie: () => {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "accessToken") {
        return value
      }
    }
    return null
  },

  // 쿠키에서 토큰 타입 가져오기
  getTokenTypeFromCookie: () => {
    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "tokenType") {
        return value
      }
    }
    return "Bearer"
  },

  // 토큰 검증 (쿠키 방식)
  validateToken: async () => {
    try {
      console.log("🔍 Validating token from cookie...")
      const response = await api.post("/auth/validate-token")

      console.log("✅ Token validation response:", response.data)
      return response.data.valid || false
    } catch (error) {
      console.error("❌ Token validation error:", error)
      return false
    }
  },

  // 로그아웃 (쿠키 방식)
  logout: async () => {
    try {
      console.log("🚪 Logging out...")
      await api.post("/auth/logout")

      // localStorage의 사용자 정보만 삭제 (쿠키는 서버에서 삭제)
      localStorage.removeItem("user")
      console.log("🧹 User info cleared from localStorage")
      console.log("🍪 Cookies cleared by server")
    } catch (error) {
      console.error("❌ Logout error:", error)
      // 에러가 발생해도 로컬 정보는 삭제
      localStorage.removeItem("user")
    }
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("❌ Error parsing user data:", error)
      return null
    }
  },

  // 인증 상태 확인 (쿠키 방식)
  isAuthenticated: () => {
    const tokenFromCookie = authService.getTokenFromCookie()
    const user = authService.getCurrentUser()
    const isAuth = !!(tokenFromCookie && user)
    console.log("🔐 Authentication check:", {
      hasTokenInCookie: !!tokenFromCookie,
      hasUser: !!user,
      isAuthenticated: isAuth,
    })
    return isAuth
  },

  // 디버깅용 - 현재 저장된 정보 출력
  debugInfo: () => {
    const tokenFromCookie = authService.getTokenFromCookie()
    const tokenType = authService.getTokenTypeFromCookie()
    console.log("🐛 Debug Info (Cookie Mode):", {
      tokenInCookie: tokenFromCookie ? tokenFromCookie.substring(0, 20) + "..." : null,
      tokenType: tokenType,
      user: authService.getCurrentUser(),
      isAuthenticated: authService.isAuthenticated(),
      allCookies: document.cookie,
    })
  },
}
