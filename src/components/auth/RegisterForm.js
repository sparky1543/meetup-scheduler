import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import SocialLoginButtons from './SocialLoginButtons';

const RegisterForm = ({ onRegister, onGoogleLogin, onKakaoLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || !formData.nickname) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자리 이상이어야 합니다.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onRegister(formData.email, formData.password, formData.nickname);
    } catch (error) {
      setError(error.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="form-section">
      <h2>회원가입</h2>
      
      <SocialLoginButtons
        onGoogleLogin={onGoogleLogin}
        onKakaoLogin={onKakaoLogin}
        disabled={isSubmitting}
      />

      <div className="divider">
        <span>또는</span>
      </div>

      <div className="form-inputs">
        <Input
          type="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={isSubmitting}
        />
        
        <Input
          type="text"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={(e) => setFormData({...formData, nickname: e.target.value})}
          disabled={isSubmitting}
        />
        
        <Input
          type="password"
          placeholder="비밀번호 (6자리 이상)"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          disabled={isSubmitting}
        />
        
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          disabled={isSubmitting}
        />

        {error && <div className="error">{error}</div>}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </Button>
      </div>

      <div className="switch-page">
        <p>
          이미 계정이 있으신가요? 
          <button onClick={onSwitchToLogin} className="link-btn">
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;