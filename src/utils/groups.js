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

  // 특정 모임 정보 가져오기
  export const getGroupById = (groupId) => {
    const allGroups = getGroupsFromStorage();
    return allGroups[groupId] || null;
  };
  
  // 모임에 멤버 추가
  export const addMemberToGroup = (groupId, userId, userNickname) => {
    const allGroups = getGroupsFromStorage();
    const group = allGroups[groupId];
    
    if (!group) {
      throw new Error('존재하지 않는 모임입니다.');
    }
    
    if (group.members[userId]) {
      throw new Error('이미 모임에 참여중입니다.');
    }
    
    group.members[userId] = {
      nickname: userNickname,
      role: 'member',
      joinedAt: new Date().toISOString()
    };
    
    allGroups[groupId] = group;
    saveGroupsToStorage(allGroups);
    
    return group;
  };
  
  // 모임에서 멤버 제거
  export const removeMemberFromGroup = (groupId, userId, requesterId) => {
    const allGroups = getGroupsFromStorage();
    const group = allGroups[groupId];
    
    if (!group) {
      throw new Error('존재하지 않는 모임입니다.');
    }
    
    // 모임장이거나 본인인 경우만 제거 가능
    const isOwner = group.createdBy === requesterId;
    const isSelf = userId === requesterId;
    
    if (!isOwner && !isSelf) {
      throw new Error('멤버를 제거할 권한이 없습니다.');
    }
    
    // 모임장은 제거할 수 없음
    if (userId === group.createdBy) {
      throw new Error('모임장은 모임을 나갈 수 없습니다.');
    }
    
    delete group.members[userId];
    allGroups[groupId] = group;
    saveGroupsToStorage(allGroups);
    
    return group;
  };
  
  // 초대 링크 생성
  export const generateInviteLink = (groupId) => {
    // 실제 배포시에는 실제 도메인 사용
    const baseUrl = window.location.origin;
    return `${baseUrl}?groupId=${groupId}`;
  };
  
  // 모임 정보 업데이트 (모임장만)
  export const updateGroupInfo = (groupId, updateData, userId) => {
    const allGroups = getGroupsFromStorage();
    const group = allGroups[groupId];
    
    if (!group) {
      throw new Error('존재하지 않는 모임입니다.');
    }
    
    if (group.createdBy !== userId) {
      throw new Error('모임 정보를 수정할 권한이 없습니다.');
    }
    
    // 허용된 필드만 업데이트
    const allowedFields = ['name', 'description'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });
    
    Object.assign(group, filteredData);
    allGroups[groupId] = group;
    saveGroupsToStorage(allGroups);
    
    return group;
  };