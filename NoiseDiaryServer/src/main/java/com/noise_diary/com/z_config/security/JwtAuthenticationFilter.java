package com.noise_diary.com.z_config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.noise_diary.com.z_config.jwt.JwtTokenUtil;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain chain) throws ServletException, IOException {
        
        String username = null;
        String jwtToken = null;

        // 1. Authorization 헤더에서 토큰 확인 (기존 방식 유지)
        final String requestTokenHeader = request.getHeader("Authorization");
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                logger.info("Token found in Authorization header for user: " + username);
            } catch (Exception e) {
                logger.warn("JWT Token 처리 중 오류 발생 (Header): " + e.getMessage());
            }
        }

        // 2. 헤더에 토큰이 없으면 쿠키에서 확인
        if (jwtToken == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    jwtToken = cookie.getValue();
                    try {
                        username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                        logger.info("Token found in cookie for user: " + username);
                    } catch (Exception e) {
                        logger.warn("JWT Token 처리 중 오류 발생 (Cookie): " + e.getMessage());
                    }
                    break;
                }
            }
        }

        // 토큰이 없는 경우 로그
        if (jwtToken == null) {
            logger.debug("No JWT Token found in request headers or cookies for: " + request.getRequestURI());
        }

        // 3. 토큰 검증 및 인증 설정
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                logger.info("Authentication successful for user: " + username);
            } else {
                logger.warn("Token validation failed for user: " + username);
            }
        }
        
        chain.doFilter(request, response);
    }
}
