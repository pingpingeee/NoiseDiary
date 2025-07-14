package com.noise_diary.com.auth.service;

import com.noise_diary.com.auth.dto.LoginRequest;
import com.noise_diary.com.auth.dto.LoginResponse;
import com.noise_diary.com.user.dto.UserResponseDto;
import com.noise_diary.com.user.entity.UserInfo;
import com.noise_diary.com.user.repository.UserRepository;
import com.noise_diary.com.user.service.UserService;
import com.noise_diary.com.z_config.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            System.out.println("Authenticating user: " + loginRequest.getUserId());
            
            // 인증 시도
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUserId(), 
                    loginRequest.getPassword()
                )
            );
            
            System.out.println("Authentication successful for: " + loginRequest.getUserId());
            
            // 사용자 정보 조회
            UserInfo userInfo = userRepository.findByUserIdOrEmail(loginRequest.getUserId())
                .orElseThrow(() -> new BadCredentialsException("사용자를 찾을 수 없습니다"));
            
            // JWT 토큰 생성
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUserId());
            final String token = jwtTokenUtil.generateToken(userDetails);
            
            System.out.println("JWT token generated for: " + loginRequest.getUserId());
            
            // 마지막 로그인 시간 업데이트
            userService.updateLastLoginDate(userInfo.getUserId());
            
            // 응답 생성
            UserResponseDto userResponseDto = new UserResponseDto(userInfo);
            return new LoginResponse(token, userResponseDto);
            
        } catch (Exception e) {
            System.err.println("Login failed for: " + loginRequest.getUserId() + ", Error: " + e.getMessage());
            throw new BadCredentialsException("아이디 또는 비밀번호가 올바르지 않습니다");
        }
    }
    
    public boolean validateToken(String token) {
        try {
            String username = jwtTokenUtil.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            boolean isValid = jwtTokenUtil.validateToken(token, userDetails);
            System.out.println("Token validation for " + username + ": " + isValid);
            return isValid;
        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            return false;
        }
    }
    
    // 토큰에서 사용자 ID 추출
    public String getUserIdFromToken(String token) {
        try {
            return jwtTokenUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            System.err.println("Error extracting user ID from token: " + e.getMessage());
            return null;
        }
    }
}
