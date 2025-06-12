import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import NicknameModal from '../components/auth/NicknameModal';
import { mockAuth, getErrorMessage, generateUserNumber } from '../utils/auth';

const LoginPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentPage, setCurrentPage] = useState('login');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  // 로그인 후 이동할 경로 확인 (안전하게 처리)
  const from = (location.state?.from && typeof location.state.from === 'string') 
    ? location.state.from 
    : '/groups';
  
  const isInviteLink = from.startsWith('/join/');

  const handleEmailLogin = async (email, password) => {
    const userCredential = await mockAuth.signInWithEmail(email, password);
    
    const userData = {
      uid: userCredential.uid,
      email: userCredential.email,
      nickname: email.split('@')[0],
      userNumber: generateUserNumber(),
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    onAuthSuccess(userData);
    // React Router의 navigate 사용
    navigate(from, { replace: true });
  };

  const handleEmailRegister = async (email, password, nickname) => {
    const userCredential = await mockAuth.createUserWithEmail(email, password);
    
    const userData = {
      uid: userCredential.uid,
      email: userCredential.email,
      nickname: nickname,
      userNumber: generateUserNumber(),
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    onAuthSuccess(userData);
    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    const result = await mockAuth.signInWithGoogle();
    
    if (result.isNewUser) {
      setTempUser(result);
      setShowNicknameModal(true);
    } else {
      const userData = {
        uid: result.uid,
        email: result.email,
        nickname: result.email.split('@')[0],
        userNumber: generateUserNumber(),
        provider: 'google',
        createdAt: new Date().toISOString()
      };
      onAuthSuccess(userData);
      navigate(from, { replace: true });
    }
  };

  const handleKakaoLogin = () => {
    alert('카카오 로그인은 실제 배포시 구현됩니다. 지금은 구글 로그인을 사용해주세요.');
  };

  const handleNicknameSave = (nickname) => {
    const userData = {
      uid: tempUser.uid,
      email: tempUser.email,
      nickname: nickname,
      userNumber: generateUserNumber(),
      provider: 'google',
      createdAt: new Date().toISOString()
    };

    onAuthSuccess(userData);
    setShowNicknameModal(false);
    setTempUser(null);
    navigate(from, { replace: true });
  };

  return (
    <Layout>
      <Header 
        title="🏝️ 모임 스케줄러"
        subtitle="함께 만드는 완벽한 일정 ✨"
      />
      
      <div className="content">
        {/* 초대 메시지 표시 */}
        {isInviteLink && (
          <div className="invite-message">
            <div className="invite-notice">
              <span className="notice-icon">📩</span>
              <div className="notice-content">
                <h3>모임 초대를 받으셨네요!</h3>
                <p>로그인 후 모임에 참여할 수 있습니다.</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'login' ? (
          <LoginForm
            onLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
            onKakaoLogin={handleKakaoLogin}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        ) : (
          <RegisterForm
            onRegister={handleEmailRegister}
            onGoogleLogin={handleGoogleLogin}
            onKakaoLogin={handleKakaoLogin}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}
      </div>

      <NicknameModal
        isOpen={showNicknameModal}
        onSave={handleNicknameSave}
      />
    </Layout>
  );
};

export default LoginPage;