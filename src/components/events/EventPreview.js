import React from 'react';
import { generateDateArray, generateTimeSlots } from '../../utils/events';

const EventPreview = ({ formData }) => {
  const { name, description, type, dateRange, timeRange } = formData;

  if (!name || !dateRange?.start || !dateRange?.end) {
    return null;
  }

  const dates = generateDateArray(dateRange.start, dateRange.end);
  const dayCount = dates.length;
  
  let timeSlotCount = 0;
  if (type === 'time' && timeRange?.start && timeRange?.end) {
    const timeSlots = generateTimeSlots(timeRange.start, timeRange.end);
    timeSlotCount = timeSlots.length;
  }

  return (
    <div className="event-preview">
      <h3>약속 미리보기</h3>
      
      <div className="preview-card">
        <div className="preview-header">
          <h4>{name}</h4>
          {description && <p>{description}</p>}
        </div>
        
        <div className="preview-details">
          <div className="detail-item">
            <span className="label">타입:</span>
            <span className="value">
              {type === 'date' ? '📅 날짜 선택' : '⏰ 시간 선택'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="label">기간:</span>
            <span className="value">
              {new Date(dateRange.start).toLocaleDateString('ko-KR')} ~ {' '}
              {new Date(dateRange.end).toLocaleDateString('ko-KR')}
              <small> ({dayCount}일)</small>
            </span>
          </div>
          
          {type === 'time' && timeRange?.start && timeRange?.end && (
            <div className="detail-item">
              <span className="label">시간:</span>
              <span className="value">
                {timeRange.start} ~ {timeRange.end}
                <small> ({timeSlotCount}개 시간대)</small>
              </span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="label">총 선택지:</span>
            <span className="value highlight">
              {type === 'date' ? dayCount : dayCount * timeSlotCount}개
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;