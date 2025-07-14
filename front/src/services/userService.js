import api from './api';

export const userService = {
  // 회원가입
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // 사용자 ID 중복 확인
  checkUserId: async (userId) => {
    const response = await api.get(`/users/check-userid/${userId}`);
    return response.data;
  },

  // 이메일 중복 확인
  checkEmail: async (email) => {
    const response = await api.get(`/users/check-email/${email}`);
    return response.data;
  },

  // 이메일 인증코드 발송
  sendEmailVerification: async (email) => {
    const response = await api.post(`/email/send-verification?email=${email}`);
    return response.data;
  },

  // 이메일 인증코드 검증
  verifyEmailCode: async (email, verificationCode) => {
    const response = await api.post('/email/verify-code', {
      email,
      verificationCode
    });
    return response.data;
  },

  // 내 정보 조회
  getMyInfo: async () => {
    const response = await api.get('/users/me');
    return response.data;
  }
};