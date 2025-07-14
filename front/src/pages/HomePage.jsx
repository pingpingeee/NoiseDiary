import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="page">
      <div className="home-container">
        <h1>환영합니다, {user?.name}님!</h1>
        <div className="user-info">
          <p>사용자 ID: {user?.userId}</p>
          <p>이메일: {user?.email}</p>
          <p>가입일: {new Date(user?.createdDate).toLocaleDateString()}</p>
        </div>
        <button onClick={logout} className="auth-button">로그아웃</button>
      </div>
    </div>
  );
};

export default HomePage;