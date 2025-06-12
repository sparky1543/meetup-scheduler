import { useState, useEffect } from 'react';
import { getEventsFromStorage, saveEventsToStorage } from '../utils/events';

export const useEventParticipation = (eventId, user) => {
  const [event, setEvent] = useState(null);
  const [userResponse, setUserResponse] = useState(null);
  const [allResponses, setAllResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 이벤트 및 응답 데이터 로드
  useEffect(() => {
    if (!eventId) {
      setError('약속 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      const allEvents = getEventsFromStorage();
      const eventData = allEvents[eventId];
      
      if (!eventData) {
        setError('존재하지 않는 약속입니다.');
        setLoading(false);
        return;
      }

      setEvent(eventData);
      setAllResponses(eventData.responses || {});
      
      if (user && eventData.responses && eventData.responses[user.uid]) {
        setUserResponse(eventData.responses[user.uid]);
      }

      setError('');
    } catch (err) {
      setError('약속 정보를 불러오는데 실패했습니다.');
    }
    
    setLoading(false);
  }, [eventId, user]);

  // 사용자 응답 저장
  const saveResponse = async (selectedSlots) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!event) {
      throw new Error('약속 정보를 찾을 수 없습니다.');
    }

    try {
      const allEvents = getEventsFromStorage();
      const eventData = allEvents[eventId];
      
      if (!eventData) {
        throw new Error('약속이 존재하지 않습니다.');
      }

      // 응답 데이터 구조
      const responseData = {
        selectedSlots: selectedSlots,
        nickname: user.nickname,
        respondedAt: new Date().toISOString()
      };

      // 이벤트에 응답 추가
      if (!eventData.responses) {
        eventData.responses = {};
      }
      
      eventData.responses[user.uid] = responseData;
      
      // 저장
      allEvents[eventId] = eventData;
      saveEventsToStorage(allEvents);
      
      // 로컬 상태 업데이트
      setUserResponse(responseData);
      setAllResponses(eventData.responses);
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  // 최적 시간대 계산
  const getOptimalTimes = () => {
    if (!event || !allResponses) return [];

    const slotCounts = {};
    const totalResponders = Object.keys(allResponses).length;

    // 모든 응답에서 선택된 슬롯 카운트
    Object.values(allResponses).forEach(response => {
      if (response.selectedSlots) {
        response.selectedSlots.forEach(slot => {
          slotCounts[slot] = (slotCounts[slot] || 0) + 1;
        });
      }
    });

    // 카운트 기준으로 정렬하여 최적 시간 반환
    return Object.entries(slotCounts)
      .map(([slot, count]) => ({
        slot,
        count,
        percentage: Math.round((count / totalResponders) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };

  return {
    event,
    userResponse,
    allResponses,
    loading,
    error,
    saveResponse,
    getOptimalTimes
  };
};