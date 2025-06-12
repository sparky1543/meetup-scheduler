import React from 'react';

const EventTypeSelector = ({ selectedType, onTypeChange }) => {
  return (
    <div className="event-type-selector">
      <h3>약속 타입 선택</h3>
      <div className="type-options">
        <div 
          className={`type-option ${selectedType === 'date' ? 'active' : ''}`}
          onClick={() => onTypeChange('date')}
        >
          <div className="type-icon">📅</div>
          <div className="type-info">
            <h4>날짜 선택</h4>
            <p>특정 날짜들 중에서 선택</p>
            <small>최대 1년 기간 설정 가능</small>
          </div>
        </div>
        
        <div 
          className={`type-option ${selectedType === 'time' ? 'active' : ''}`}
          onClick={() => onTypeChange('time')}
        >
          <div className="type-icon">⏰</div>
          <div className="type-info">
            <h4>시간 선택</h4>
            <p>날짜와 시간을 함께 선택</p>
            <small>최대 2주 기간 설정 가능</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTypeSelector;