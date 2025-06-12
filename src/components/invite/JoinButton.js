import React, { useState } from 'react';
import Button from '../common/Button';

const JoinButton = ({ 
  onJoin, 
  isAlreadyMember, 
  isLoggedIn, 
  onLoginRequired,
  groupName 
}) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    setIsJoining(true);
    try {
      const result = await onJoin();
      
      if (result.alreadyMember) {
        alert('이미 모임에 참여하고 있습니다! 🎉');
      } else {
        alert(`${groupName} 모임에 참여했습니다! 🎉`);
      }
    } catch (error) {
      alert(`참여 실패: ${error.message}`);
    }
    setIsJoining(false);
  };

  if (isAlreadyMember) {
    return (
      <div className="join-status">
        <div className="already-member">
          <span className="status-icon">✅</span>
          <span>이미 이 모임의 멤버입니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className="join-actions">
      <Button
        onClick={handleJoin}
        disabled={isJoining}
        variant="primary"
        className="join-btn"
      >
        {isJoining ? '참여 중...' : '🌟 모임 참여하기'}
      </Button>
      
      {!isLoggedIn && (
        <p className="login-notice">
          모임에 참여하려면 로그인이 필요합니다
        </p>
      )}
    </div>
  );
};

export default JoinButton;