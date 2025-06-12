import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import JoinGroupPage from './pages/JoinGroupPage';
import { getGroupIdFromUrl } from './utils/groups';
import './App.css';

function App() {
  const { user, loading, saveUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('loading'); 
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [inviteGroupId, setInviteGroupId] = useState(null);

  // 앱 초기화 및 URL 파라미터 확인
  useEffect(() => {
    if (loading) return; // 인증 로딩 중이면 대기

    // URL에서 groupId 파라미터 확인 (초대 링크)
    const groupId = getGroupIdFromUrl();
    
    if (groupId) {
      setInviteGroupId(groupId);
      
      if (user) {
        // 로그인된 사용자면 바로 초대 페이지로
        setCurrentPage('join');
      } else {
        // 비로그인 사용자면 로그인 페이지로 (초대 정보 유지)
        setCurrentPage('login');
      }
    } else {
      // 일반 접근
      if (user) {
        setCurrentPage('groups');
      } else {
        setCurrentPage('login');
      }
    }
  }, [user, loading]);

  // 로그인 성공 후 처리
  const handleAuthSuccess = (userData) => {
    saveUser(userData);
    
    // 초대 링크로 온 경우 초대 페이지로, 아니면 모임 목록으로
    if (inviteGroupId) {
      setCurrentPage('join');
    } else {
      setCurrentPage('groups');
    }
  };

  // 페이지 네비게이션 함수들
  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setCurrentPage('groupDetail');
  };

  const handleBackToGroups = () => {
    setCurrentPage('groups');
    setSelectedGroupId(null);
    
    // URL 파라미터 제거
    if (inviteGroupId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setInviteGroupId(null);
    }
  };

  const handleJoinSuccess = (groupId) => {
    // 모임 참여 성공 후 해당 모임 상세 페이지로 이동
    setSelectedGroupId(groupId);
    setCurrentPage('groupDetail');
    
    // URL 파라미터 제거
    window.history.replaceState({}, document.title, window.location.pathname);
    setInviteGroupId(null);
  };

  const handleLoginRequired = () => {
    // 로그인이 필요한 경우 로그인 페이지로 (초대 정보 유지)
    setCurrentPage('login');
  };

  const handleGoHome = () => {
    // 홈으로 가기 (초대 정보 제거)
    setCurrentPage(user ? 'groups' : 'login');
    window.history.replaceState({}, document.title, window.location.pathname);
    setInviteGroupId(null);
  };

  // 로딩 중
  if (currentPage === 'loading') {
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

  // 로그인이 필요한 경우 (user가 null인 경우)
  if (!user) {
    return (
      <LoginPage 
        onAuthSuccess={handleAuthSuccess}
        showInviteMessage={!!inviteGroupId}
      />
    );
  }

  // 로그인된 사용자의 페이지 라우팅
  switch (currentPage) {
    case 'join':
      return (
        <JoinGroupPage
          groupId={inviteGroupId}
          user={user}
          onJoinSuccess={handleJoinSuccess}
          onLoginRequired={handleLoginRequired}
          onGoHome={handleGoHome}
        />
      );

    case 'groupDetail':
      return (
        <GroupDetailPage
          groupId={selectedGroupId}
          user={user}
          onBack={handleBackToGroups}
          onLogout={logout}
        />
      );
    
    case 'groups':
    default:
      return (
        <GroupsPage
          user={user}
          onLogout={logout}
          onGroupClick={handleGroupClick}
        />
      );
  }
}

export default App;