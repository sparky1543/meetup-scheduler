import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children, user }) => {
  // 이미 로그인된 사용자가 로그인 페이지에 접근하면 모임 목록으로 리다이렉트
  if (user) {
    return <Navigate to="/groups" replace />;
  }

  return children;
};

export default PublicRoute;