import { 
    collection, 
    doc, 
    setDoc, // 추가됨
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { generateId } from '../utils/firestoreUtils';
  
  // 약속 생성
  export const createEvent = async (eventData, groupId, userId, userNickname) => {
    try {
      const eventId = generateId();
      const now = serverTimestamp();
      
      const newEvent = {
        id: eventId,
        groupId: groupId,
        name: eventData.name,
        description: eventData.description || '',
        type: eventData.type, // 'date' or 'time'
        dateRange: eventData.dateRange,
        timeRange: eventData.timeRange || null,
        createdBy: userId,
        createdByNickname: userNickname,
        createdAt: now,
        updatedAt: now,
        responses: {} // 사용자별 응답
      };
      
      const eventRef = doc(db, 'events', eventId);
      await setDoc(eventRef, newEvent);
      
      return { id: eventId, ...newEvent };
    } catch (error) {
      console.error('약속 생성 오류:', error);
      throw new Error('약속 생성에 실패했습니다.');
    }
  };
  
  // 모임의 약속 목록 조회
  export const getGroupEvents = async (groupId) => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef, 
        where('groupId', '==', groupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      
      return events;
    } catch (error) {
      console.error('약속 목록 조회 오류:', error);
      throw new Error('약속 목록을 불러올 수 없습니다.');
    }
  };
  
  // 특정 약속 조회
  export const getEventById = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        return { id: eventSnap.id, ...eventSnap.data() };
      }
      
      throw new Error('존재하지 않는 약속입니다.');
    } catch (error) {
      console.error('약속 조회 오류:', error);
      throw error;
    }
  };
  
  // 약속 삭제 (생성자 또는 모임장만 가능)
  export const deleteEvent = async (eventId, userId, groupOwnerId) => {
    try {
      const event = await getEventById(eventId);
      
      // 권한 확인: 약속 생성자이거나 모임장인 경우만 삭제 가능
      if (event.createdBy !== userId && groupOwnerId !== userId) {
        throw new Error('약속을 삭제할 권한이 없습니다.');
      }
      
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      
      return true;
    } catch (error) {
      console.error('약속 삭제 오류:', error);
      throw error;
    }
  };
  
  // 약속에 응답 저장
  export const saveEventResponse = async (eventId, userId, userNickname, selectedSlots) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      
      const responseData = {
        selectedSlots: selectedSlots,
        nickname: userNickname,
        respondedAt: serverTimestamp()
      };
      
      await updateDoc(eventRef, {
        [`responses.${userId}`]: responseData,
        updatedAt: serverTimestamp()
      });
      
      return responseData;
    } catch (error) {
      console.error('응답 저장 오류:', error);
      throw new Error('응답 저장에 실패했습니다.');
    }
  };
  
  // 사용자의 약속 응답 조회
  export const getUserEventResponse = async (eventId, userId) => {
    try {
      const event = await getEventById(eventId);
      return event.responses?.[userId] || null;
    } catch (error) {
      console.error('응답 조회 오류:', error);
      return null;
    }
  };
  
  // 약속의 모든 응답 조회
  export const getEventResponses = async (eventId) => {
    try {
      const event = await getEventById(eventId);
      return event.responses || {};
    } catch (error) {
      console.error('응답 목록 조회 오류:', error);
      return {};
    }
  };
  
  // 최적 시간대 계산
  export const calculateOptimalTimes = (responses) => {
    if (!responses || Object.keys(responses).length === 0) {
      return [];
    }
  
    const slotCounts = {};
    const totalResponders = Object.keys(responses).length;
  
    // 모든 응답에서 선택된 슬롯 카운트
    Object.values(responses).forEach(response => {
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