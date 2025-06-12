import React from 'react';
import Button from '../common/Button';

const InviteError = ({ error, onRetry, onGoHome }) => {
  const getErrorIcon = (error) => {
    if (error.includes('존재하지 않거나')) return '🔍';
    if (error.includes('유효하지 않습니다')) return '❌';
    return '😕';
  };

  const getErrorTitle = (error) => {
    if (error.includes('존재하지 않거나')) return '모임을 찾을 수 없어요';
    if (error.includes('유효하지 않습니다')) return '잘못된 초대 링크예요';
    return '오류가 발생했어요';
  };

  return (
    <div className="invite-error">
      <div className="error-content">
        <div className="error-icon">{getErrorIcon(error)}</div>
        <h2>{getErrorTitle(error)}</h2>
        <p>{error}</p>
        
        <div className="error-actions">
          <Button
            onClick={onRetry}
            variant="secondary"
            className="retry-btn"
          >
            🔄 다시 시도
          </Button>
          
          <Button
            onClick={onGoHome}
            variant="primary"
            className="home-btn"
          >
            🏠 홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteError;