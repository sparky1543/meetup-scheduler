import { useState, useEffect } from 'react';
import { 
  getGroupById, 
  addMemberToGroup, 
  removeMemberFromGroup,
  updateGroup,
  isUserInGroup
} from '../services/groupService';

export const useFirebaseGroupMembers = (groupId, currentUser) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 모임 정보 새로고침
  const refreshGroup = async () => {
    if (!groupId) {
      setGroup(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
    } catch (err) {
      setError(err.message || '모임 정보를 불러오는데 실패했습니다.');
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshGroup();
  }, [groupId]);

  // 멤버 추가
  const addMember = async (userId, userNickname) => {
    try {
      setError('');
      const updatedGroup = await addMemberToGroup(groupId, userId, userNickname);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 멤버 제거
  const removeMember = async (userId) => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setError('');
      const updatedGroup = await removeMemberFromGroup(groupId, userId, currentUser.uid);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 모임 정보 업데이트
  const updateGroupInfo = async (updateData) => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setError('');
      const updatedGroup = await updateGroup(groupId, updateData, currentUser.uid);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 권한 체크
  const isOwner = group && currentUser && group.createdBy === currentUser.uid;
  const isMember = group && currentUser && isUserInGroup(group, currentUser.uid);

  return {
    group,
    loading,
    error,
    isOwner,
    isMember,
    addMember,
    removeMember,
    updateGroup: updateGroupInfo,
    refreshGroup
  };
};