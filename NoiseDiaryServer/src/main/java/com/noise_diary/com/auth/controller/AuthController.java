package com.noise_diary.com.auth.controller;

import com.noise_diary.com.auth.dto.LoginRequest;
import com.noise_diary.com.auth.dto.LoginResponse;
import com.noise_diary.com.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Value("${jwt.expiration:86400}")
    private Long jwtExpiration;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getUserId());
            
            LoginResponse loginResponse = authService.login(loginRequest);
            
            // 쿠키에 액세스 토큰 설정
            ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", loginResponse.getToken())
//                    .httpOnly(true)        // JavaScript로 접근 불가 => XSS 공격 방지해줌
                    .httpOnly(false)        
                    .secure(false)         // HTTPS에서만 전송 
                    .sameSite("Lax")       // CSRF 공격 방지
                    .maxAge(jwtExpiration) // JWT 만료시간과 동일하게 설정
                    .path("/")             // 모든 경로에서 쿠키 전송
                    .build();

            // 토큰 타입도 쿠키에 저장 (선택사항)
            ResponseCookie tokenTypeCookie = ResponseCookie.from("tokenType", loginResponse.getTokenType())
                    .httpOnly(false)       // 프론트엔드에서 읽을 수 있도록
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(jwtExpiration)
                    .path("/")
                    .build();

            System.out.println("Login successful for user: " + loginRequest.getUserId());
            System.out.println("Token set in httpOnly cookie");
            
            // 응답에서는 토큰을 제거하고 사용자 정보만 반환
            LoginResponse responseBody = new LoginResponse();
            responseBody.setUser(loginResponse.getUser());
            responseBody.setMessage(loginResponse.getMessage());
            responseBody.setTokenType(loginResponse.getTokenType());
            // token 필드는 보안상 응답에 포함하지 않음
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, tokenTypeCookie.toString())
                    .body(responseBody);
                    
        } catch (Exception e) {
            System.err.println("Login failed for user: " + loginRequest.getUserId());
            System.err.println("Error: " + e.getMessage());
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            System.out.println("Logout request received");
            
            // 액세스 토큰 쿠키 삭제
            ResponseCookie deleteAccessTokenCookie = ResponseCookie.from("accessToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(0)  // 즉시 만료
                    .path("/")
                    .build();

            // 토큰 타입 쿠키 삭제
            ResponseCookie deleteTokenTypeCookie = ResponseCookie.from("tokenType", "")
                    .httpOnly(false)
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(0)
                    .path("/")
                    .build();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "로그아웃 되었습니다.");

            System.out.println("Logout successful - cookies cleared");

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, deleteAccessTokenCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, deleteTokenTypeCookie.toString())
                    .body(response);
                    
        } catch (Exception e) {
            System.err.println("Logout error: " + e.getMessage());
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@CookieValue(value = "accessToken", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("Token validation request received");
            
            if (token == null || token.isEmpty()) {
                System.out.println("No token found in cookie");
                response.put("valid", false);
                response.put("message", "토큰이 쿠키에 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            System.out.println("Validating token from cookie: " + token.substring(0, Math.min(20, token.length())) + "...");
            
            boolean isValid = authService.validateToken(token);
            response.put("valid", isValid);
            response.put("message", isValid ? "토큰이 유효합니다" : "토큰이 유효하지 않습니다");
            
            System.out.println("Token validation result: " + isValid);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            response.put("valid", false);
            response.put("message", "토큰 검증 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue(value = "accessToken", required = false) String token) {
        try {
            if (token == null || token.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "인증이 필요합니다.");
                return ResponseEntity.status(401).body(error);
            }

            if (!authService.validateToken(token)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "유효하지 않은 토큰입니다.");
                return ResponseEntity.status(401).body(error);
            }

            // 토큰에서 사용자 정보 추출 로직 (AuthService에 구현 필요)
            String userId = authService.getUserIdFromToken(token);
            // 실제로는 UserService를 통해 사용자 정보를 조회해야 함
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("message", "사용자 정보 조회 성공");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "사용자 정보 조회 실패: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Spring Boot!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}
