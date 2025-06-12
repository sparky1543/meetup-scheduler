import React from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';

const MainPage = ({ user, onLogout }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('groupId');

  return (
    <Layout>
      <Header 
        title="🏝️ 모임 스케줄러"
        user={user}
      />
      
      <div className="content">
        <div className="main-section">
          <h2>🚧 개발 중</h2>
          <p>모임 목록 페이지가 곧 준비됩니다!</p>
          
          <div className="user-details">
            <h3>현재 로그인 정보</h3>
            <div className="detail-row">
              <span>이메일:</span>
              <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <span>닉네임:</span>
              <span>{user.nickname}</span>
            </div>
            <div className="detail-row">
              <span>사용자 번호:</span>
              <span>{user.userNumber}</span>
            </div>
            <div className="detail-row">
              <span>가입 방법:</span>
              <span>{user.provider === 'email' ? '이메일' : '구글'}</span>
            </div>
          </div>
          
          {groupId && (
            <div className="invite-box">
              <h3>📩 초대받은 모임</h3>
              <p>Group ID: <strong>{groupId}</strong></p>
              <p>초대 수락 기능이 곧 구현됩니다!</p>
            </div>
          )}
          
          <div className="demo-info">
            <h4>💡 데모 계정</h4>
            <p>이메일: test@test.com</p>
            <p>비밀번호: test123</p>
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="secondary"
          className="logout-btn"
        >
          🚪 로그아웃
        </Button>
      </div>
    </Layout>
  );
};

export default MainPage;