import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import SocialLoginButtons from './SocialLoginButtons';

const LoginForm = ({ onLogin, onGoogleLogin, onKakaoLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onLogin(formData.email, formData.password);
    } catch (error) {
      setError(error.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="form-section">
      <h2>로그인</h2>
      
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
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          disabled={isSubmitting}
        />

        {error && <div className="error">{error}</div>}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </div>

      <div className="switch-page">
        <p>
          계정이 없으신가요? 
          <button onClick={onSwitchToRegister} className="link-btn">
            회원가입
          </button>
        </p>
      </div>

      <div className="demo-hint">
        <p>💡 데모 계정: test@test.com / test123</p>
      </div>
    </div>
  );
};

export default LoginForm;