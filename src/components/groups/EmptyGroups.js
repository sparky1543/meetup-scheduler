import React from 'react';

const EmptyGroups = ({ onCreateGroup }) => {
  return (
    <div className="empty-groups">
      <div className="empty-icon">🏝️</div>
      <h3>아직 참여 중인 모임이 없어요</h3>
      <p>새로운 모임을 만들어서 친구들과 일정을 조율해보세요!</p>
      
      <button onClick={onCreateGroup} className="btn btn-primary create-first-btn">
        🌟 첫 모임 만들기
      </button>
    </div>
  );
};

export default EmptyGroups;