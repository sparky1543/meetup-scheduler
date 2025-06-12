import { useState, useEffect } from 'react';
import { 
  getUserGroups, 
  createGroup, 
  deleteGroup,
  getGroupEventCount
} from '../services/groupService';

export const useFirebaseGroups = (user) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 모임 목록 새로고침
  const refreshGroups = async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const userGroups = await getUserGroups(user.uid);
      
      // 각 모임의 약속 개수도 함께 로드
      const groupsWithEventCount = await Promise.all(
        userGroups.map(async (group) => {
          try {
            const eventCount = await getGroupEventCount(group.id);
            return { ...group, eventCount };
          } catch (error) {
            console.error(`모임 ${group.id}의 약속 개수 조회 실패:`, error);
            return { ...group, eventCount: 0 };
          }
        })
      );
      
      setGroups(groupsWithEventCount);
    } catch (err) {
      setError(err.message || '모임 목록을 불러오는데 실패했습니다.');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshGroups();
  }, [user]);

  // 모임 생성
  const handleCreateGroup = async (groupData) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      setError('');
      const newGroup = await createGroup(groupData, user.uid, user.nickname);
      await refreshGroups(); // 목록 새로고침
      return newGroup;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // 모임 삭제
  const handleDeleteGroup = async (groupId) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    
    try {
      setError('');
      await deleteGroup(groupId, user.uid);
      await refreshGroups(); // 목록 새로고침
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    groups,
    loading,
    error,
    createGroup: handleCreateGroup,
    deleteGroup: handleDeleteGroup,
    refreshGroups
  };
};