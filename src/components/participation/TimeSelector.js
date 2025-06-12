import React, { useState } from 'react';
import { generateDateArray, generateTimeSlots } from '../../utils/events';

const TimeSelector = ({ 
  event, 
  selectedSlots, 
  onSlotToggle, 
  responses, 
  showHeatmap 
}) => {
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const dates = generateDateArray(event.dateRange.start, event.dateRange.end);
  const timeSlots = generateTimeSlots(event.timeRange.start, event.timeRange.end);
  
  // 날짜+시간 조합 슬롯 생성
  const generateCombinedSlots = () => {
    const slots = [];
    dates.forEach(date => {
      timeSlots.forEach(time => {
        slots.push(`${date}T${time}`);
      });
    });
    return slots;
  };
  
  const allSlots = generateCombinedSlots();
  
  // 각 슬롯별 응답자 수 계산
  const getResponseCount = (slot) => {
    if (!showHeatmap || !responses) return 0;
    
    return Object.values(responses).filter(response => 
      response.selectedSlots && response.selectedSlots.includes(slot)
    ).length;
  };
  
  // 최대 응답자 수 (히트맵 정규화용)
  const maxResponses = Math.max(
    ...allSlots.map(slot => getResponseCount(slot)),
    1
  );
  
  // 히트맵 강도 계산 (0-1)
  const getHeatmapIntensity = (slot) => {
    if (!showHeatmap) return 0;
    return getResponseCount(slot) / maxResponses;
  };
  
  // 슬롯 조합 함수
  const combineSlot = (date, time) => `${date}T${time}`;
  
  // 드래그 시작
  const handleMouseDown = (slot) => {
    setDragStart(slot);
    setIsDragging(true);
    onSlotToggle(slot);
  };
  
  // 드래그 중 - 시간표에서는 직사각형 영역 선택
  const handleMouseEnter = (slot) => {
    if (isDragging && dragStart) {
      const [dragStartDate, dragStartTime] = dragStart.split('T');
      const [currentDate, currentTime] = slot.split('T');
      
      const startDateIndex = dates.indexOf(dragStartDate);
      const endDateIndex = dates.indexOf(currentDate);
      const startTimeIndex = timeSlots.indexOf(dragStartTime);
      const endTimeIndex = timeSlots.indexOf(currentTime);
      
      const minDateIndex = Math.min(startDateIndex, endDateIndex);
      const maxDateIndex = Math.max(startDateIndex, endDateIndex);
      const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
      const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);
      
      const shouldSelect = !selectedSlots.includes(dragStart);
      
      // 직사각형 영역의 모든 슬롯 선택/해제
      for (let dateIdx = minDateIndex; dateIdx <= maxDateIndex; dateIdx++) {
        for (let timeIdx = minTimeIndex; timeIdx <= maxTimeIndex; timeIdx++) {
          const currentSlot = combineSlot(dates[dateIdx], timeSlots[timeIdx]);
          
          if (shouldSelect && !selectedSlots.includes(currentSlot)) {
            onSlotToggle(currentSlot);
          } else if (!shouldSelect && selectedSlots.includes(currentSlot)) {
            onSlotToggle(currentSlot);
          }
        }
      }
    }
  };
  
  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  return (
    <div className="time-selector" onMouseUp={handleMouseUp}>
      <div className="selector-header">
        <h4>⏰ 시간 선택</h4>
        <div className="selector-instructions">
          <p>• 클릭: 단일 시간 선택/해제</p>
          <p>• 드래그: 시간대 범위 선택</p>
          {showHeatmap && <p>• 색상: 다른 참가자들의 선택 빈도</p>}
        </div>
      </div>
      
      {showHeatmap && (
        <div className="heatmap-legend">
          <span>적음</span>
          <div className="legend-gradient"></div>
          <span>많음</span>
        </div>
      )}
      
      <div className="time-grid-container">
        <div className="time-grid">
          {/* 헤더: 날짜들 */}
          <div className="time-header">
            <div className="time-corner"></div>
            {dates.map(date => {
              const dateObj = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];
              
              return (
                <div key={date} className={`date-header ${isToday ? 'today' : ''}`}>
                  <div className="date-month">{dateObj.getMonth() + 1}/{dateObj.getDate()}</div>
                  <div className="date-weekday">
                    {dateObj.toLocaleDateString('ko-KR', { weekday: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 시간 행들 */}
          {timeSlots.map(time => (
            <div key={time} className="time-row">
              <div className="time-label">
                <span className="time-text">{time}</span>
              </div>
              
              {dates.map(date => {
                const slot = combineSlot(date, time);
                const isSelected = selectedSlots.includes(slot);
                const responseCount = getResponseCount(slot);
                const heatmapIntensity = getHeatmapIntensity(slot);
                const dateObj = new Date(date);
                const isPast = new Date(`${date}T${time}`) < new Date();
                
                return (
                  <div
                    key={slot}
                    className={`time-cell ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                    style={{
                      backgroundColor: showHeatmap && heatmapIntensity > 0 
                        ? `rgba(79, 172, 254, ${0.2 + heatmapIntensity * 0.6})`
                        : undefined
                    }}
                    onMouseDown={() => handleMouseDown(slot)}
                    onMouseEnter={() => handleMouseEnter(slot)}
                    title={`${dateObj.toLocaleDateString('ko-KR')} ${time}${showHeatmap ? ` (${responseCount}명 선택)` : ''}`}
                  >
                    {showHeatmap && responseCount > 0 && (
                      <span className="response-count">{responseCount}</span>
                    )}
                    {isSelected && <span className="selection-mark">✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="selection-stats">
        <p>
          📅 전체 기간: {dates.length}일 | 
          ⏰ 시간대: {timeSlots.length}개 |
          ✅ 선택됨: {selectedSlots.length}개
          {showHeatmap && (
            <> | 👥 총 응답자: {Object.keys(responses).length}명</>
          )}
        </p>
      </div>
    </div>
  );
};

export default TimeSelector;