import { useState, useEffect } from 'react';
import { 
  getGroupsFromStorage, 
  getUserGroups, 
  createGroup, 
  deleteGroup 
} from '../utils/groups';

export const useGroups = (user) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // 모임 목록 새로고침
    const refreshGroups = () => {
      if (!user || !user.uid) { // user가 null이거나 uid가 없는 경우 처리
        setGroups([]);
        setLoading(false);
        return;
      }
  
      const allGroups = getGroupsFromStorage();
      const userGroups = getUserGroups(allGroups, user.uid);
      setGroups(userGroups);
      setLoading(false);
    };
  
    useEffect(() => {
      refreshGroups();
    }, [user]); // user 변경 시 실행
  
    // 모임 생성
    const handleCreateGroup = async (groupData) => {
      if (!user || !user.uid) throw new Error('로그인이 필요합니다.');
      
      try {
        const newGroup = createGroup(groupData, user.uid, user.nickname);
        refreshGroups();
        return newGroup;
      } catch (error) {
        throw error;
      }
    };
  
    // 모임 삭제
    const handleDeleteGroup = async (groupId) => {
      if (!user || !user.uid) throw new Error('로그인이 필요합니다.');
      
      try {
        await deleteGroup(groupId, user.uid);
        refreshGroups();
        return true;
      } catch (error) {
        throw error;
      }
    };
  
    return {
      groups,
      loading,
      createGroup: handleCreateGroup,
      deleteGroup: handleDeleteGroup,
      refreshGroups
    };
  };