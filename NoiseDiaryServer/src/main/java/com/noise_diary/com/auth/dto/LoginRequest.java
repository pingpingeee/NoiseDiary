package com.noise_diary.com.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank(message = "사용자 ID 또는 이메일은 필수입니다")
    private String userId; // userId 또는 email
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
}