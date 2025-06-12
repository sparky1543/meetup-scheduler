import React, { useState } from 'react';
import { generateDateArray } from '../../utils/events';

const DateSelector = ({ 
  event, 
  selectedSlots, 
  onSlotToggle, 
  responses, 
  showHeatmap 
}) => {
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const dates = generateDateArray(event.dateRange.start, event.dateRange.end);
  
  // 각 날짜별 응답자 수 계산
  const getResponseCount = (date) => {
    if (!showHeatmap || !responses) return 0;
    
    return Object.values(responses).filter(response => 
      response.selectedSlots && response.selectedSlots.includes(date)
    ).length;
  };
  
  // 최대 응답자 수 (히트맵 정규화용)
  const maxResponses = Math.max(
    ...dates.map(date => getResponseCount(date)),
    1
  );
  
  // 히트맵 강도 계산 (0-1)
  const getHeatmapIntensity = (date) => {
    if (!showHeatmap) return 0;
    return getResponseCount(date) / maxResponses;
  };
  
  // 드래그 시작
  const handleMouseDown = (date) => {
    setDragStart(date);
    setIsDragging(true);
    onSlotToggle(date);
  };
  
  // 드래그 중
  const handleMouseEnter = (date) => {
    if (isDragging && dragStart) {
      const startIndex = dates.indexOf(dragStart);
      const currentIndex = dates.indexOf(date);
      const start = Math.min(startIndex, currentIndex);
      const end = Math.max(startIndex, currentIndex);
      
      // 범위 내 모든 날짜 선택/해제
      const rangeSlots = dates.slice(start, end + 1);
      const shouldSelect = !selectedSlots.includes(dragStart);
      
      rangeSlots.forEach(slot => {
        if (shouldSelect && !selectedSlots.includes(slot)) {
          onSlotToggle(slot);
        } else if (!shouldSelect && selectedSlots.includes(slot)) {
          onSlotToggle(slot);
        }
      });
    }
  };
  
  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  // 달력 그리드 생성 (월별로 그룹화)
  const groupDatesByMonth = () => {
    const grouped = {};
    dates.forEach(date => {
      const dateObj = new Date(date);
      const monthKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth(),
          dates: []
        };
      }
      
      grouped[monthKey].dates.push(date);
    });
    
    return Object.values(grouped);
  };
  
  const monthGroups = groupDatesByMonth();
  
  return (
    <div className="date-selector" onMouseUp={handleMouseUp}>
      <div className="selector-header">
        <h4>📅 날짜 선택</h4>
        <div className="selector-instructions">
          <p>• 클릭: 단일 선택/해제</p>
          <p>• 드래그: 범위 선택</p>
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
      
      <div className="calendar-container">
        {monthGroups.map(monthGroup => (
          <div key={`${monthGroup.year}-${monthGroup.month}`} className="month-section">
            <div className="month-header">
              <h5>
                {monthGroup.year}년 {monthGroup.month + 1}월
              </h5>
            </div>
            
            <div className="calendar-grid">
              <div className="weekday-headers">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="weekday-header">{day}</div>
                ))}
              </div>
              
              <div className="date-grid">
                {/* 첫 번째 날짜까지의 빈 칸 */}
                {Array.from({ 
                  length: new Date(monthGroup.year, monthGroup.month, 1).getDay() 
                }, (_, i) => (
                  <div key={`empty-${i}`} className="empty-date"></div>
                ))}
                
                {/* 실제 날짜들 */}
                {monthGroup.dates.map(date => {
                  const dateObj = new Date(date);
                  const isSelected = selectedSlots.includes(date);
                  const responseCount = getResponseCount(date);
                  const heatmapIntensity = getHeatmapIntensity(date);
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const isPast = dateObj < new Date().setHours(0, 0, 0, 0);
                  
                  return (
                    <div
                      key={date}
                      className={`date-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                      style={{
                        backgroundColor: showHeatmap && heatmapIntensity > 0 
                          ? `rgba(79, 172, 254, ${0.2 + heatmapIntensity * 0.6})`
                          : undefined
                      }}
                      onMouseDown={() => handleMouseDown(date)}
                      onMouseEnter={() => handleMouseEnter(date)}
                      title={`${dateObj.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}${showHeatmap ? ` (${responseCount}명 선택)` : ''}`}
                    >
                      <span className="date-number">{dateObj.getDate()}</span>
                      {showHeatmap && responseCount > 0 && (
                        <span className="response-count">{responseCount}</span>
                      )}
                      {isSelected && <span className="selection-mark">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selection-stats">
        <p>
          📅 전체 기간: {dates.length}일 | 
          ✅ 선택됨: {selectedSlots.length}일
          {showHeatmap && (
            <> | 👥 총 응답자: {Object.keys(responses).length}명</>
          )}
        </p>
      </div>
    </div>
  );
};

export default DateSelector;