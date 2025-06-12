import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
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
    <>
      {user ? (
        <GroupsPage user={user} onLogout={logout} />
      ) : (
        <LoginPage onAuthSuccess={saveUser} />
      )}
    </>
  );
}

export default App;