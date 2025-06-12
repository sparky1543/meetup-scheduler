import React from 'react';
import Button from '../common/Button';
import { getMemberCount } from '../../utils/groups';

const MemberList = ({ group, currentUser, isOwner, onRemoveMember }) => {
  if (!group || !group.members) return null;

  const members = Object.entries(group.members);
  const memberCount = getMemberCount(group);

  const handleRemoveMember = (userId, nickname) => {
    if (userId === currentUser?.uid) {
      if (window.confirm('정말 모임을 나가시겠습니까?')) {
        onRemoveMember(userId);
      }
    } else {
      if (window.confirm(`${nickname}님을 모임에서 내보내시겠습니까?`)) {
        onRemoveMember(userId);
      }
    }
  };

  return (
    <div className="member-list-section">
      <div className="section-header">
        <h3>👥 멤버 목록 ({memberCount}명)</h3>
      </div>

      <div className="member-list">
        {members.map(([userId, member]) => {
          const isCurrentUser = userId === currentUser?.uid;
          const canRemove = isOwner || isCurrentUser;
          const isGroupOwner = userId === group.createdBy;

          return (
            <div key={userId} className="member-item">
              <div className="member-info">
                <span className="member-name">
                  {isGroupOwner && <span className="owner-crown">👑</span>}
                  {member.nickname}
                  {isCurrentUser && <span className="current-user-badge">(나)</span>}
                </span>
                <span className="member-role">
                  {member.role === 'owner' ? '모임장' : '멤버'}
                </span>
              </div>
              
              <div className="member-actions">
                {canRemove && !isGroupOwner && (
                  <Button
                    onClick={() => handleRemoveMember(userId, member.nickname)}
                    variant="secondary"
                    className="remove-member-btn"
                  >
                    {isCurrentUser ? '나가기' : '내보내기'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;