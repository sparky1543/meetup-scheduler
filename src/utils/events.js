// 랜덤 이벤트 ID 생성 (8자리 영숫자)
export const generateEventId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 로컬스토리지에서 약속 데이터 가져오기
  export const getEventsFromStorage = () => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : {};
  };
  
  // 로컬스토리지에 약속 데이터 저장
  export const saveEventsToStorage = (events) => {
    localStorage.setItem('events', JSON.stringify(events));
  };
  
  // 특정 모임의 약속들 가져오기
  export const getGroupEvents = (groupId) => {
    const allEvents = getEventsFromStorage();
    return Object.values(allEvents).filter(event => event.groupId === groupId);
  };
  
  // 약속 생성
  export const createEvent = (eventData, groupId, userId, userNickname) => {
    const eventId = generateEventId();
    const now = new Date().toISOString();
    
    const newEvent = {
      id: eventId,
      groupId: groupId,
      name: eventData.name,
      description: eventData.description || '',
      type: eventData.type, // 'date' or 'time'
      dateRange: eventData.dateRange,
      timeRange: eventData.timeRange || null, // time 타입일 때만
      createdBy: userId,
      createdAt: now,
      responses: {} // 사용자별 선택한 슬롯들
    };
    
    const allEvents = getEventsFromStorage();
    allEvents[eventId] = newEvent;
    saveEventsToStorage(allEvents);
    
    return newEvent;
  };
  
  // 약속 삭제
  export const deleteEvent = (eventId, userId, groupOwnerId) => {
    const allEvents = getEventsFromStorage();
    const event = allEvents[eventId];
    
    if (!event) {
      throw new Error('존재하지 않는 약속입니다.');
    }
    
    // 약속 생성자이거나 모임장인 경우만 삭제 가능
    if (event.createdBy !== userId && groupOwnerId !== userId) {
      throw new Error('약속을 삭제할 권한이 없습니다.');
    }
    
    delete allEvents[eventId];
    saveEventsToStorage(allEvents);
    
    return true;
  };
  
  // 날짜 범위 유효성 검증
  export const validateDateRange = (startDate, endDate, type) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      return { valid: false, error: '시작일은 오늘 이후여야 합니다.' };
    }
    
    if (start >= end) {
      return { valid: false, error: '종료일은 시작일 이후여야 합니다.' };
    }
    
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (type === 'date' && daysDiff > 365) {
      return { valid: false, error: '날짜 선택 타입은 최대 1년까지 가능합니다.' };
    }
    
    if (type === 'time' && daysDiff > 14) {
      return { valid: false, error: '시간 선택 타입은 최대 2주까지 가능합니다.' };
    }
    
    return { valid: true };
  };
  
  // 시간 범위 유효성 검증
  export const validateTimeRange = (startTime, endTime) => {
    if (startTime >= endTime) {
      return { valid: false, error: '종료 시간은 시작 시간 이후여야 합니다.' };
    }
    
    return { valid: true };
  };
  
  // 날짜 배열 생성 (달력용)
  export const generateDateArray = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };
  
  // 시간 슬롯 배열 생성 (시간표용)
  export const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }
    
    return slots;
  };
  
  // 날짜와 시간 조합 슬롯 생성
  export const generateDateTimeSlots = (dateRange, timeRange) => {
    const dates = generateDateArray(dateRange.start, dateRange.end);
    const times = generateTimeSlots(timeRange.start, timeRange.end);
    
    const slots = [];
    dates.forEach(date => {
      times.forEach(time => {
        slots.push(`${date}T${time}`);
      });
    });
    
    return slots;
  };