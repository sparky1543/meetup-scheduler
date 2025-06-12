import React from 'react';
import { getMemberCount } from '../../utils/groups';

const InvitePreview = ({ group, stats }) => {
  if (!group) return null;

  const memberCount = getMemberCount(group);

  return (
    <div className="invite-preview">
      <div className="invite-header">
        <div className="invite-icon">🏝️</div>
        <h2>모임 초대</h2>
        <p><strong>{group.name}</strong> 모임에 초대되었습니다!</p>
      </div>

      <div className="group-preview-card">
        <div className="preview-header">
          <h3>{group.name}</h3>
        </div>

        <div className="preview-content">
          {group.description && (
            <div className="preview-item">
              <span className="preview-label">설명:</span>
              <span className="preview-value">{group.description}</span>
            </div>
          )}

          <div className="preview-item">
            <span className="preview-label">멤버:</span>
            <span className="preview-value">{memberCount}명</span>
          </div>

          <div className="preview-item">
            <span className="preview-label">모임장:</span>
            <span className="preview-value">{stats?.ownerName}</span>
          </div>

          <div className="preview-item">
            <span className="preview-label">생성일:</span>
            <span className="preview-value">{stats?.createdDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePreview;