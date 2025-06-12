import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { useEvents } from '../../hooks/useEvents';

const EventList = ({ group, user, isOwner }) => {
  const navigate = useNavigate();
  const { events, loading, deleteEvent } = useEvents(group.id, user, group.createdBy);

  const handleCreateEvent = () => {
    navigate(`/groups/${group.id}/create-event`);
  };

  const handleEventClick = (eventId) => {
    // TODO: 약속 상세/참여 페이지로 이동 (다음 단계에서 구현)
    alert(`약속 참여 페이지로 이동: ${eventId}\n(다음 단계에서 구현예정)`);
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`'${eventName}' 약속을 정말 삭제하시겠습니까?`)) {
      try {
        await deleteEvent(eventId);
        alert('약속이 삭제되었습니다.');
      } catch (error) {
        alert(`삭제 실패: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="event-list-section">
        <div className="section-header">
          <h3>📅 약속 목록</h3>
        </div>
        <div className="loading-small">
          <div className="spinner-small"></div>
          <span>약속 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="event-list-section">
      <div className="section-header">
        <h3>📅 약속 목록 ({events.length}개)</h3>
        <Button
          onClick={handleCreateEvent}
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
            onClick={handleCreateEvent}
            variant="primary"
            className="create-first-event-btn"
          >
            🌟 첫 약속 만들기
          </Button>
        </div>
      ) : (
        <div className="event-list">
          {events.map(event => {
            const canDelete = event.createdBy === user.uid || isOwner;
            const responseCount = Object.keys(event.responses || {}).length;
            
            return (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-title" onClick={() => handleEventClick(event.id)}>
                    <h4>{event.name}</h4>
                    <span className="event-type">
                      {event.type === 'date' ? '📅 날짜 선택' : '⏰ 시간 선택'}
                    </span>
                  </div>
                  
                  {canDelete && (
                    <button
                      className="delete-event-btn"
                      onClick={() => handleDeleteEvent(event.id, event.name)}
                      title="약속 삭제"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
                {event.description && (
                  <div className="event-description">
                    <p>{event.description}</p>
                  </div>
                )}
                
                <div className="event-details">
                  <div className="event-period">
                    📆 {new Date(event.dateRange.start).toLocaleDateString('ko-KR')} ~ {' '}
                    {new Date(event.dateRange.end).toLocaleDateString('ko-KR')}
                  </div>
                  
                  {event.type === 'time' && event.timeRange && (
                    <div className="event-time">
                      ⏰ {event.timeRange.start} ~ {event.timeRange.end}
                    </div>
                  )}
                  
                  <div className="event-stats">
                    <span className="response-count">
                      👥 {responseCount}명 응답
                    </span>
                    <span className="created-by">
                      만든이: {event.createdBy === user.uid ? '나' : '멤버'}
                    </span>
                  </div>
                </div>
                
                <div className="event-actions">
                  <Button
                    onClick={() => handleEventClick(event.id)}
                    variant="primary"
                    className="participate-btn"
                  >
                    📊 참여하기
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;