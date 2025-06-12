import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import NicknameModal from '../components/auth/NicknameModal';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  signInWithKakao,
  createUserDocument,
  getUserData
} from '../utils/firebaseAuth';

const LoginPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentPage, setCurrentPage] = useState('login');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  // 로그인 후 이동할 경로 확인
  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get('groupId');
  const redirectTo = groupId ? `/join/${groupId}` : '/groups';

  const handleEmailLogin = async (email, password) => {
    const userData = await signInWithEmail(email, password);
    onAuthSuccess(userData);
    navigate(redirectTo, { replace: true });
  };

  const handleEmailRegister = async (email, password, nickname) => {
    const userData = await signUpWithEmail(email, password, nickname);
    onAuthSuccess(userData);
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    
    if (result.isNewUser && result.needsNickname) {
      // 새 사용자인 경우 닉네임 입력 필요
      setTempUser(result.user);
      setShowNicknameModal(true);
    } else {
      // 기존 사용자인 경우 바로 로그인
      onAuthSuccess(result.user);
      navigate(redirectTo, { replace: true });
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNicknameSave = async (nickname) => {
    try {
      // 사용자 문서 생성
      await createUserDocument(tempUser, {
        nickname,
        provider: 'google'
      });

      // 완성된 사용자 데이터 조회
      const userData = await getUserData(tempUser.uid);
      
      onAuthSuccess(userData);
      setShowNicknameModal(false);
      setTempUser(null);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      alert('닉네임 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Layout>
      <Header 
        title="🏝️ 모임 스케줄러"
        subtitle="함께 만드는 완벽한 일정 ✨"
      />
      
      <div className="content">
        {/* 초대 메시지 표시 */}
        {groupId && (
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