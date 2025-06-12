import { useState, useEffect } from 'react';
import { 
  getGroupEvents, 
  createEvent, 
  deleteEvent 
} from '../services/eventService';

export const useFirebaseEvents = (groupId, user, groupOwnerId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 약속 목록 새로고침
  const refreshEvents = async () => {
    if (!groupId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const groupEvents = await getGroupEvents(groupId);
      setEvents(groupEvents);
    } catch (err) {
      setError(err.message || '약속 목록을 불러오는데 실패했습니다.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, [groupId]);

  // 약속 생성
  const handleCreateEvent = async (eventData) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      setError('');
      const newEvent = await createEvent(eventData, groupId, user.uid, user.nickname);
      await refreshEvents(); // 목록 새로고침
      return newEvent;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // 약속 삭제
  const handleDeleteEvent = async (eventId) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      setError('');
      await deleteEvent(eventId, user.uid, groupOwnerId);
      await refreshEvents(); // 목록 새로고침
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent: handleCreateEvent,
    deleteEvent: handleDeleteEvent,
    refreshEvents
  };
};