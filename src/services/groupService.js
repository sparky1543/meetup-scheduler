import { 
    collection, 
    doc, 
    setDoc, 
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
  
  // 모임 생성
  export const createGroup = async (groupData, userId, userNickname) => {
    try {
      const groupId = generateId();
      const now = serverTimestamp();
      
      const newGroup = {
        id: groupId,
        name: groupData.name,
        description: groupData.description || '',
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
        members: {
          [userId]: {
            nickname: userNickname,
            role: 'owner',
            joinedAt: now
          }
        }
      };
      
      const groupRef = doc(db, 'groups', groupId);
      await setDoc(groupRef, newGroup);
      
      return { id: groupId, ...newGroup };
    } catch (error) {
      console.error('모임 생성 오류:', error);
      throw new Error('모임 생성에 실패했습니다.');
    }
  };
  
  // 사용자가 속한 모임 목록 조회
  export const getUserGroups = async (userId) => {
    try {
      const groupsRef = collection(db, 'groups');
      const querySnapshot = await getDocs(groupsRef);
      
      const userGroups = [];
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        if (groupData.members && groupData.members[userId]) {
          userGroups.push({ id: doc.id, ...groupData });
        }
      });
      
      // 생성일 기준 내림차순 정렬
      userGroups.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bTime - aTime;
      });
      
      return userGroups;
    } catch (error) {
      console.error('모임 목록 조회 오류:', error);
      throw new Error('모임 목록을 불러올 수 없습니다.');
    }
  };
  
  // 특정 모임 정보 조회
  export const getGroupById = async (groupId) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (groupSnap.exists()) {
        return { id: groupSnap.id, ...groupSnap.data() };
      }
      
      throw new Error('존재하지 않는 모임입니다.');
    } catch (error) {
      console.error('모임 조회 오류:', error);
      throw error;
    }
  };
  
  // 모임 정보 업데이트 (모임장만 가능)
  export const updateGroup = async (groupId, updateData, userId) => {
    try {
      const group = await getGroupById(groupId);
      
      if (group.createdBy !== userId) {
        throw new Error('모임 정보를 수정할 권한이 없습니다.');
      }
      
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return await getGroupById(groupId);
    } catch (error) {
      console.error('모임 업데이트 오류:', error);
      throw error;
    }
  };
  
  // 모임 삭제 (모임장만 가능)
  export const deleteGroup = async (groupId, userId) => {
    try {
      const group = await getGroupById(groupId);
      
      if (group.createdBy !== userId) {
        throw new Error('모임을 삭제할 권한이 없습니다.');
      }
      
      // 모임의 모든 이벤트도 삭제
      await deleteGroupEvents(groupId);
      
      // 모임 삭제
      const groupRef = doc(db, 'groups', groupId);
      await deleteDoc(groupRef);
      
      return true;
    } catch (error) {
      console.error('모임 삭제 오류:', error);
      throw error;
    }
  };
  
  // 모임에 멤버 추가
  export const addMemberToGroup = async (groupId, userId, userNickname) => {
    try {
      const group = await getGroupById(groupId);
      
      if (group.members[userId]) {
        throw new Error('이미 모임에 참여 중입니다.');
      }
      
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        [`members.${userId}`]: {
          nickname: userNickname,
          role: 'member',
          joinedAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });
      
      return await getGroupById(groupId);
    } catch (error) {
      console.error('멤버 추가 오류:', error);
      throw error;
    }
  };
  
  // 모임에서 멤버 제거
  export const removeMemberFromGroup = async (groupId, targetUserId, requesterId) => {
    try {
      const group = await getGroupById(groupId);
      
      // 권한 확인: 모임장이거나 본인인 경우만 가능
      const isOwner = group.createdBy === requesterId;
      const isSelf = targetUserId === requesterId;
      
      if (!isOwner && !isSelf) {
        throw new Error('멤버를 제거할 권한이 없습니다.');
      }
      
      // 모임장은 제거할 수 없음
      if (targetUserId === group.createdBy) {
        throw new Error('모임장은 모임을 나갈 수 없습니다.');
      }
      
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        [`members.${targetUserId}`]: null, // Firestore에서 필드 삭제
        updatedAt: serverTimestamp()
      });
      
      return await getGroupById(groupId);
    } catch (error) {
      console.error('멤버 제거 오류:', error);
      throw error;
    }
  };
  
  // 모임의 모든 이벤트 삭제 (모임 삭제시 사용)
  const deleteGroupEvents = async (groupId) => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('groupId', '==', groupId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('모임 이벤트 삭제 오류:', error);
    }
  };
  
  // 모임 멤버 수 계산
  export const getMemberCount = (group) => {
    return Object.keys(group.members || {}).length;
  };
  
  // 초대 링크 생성
  export const generateInviteLink = (groupId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/join/${groupId}`;
  };
  
  // 초대 링크 유효성 검증
  export const validateInviteLink = async (groupId) => {
    try {
      const group = await getGroupById(groupId);
      return { valid: true, group };
    } catch (error) {
      return { 
        valid: false, 
        error: '존재하지 않거나 삭제된 모임입니다.' 
      };
    }
  };
  
  // 사용자가 모임 멤버인지 확인
  export const isUserInGroup = (group, userId) => {
    return group && group.members && group.members[userId];
  };
  
  // 초대 통계 정보
  export const getInviteStats = (group) => {
    if (!group) return null;
    
    const ownerMember = Object.values(group.members).find(member => member.role === 'owner');
    
    return {
      memberCount: getMemberCount(group),
      createdDate: group.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') || 'Unknown',
      ownerName: ownerMember?.nickname || 'Unknown'
    };
  };
  
  // 모임의 약속 개수 조회 - 순환 참조 해결을 위해 직접 구현
  export const getGroupEventCount = async (groupId) => {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('groupId', '==', groupId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.size; // 문서 개수 반환
    } catch (error) {
      console.error('약속 개수 조회 오류:', error);
      return 0;
    }
  };