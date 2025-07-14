package com.noise_diary.com.user.dto;

import com.noise_diary.com.user.entity.UserInfo;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    
    private Long userNo;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String roadAddress;
    private String address;
    private String detailAddress;
    private UserInfo.AdminStatus adminStatus;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
    
    // Entity -> DTO 변환 생성자
    public UserResponseDto(UserInfo userInfo) {
        this.userNo = userInfo.getUserNo();
        this.userId = userInfo.getUserId();
        this.name = userInfo.getName();
        this.email = userInfo.getEmail();
        this.phone = userInfo.getPhone();
        this.birthDate = userInfo.getBirthDate();
        this.roadAddress = userInfo.getRoadAddress();
        this.address = userInfo.getAddress();
        this.detailAddress = userInfo.getDetailAddress();
        this.adminStatus = userInfo.getAdminStatus();
        this.createdDate = userInfo.getCreatedDate();
        this.lastLoginDate = userInfo.getLastLoginDate();
    }
}