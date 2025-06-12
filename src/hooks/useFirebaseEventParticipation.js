import { useState, useEffect } from 'react';
import { 
  getEventById, 
  saveEventResponse,
  getUserEventResponse,
  getEventResponses,
  calculateOptimalTimes
} from '../services/eventService';

export const useFirebaseEventParticipation = (eventId, user) => {
  const [event, setEvent] = useState(null);
  const [userResponse, setUserResponse] = useState(null);
  const [allResponses, setAllResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 이벤트 및 응답 데이터 로드
  const loadEventData = async () => {
    if (!eventId) {
      setError('약속 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 이벤트 정보 조회
      const eventData = await getEventById(eventId);
      setEvent(eventData);

      // 모든 응답 조회
      const responses = await getEventResponses(eventId);
      setAllResponses(responses);

      // 현재 사용자 응답 조회
      if (user && responses[user.uid]) {
        setUserResponse(responses[user.uid]);
      }

    } catch (err) {
      setError(err.message || '약속 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
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
      setError('');
      
      const responseData = await saveEventResponse(
        eventId, 
        user.uid, 
        user.nickname, 
        selectedSlots
      );
      
      // 로컬 상태 업데이트
      setUserResponse(responseData);
      setAllResponses(prev => ({
        ...prev,
        [user.uid]: responseData
      }));
      
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // 최적 시간대 계산
  const getOptimalTimes = () => {
    return calculateOptimalTimes(allResponses);
  };

  // 응답 데이터 새로고침 (실시간 업데이트용)
  const refreshResponses = async () => {
    try {
      const responses = await getEventResponses(eventId);
      setAllResponses(responses);
      
      if (user && responses[user.uid]) {
        setUserResponse(responses[user.uid]);
      }
    } catch (error) {
      console.error('응답 데이터 새로고침 오류:', error);
    }
  };

  return {
    event,
    userResponse,
    allResponses,
    loading,
    error,
    saveResponse,
    getOptimalTimes,
    refreshResponses
  };
};