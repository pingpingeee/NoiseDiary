export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // 최소 8자, 대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUserId = (userId) => {
  // 4-20자, 영문자와 숫자만
  const userIdRegex = /^[a-zA-Z0-9]{4,20}$/;
  return userIdRegex.test(userId);
};

export const validatePhone = (phone) => {
  // 010-1234-5678 형식
  const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};