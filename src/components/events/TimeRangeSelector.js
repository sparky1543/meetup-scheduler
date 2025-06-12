import React, { useState } from 'react';
import { validateTimeRange } from '../../utils/events';

const TimeRangeSelector = ({ timeRange, onTimeRangeChange, error, setError }) => {
  const [localTimeRange, setLocalTimeRange] = useState(timeRange);

  const handleTimeChange = (field, value) => {
    const newRange = { ...localTimeRange, [field]: value };
    setLocalTimeRange(newRange);
    
    if (newRange.start && newRange.end) {
      const validation = validateTimeRange(newRange.start, newRange.end);
      if (validation.valid) {
        setError('');
        onTimeRangeChange(newRange);
      } else {
        setError(validation.error);
      }
    }
  };

  return (
    <div className="time-range-selector">
      <h3>시간대 설정</h3>
      
      <div className="time-inputs">
        <div className="time-input-group">
          <label>시작 시간</label>
          <input
            type="time"
            value={localTimeRange.start}
            onChange={(e) => handleTimeChange('start', e.target.value)}
            className="time-input"
          />
        </div>
        
        <div className="time-input-group">
          <label>종료 시간</label>
          <input
            type="time"
            value={localTimeRange.end}
            onChange={(e) => handleTimeChange('end', e.target.value)}
            className="time-input"
          />
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="time-range-info">
        <p><strong>⏰ 30분 단위로 시간 선택</strong></p>
        <p>참가자들이 설정된 시간대 내에서 가능한 시간을 선택할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default TimeRangeSelector;