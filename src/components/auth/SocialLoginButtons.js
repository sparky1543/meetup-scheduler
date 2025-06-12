import React from 'react';
import Button from '../common/Button';

const SocialLoginButtons = ({ onGoogleLogin, onKakaoLogin, disabled }) => {
  return (
    <div className="social-buttons">
      <Button
        onClick={onGoogleLogin}
        disabled={disabled}
        variant="social"
        className="google"
      >
        🔵 구글로 로그인
      </Button>
      
      <Button
        onClick={onKakaoLogin}
        disabled={disabled}
        variant="social"
        className="kakao"
      >
        💛 카카오로 로그인
      </Button>
    </div>
  );
};

export default SocialLoginButtons;