import React, { useState } from 'react';
import Button from '../common/Button';
import { generateInviteLink } from '../../utils/groups';

const InviteLink = ({ groupId }) => {
  const [copied, setCopied] = useState(false);
  
  const inviteLink = generateInviteLink(groupId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="invite-link-section">
      <div className="section-header">
        <h3>🔗 초대 링크</h3>
      </div>

      <div className="invite-link-content">
        <div className="link-display">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="link-input"
          />
        </div>
        
        <Button
          onClick={handleCopyLink}
          variant={copied ? 'secondary' : 'primary'}
          className="copy-btn"
        >
          {copied ? '✅ 복사됨!' : '📋 링크 복사'}
        </Button>
        
        <p className="invite-description">
          이 링크를 공유해서 친구들을 모임에 초대하세요!
        </p>
      </div>
    </div>
  );
};

export default InviteLink;