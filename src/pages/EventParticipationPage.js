import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import BackButton from '../components/navigation/BackButton';
import DateSelector from '../components/participation/DateSelector';
import TimeSelector from '../components/participation/TimeSelector';
import ParticipationStats from '../components/participation/ParticipationStats';
import Button from '../components/common/Button';
import { useEventParticipation } from '../hooks/useEventParticipation';
import { useGroupMembers } from '../hooks/useGroupMembers';

const EventParticipationPage = ({ user, onLogout }) => {
  const { groupId, eventId } = useParams();
  const navigate = useNavigate();
  
  const { group, isMember } = useGroupMembers(groupId, user);
  const { 
    event, 
    userResponse, 
    allResponses, 
    loading, 
    error, 
    saveResponse,
    getOptimalTimes 
  } = useEventParticipation(eventId, user);
  
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 사용자의 기존 응답 로드
  useEffect(() => {
    if (userResponse && userResponse.selectedSlots) {
      setSelectedSlots(userResponse.selectedSlots);
    }
  }, [userResponse]);

  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      alert('최소 하나의 시간대를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveResponse(selectedSlots);
      alert('응답이 저장되었습니다! 🎉');
    } catch (error) {
      alert(`저장 실패: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  const handleBack = () => {
    navigate(`/groups/${groupId}`);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  if (loading) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="loading">
            <div className="spinner"></div>
            <p>약속 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event || !group) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="error-page">
            <div className="error-icon">😕</div>
            <h2>약속을 찾을 수 없어요</h2>
            <p>{error || '존재하지 않는 약속이거나 접근 권한이 없습니다.'}</p>
            <Button onClick={() => navigate('/groups')} variant="primary">
              모임 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isMember) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="access-denied">
            <div className="denied-icon">🔒</div>
            <h2>모임 멤버만 참여 가능해요</h2>
            <p>이 약속은 모임 멤버만 참여할 수 있습니다.</p>
            <Button onClick={() => navigate('/groups')} variant="primary">
              모임 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const responseCount = Object.keys(allResponses).length;
  const hasResponded = !!userResponse;

  return (
    <Layout>
      <Header title="🏝️ 모임 스케줄러" />
      
      <div className="content">
        <div className="participation-header">
          <BackButton onClick={handleBack}>모임으로 돌아가기</BackButton>
          
          <div className="event-info-card">
            <h1>{event.name}</h1>
            {event.description && <p className="event-description">{event.description}</p>}
            
            <div className="event-meta">
              <span className="event-type">
                {event.type === 'date' ? '📅 날짜 선택' : '⏰ 시간 선택'}
                </span>
             <span className="event-period">
               {new Date(event.dateRange.start).toLocaleDateString('ko-KR')} ~ {' '}
               {new Date(event.dateRange.end).toLocaleDateString('ko-KR')}
             </span>
             {event.type === 'time' && event.timeRange && (
               <span className="event-time">
                 {event.timeRange.start} ~ {event.timeRange.end}
               </span>
             )}
           </div>
           
           <div className="response-info">
             <span className="response-count">👥 {responseCount}명 응답</span>
             {hasResponded && <span className="responded-badge">✅ 응답 완료</span>}
           </div>
         </div>
       </div>

       <div className="participation-content">
         {/* 결과 보기/숨기기 토글 */}
         <div className="results-toggle">
           <Button
             onClick={toggleResults}
             variant="secondary"
             className="toggle-results-btn"
           >
             {showResults ? '📊 결과 숨기기' : '📊 결과 보기'}
           </Button>
         </div>

         {/* 결과 통계 (토글시 표시) */}
         {showResults && (
           <ParticipationStats
             event={event}
             responses={allResponses}
             optimalTimes={getOptimalTimes()}
           />
         )}

         {/* 선택 인터페이스 */}
         <div className="selection-section">
           <div className="section-header">
             <h3>
               {hasResponded ? '🔄 응답 수정하기' : '✨ 가능한 시간 선택하기'}
             </h3>
             <p>
               {event.type === 'date' 
                 ? '가능한 날짜들을 클릭해서 선택해주세요' 
                 : '가능한 날짜와 시간을 선택해주세요'
               }
             </p>
           </div>

           {event.type === 'date' ? (
             <DateSelector
               event={event}
               selectedSlots={selectedSlots}
               onSlotToggle={handleSlotToggle}
               responses={showResults ? allResponses : {}}
               showHeatmap={showResults}
             />
           ) : (
             <TimeSelector
               event={event}
               selectedSlots={selectedSlots}
               onSlotToggle={handleSlotToggle}
               responses={showResults ? allResponses : {}}
               showHeatmap={showResults}
             />
           )}
         </div>

         {/* 선택된 시간대 요약 */}
         {selectedSlots.length > 0 && (
           <div className="selection-summary">
             <h4>선택된 시간대 ({selectedSlots.length}개)</h4>
             <div className="selected-slots">
               {selectedSlots.slice(0, 5).map(slot => (
                 <span key={slot} className="selected-slot">
                   {event.type === 'date' 
                     ? new Date(slot).toLocaleDateString('ko-KR', { 
                         month: 'short', 
                         day: 'numeric',
                         weekday: 'short'
                       })
                     : `${new Date(slot).toLocaleDateString('ko-KR', { 
                         month: 'short', 
                         day: 'numeric' 
                       })} ${slot.split('T')[1]}`
                   }
                 </span>
               ))}
               {selectedSlots.length > 5 && (
                 <span className="more-slots">+{selectedSlots.length - 5}개 더</span>
               )}
             </div>
           </div>
         )}

         {/* 제출 버튼 */}
         <div className="submit-section">
           <Button
             onClick={handleSubmit}
             disabled={isSubmitting || selectedSlots.length === 0}
             className="submit-response-btn"
           >
             {isSubmitting 
               ? '저장 중...' 
               : hasResponded 
                 ? '🔄 응답 수정하기' 
                 : '💾 응답 저장하기'
             }
           </Button>
           
           <p className="submit-help">
             {selectedSlots.length === 0 
               ? '시간대를 선택한 후 저장할 수 있습니다'
               : `${selectedSlots.length}개 시간대가 선택되었습니다`
             }
           </p>
         </div>
       </div>
     </div>
   </Layout>
 );
};

export default EventParticipationPage;