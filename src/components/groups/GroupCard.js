import React from 'react';
import { getMemberCount, getEventCount } from '../../utils/groups';

const GroupCard = ({ group, user, onDelete, onClick }) => {
    // user가 null일 수 있으므로 안전하게 처리
    const isOwner = group.createdBy === user?.uid; // user && user.uid 대신 user?.uid 사용
    const memberCount = getMemberCount(group);
    const eventCount = getEventCount(group);
  
    const handleDelete = (e) => {
      e.stopPropagation();
      
      if (window.confirm(`'${group.name}' 모임을 정말 삭제하시겠습니까?`)) {
        onDelete(group.id);
      }
    };
  
    return (
      <div className="group-card" onClick={() => onClick(group.id)}>
        <div className="group-header">
          <div className="group-title">
            {isOwner && <span className="owner-crown">👑</span>}
            <h3>{group.name}</h3>
          </div>
          
          {/* user가 존재하고 모임장일 때만 삭제 버튼 표시 */}
          {user && isOwner && (
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              title="모임 삭제"
            >
              🗑️
            </button>
          )}
        </div>
        
        <div className="group-description">
          {group.description && <p>{group.description}</p>}
        </div>
        
        <div className="group-stats">
          <span className="stat">
            👥 멤버 {memberCount}명
          </span>
          <span className="stat">
            📅 약속 {eventCount}개
          </span>
        </div>
        
        <div className="group-date">
          {new Date(group.createdAt).toLocaleDateString('ko-KR')} 생성
        </div>
      </div>
    );
  };

export default GroupCard;