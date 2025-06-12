import React, { useState } from 'react';
import { validateDateRange } from '../../utils/events';

const DateRangeSelector = ({ type, dateRange, onDateRangeChange, error, setError }) => {
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  const handleDateChange = (field, value) => {
    const newRange = { ...localDateRange, [field]: value };
    setLocalDateRange(newRange);
    
    if (newRange.start && newRange.end) {
      const validation = validateDateRange(newRange.start, newRange.end, type);
      if (validation.valid) {
        setError('');
        onDateRangeChange(newRange);
      } else {
        setError(validation.error);
      }
    }
  };

  // 오늘 날짜 (최소 선택 가능일)
  const today = new Date().toISOString().split('T')[0];
  
  // 최대 선택 가능일 계산
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="date-range-selector">
      <h3>기간 설정</h3>
      
      <div className="date-inputs">
        <div className="date-input-group">
          <label>시작일</label>
          <input
            type="date"
            value={localDateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            min={today}
            max={maxDateString}
            className="date-input"
          />
        </div>
        
        <div className="date-input-group">
          <label>종료일</label>
          <input
            type="date"
            value={localDateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={localDateRange.start || today}
            max={maxDateString}
            className="date-input"
          />
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="date-range-info">
        <p>
          <strong>📋 {type === 'date' ? '날짜 선택' : '시간 선택'} 타입</strong>
        </p>
        <p>
          {type === 'date' 
            ? '참가자들이 가능한 날짜를 선택할 수 있습니다.' 
            : '참가자들이 가능한 날짜와 시간을 선택할 수 있습니다.'
          }
        </p>
      </div>
    </div>
  );
};

export default DateRangeSelector;