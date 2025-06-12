import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import './App.css';

function App() {
  const { user, loading, saveUser, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('groups'); // 'groups' | 'groupDetail'
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setCurrentPage('groupDetail');
  };

  const handleBackToGroups = () => {
    setCurrentPage('groups');
    setSelectedGroupId(null);
  };

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

  if (!user) {
    return <LoginPage onAuthSuccess={saveUser} />;
  }

  // 로그인 상태에서 페이지 라우팅
  switch (currentPage) {
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