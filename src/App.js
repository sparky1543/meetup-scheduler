import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import JoinGroupPage from './pages/JoinGroupPage';
import CreateEventPage from './pages/CreateEventPage'; // 새로 추가
import './App.css';

function App() {
  const { user, loading, saveUser, logout } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="mobile-wrapper">
          <div className="loading">
            <div className="spinner"></div>
            <p>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 홈 라우트 */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/groups" replace /> : <Navigate to="/login" replace />
          } 
        />

        {/* 로그인 페이지 */}
        <Route 
          path="/login" 
          element={
            <PublicRoute user={user}>
              <LoginPage onAuthSuccess={saveUser} />
            </PublicRoute>
          } 
        />

        {/* 보호된 라우트들 */}
        <Route 
          path="/groups" 
          element={
            <ProtectedRoute user={user}>
              <GroupsPage user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/groups/:groupId" 
          element={
            <ProtectedRoute user={user}>
              <GroupDetailPage user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />

        {/* 약속 생성 페이지 - 새로 추가 */}
        <Route 
          path="/groups/:groupId/create-event" 
          element={
            <ProtectedRoute user={user}>
              <CreateEventPage user={user} onLogout={logout} />
            </ProtectedRoute>
          } 
        />

        {/* 초대 페이지 */}
        <Route 
          path="/join/:groupId" 
          element={<JoinGroupPage user={user} />}
        />

        {/* 404 페이지 */}
        <Route 
          path="*" 
          element={
            <div className="container">
              <div className="mobile-wrapper">
                <div className="content">
                  <div className="error-page">
                    <div className="error-icon">🔍</div>
                    <h2>페이지를 찾을 수 없어요</h2>
                    <p>요청하신 페이지가 존재하지 않습니다.</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="btn btn-primary"
                    >
                      홈으로 가기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;