package com.noise_diary.com.auth.dto;

import com.noise_diary.com.user.dto.UserResponseDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private UserResponseDto user;
    private String message;
    
    public LoginResponse(String token, UserResponseDto user) {
        this.token = token;
        this.user = user;
        this.message = "로그인 성공";
    }
}