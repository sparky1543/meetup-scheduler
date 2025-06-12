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
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const allGroups = getGroupsFromStorage();
    const userGroups = getUserGroups(allGroups, user.uid);
    setGroups(userGroups);
    setLoading(false);
  };

  // 컴포넌트 마운트 시 모임 목록 로드
  useEffect(() => {
    refreshGroups();
  }, [user]);

  // 모임 생성
  const handleCreateGroup = async (groupData) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      const newGroup = createGroup(groupData, user.uid, user.nickname);
      refreshGroups(); // 목록 새로고침
      return newGroup;
    } catch (error) {
      throw error;
    }
  };

  // 모임 삭제
  const handleDeleteGroup = async (groupId) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      await deleteGroup(groupId, user.uid);
      refreshGroups(); // 목록 새로고침
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