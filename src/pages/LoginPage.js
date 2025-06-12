import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import NicknameModal from '../components/auth/NicknameModal';
import { mockAuth, getErrorMessage, generateUserNumber } from '../utils/auth';

const LoginPage = ({ onAuthSuccess }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

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
  };

  return (
    <Layout>
      <Header 
        title="🏝️ 모임 스케줄러"
        subtitle="함께 만드는 완벽한 일정 ✨"
      />
      
      <div className="content">
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