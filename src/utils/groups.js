// 랜덤 그룹 ID 생성 (8자리 영숫자)
export const generateGroupId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 로컬스토리지에서 모임 데이터 가져오기
  export const getGroupsFromStorage = () => {
    const groups = localStorage.getItem('groups');
    return groups ? JSON.parse(groups) : {};
  };
  
  // 로컬스토리지에 모임 데이터 저장
  export const saveGroupsToStorage = (groups) => {
    localStorage.setItem('groups', JSON.stringify(groups));
  };
  
  // 사용자가 속한 모임들 필터링
  export const getUserGroups = (allGroups, userId) => {
    return Object.values(allGroups).filter(group => 
      group.members && group.members[userId]
    );
  };
  
  // 모임 생성
  export const createGroup = (groupData, userId, userNickname) => {
    const groupId = generateGroupId();
    const now = new Date().toISOString();
    
    const newGroup = {
      id: groupId,
      name: groupData.name,
      description: groupData.description || '',
      createdBy: userId,
      createdAt: now,
      members: {
        [userId]: {
          nickname: userNickname,
          role: 'owner',
          joinedAt: now
        }
      }
    };
    
    const allGroups = getGroupsFromStorage();
    allGroups[groupId] = newGroup;
    saveGroupsToStorage(allGroups);
    
    return newGroup;
  };
  
  // 모임 삭제 (모임장만 가능)
  export const deleteGroup = (groupId, userId) => {
    const allGroups = getGroupsFromStorage();
    const group = allGroups[groupId];
    
    if (!group || group.createdBy !== userId) {
      throw new Error('모임을 삭제할 권한이 없습니다.');
    }
    
    delete allGroups[groupId];
    saveGroupsToStorage(allGroups);
    
    return true;
  };
  
  // 모임 멤버 수 계산
  export const getMemberCount = (group) => {
    return Object.keys(group.members || {}).length;
  };
  
  // 모임 약속 수 계산 (현재는 0, 나중에 구현)
  export const getEventCount = (group) => {
    return 0; // TODO: 약속 기능 구현 후 실제 개수 반환
  };