import { useState, useEffect } from 'react';
import { 
  getGroupEvents, 
  createEvent, 
  deleteEvent 
} from '../utils/events';

export const useEvents = (groupId, user, groupOwnerId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 약속 목록 새로고침
  const refreshEvents = () => {
    if (!groupId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      const groupEvents = getGroupEvents(groupId);
      setEvents(groupEvents);
    } catch (error) {
      console.error('약속 목록 로드 실패:', error);
      setEvents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, [groupId]);

  // 약속 생성
  const handleCreateEvent = async (eventData) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      const newEvent = createEvent(eventData, groupId, user.uid, user.nickname);
      refreshEvents();
      return newEvent;
    } catch (error) {
      throw error;
    }
  };

  // 약속 삭제
  const handleDeleteEvent = async (eventId) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      await deleteEvent(eventId, user.uid, groupOwnerId);
      refreshEvents();
      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    events,
    loading,
    createEvent: handleCreateEvent,
    deleteEvent: handleDeleteEvent,
    refreshEvents
  };
};