import React from 'react';

const Loading = ({ message = "로딩 중..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loading;