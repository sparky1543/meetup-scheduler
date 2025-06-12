import React from 'react';
import Button from '../common/Button';

const EventList = ({ group, onCreateEvent }) => {
  // TODO: 실제 약속 데이터 연동 (다음 단계에서 구현)
  const events = []; // 현재는 빈 배열

  return (
    <div className="event-list-section">
      <div className="section-header">
        <h3>📅 약속 목록 ({events.length}개)</h3>
        <Button
          onClick={onCreateEvent}
          variant="primary"
          className="create-event-btn"
        >
          ➕ 새 약속 만들기
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="empty-events">
          <div className="empty-icon">📅</div>
          <h4>아직 약속이 없어요</h4>
          <p>새로운 약속을 만들어서 일정을 조율해보세요!</p>
          
          <Button
            onClick={onCreateEvent}
            variant="primary"
            className="create-first-event-btn"
          >
            🌟 첫 약속 만들기
          </Button>
        </div>
      ) : (
        <div className="event-list">
          {/* TODO: 약속 카드들 표시 */}
        </div>
      )}
    </div>
  );
};

export default EventList;