import React from 'react';

const ParticipationStats = ({ event, responses, optimalTimes }) => {
  const totalResponders = Object.keys(responses).length;
  
  if (totalResponders === 0) {
    return (
      <div className="participation-stats">
        <div className="stats-header">
          <h4>📊 참여 현황</h4>
        </div>
        <div className="no-responses">
          <p>아직 응답한 참가자가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 상위 5개 인기 시간대
  const topTimes = optimalTimes.slice(0, 5);
  
  // 응답자 목록
  const respondersList = Object.entries(responses).map(([uid, response]) => ({
    uid,
    nickname: response.nickname,
    respondedAt: response.respondedAt,
    slotsCount: response.selectedSlots ? response.selectedSlots.length : 0
  }));

  return (
    <div className="participation-stats">
      <div className="stats-header">
        <h4>📊 참여 현황 ({totalResponders}명 응답)</h4>
      </div>
      
      {/* 최적 시간대 */}
      <div className="optimal-times-section">
        <h5>🎯 인기 시간대 TOP 5</h5>
        {topTimes.length > 0 ? (
          <div className="optimal-times-list">
            {topTimes.map((timeData, index) => {
              const { slot, count, percentage } = timeData;
              let displayTime;
              
              if (event.type === 'date') {
                displayTime = new Date(slot).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short'
                });
              } else {
                const [date, time] = slot.split('T');
                displayTime = `${new Date(date).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric'
                })} ${time}`;
              }
              
              return (
                <div key={slot} className="optimal-time-item">
                  <div className="rank-badge">{index + 1}</div>
                  <div className="time-info">
                    <span className="time-text">{displayTime}</span>
                    <span className="time-stats">{count}명 ({percentage}%)</span>
                  </div>
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-data">아직 충분한 데이터가 없습니다.</p>
        )}
      </div>
      
      {/* 응답자 목록 */}
      <div className="responders-section">
        <h5>👥 응답자 목록</h5>
        <div className="responders-list">
          {respondersList.map(responder => (
            <div key={responder.uid} className="responder-item">
              <div className="responder-info">
                <span className="responder-name">{responder.nickname}</span>
                <span className="responder-stats">
                  {responder.slotsCount}개 시간대 선택
                </span>
              </div>
              <div className="responded-time">
                {new Date(responder.respondedAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 요약 통계 */}
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">총 응답자</span>
          <span className="stat-value">{totalResponders}명</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">최고 인기도</span>
          <span className="stat-value">
            {topTimes.length > 0 ? `${topTimes[0].percentage}%` : '0%'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">평균 선택 수</span>
          <span className="stat-value">
            {Math.round(respondersList.reduce((sum, r) => sum + r.slotsCount, 0) / totalResponders)}개
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipationStats;