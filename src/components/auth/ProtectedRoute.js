import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, user, requireAuth = true }) => {
  const location = useLocation();

  if (requireAuth && !user) {
    // 로그인이 필요한 페이지인데 user가 없으면 로그인 페이지로
    // 현재 위치를 state로 전달해서 로그인 후 돌아올 수 있게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // 로그인하면 안 되는 페이지(로그인 페이지)인데 user가 있으면 메인으로
    return <Navigate to="/groups" replace />;
  }

  return children;
};

export default ProtectedRoute;