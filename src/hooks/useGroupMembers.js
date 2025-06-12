import { useState, useEffect } from 'react';
import { 
  getGroupById, 
  addMemberToGroup, 
  removeMemberFromGroup,
  updateGroupInfo
} from '../utils/groups';

export const useGroupMembers = (groupId, currentUser) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 모임 정보 새로고침
  const refreshGroup = () => {
    if (!groupId) {
      setGroup(null);
      setLoading(false);
      return;
    }

    try {
      const groupData = getGroupById(groupId);
      setGroup(groupData);
      setError('');
    } catch (err) {
      setError(err.message);
      setGroup(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshGroup();
  }, [groupId]);

  // 멤버 추가
  const addMember = async (userId, userNickname) => {
    try {
      setError('');
      const updatedGroup = addMemberToGroup(groupId, userId, userNickname);
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
      const updatedGroup = removeMemberFromGroup(groupId, userId, currentUser.uid);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 모임 정보 업데이트
  const updateGroup = async (updateData) => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      setError('');
      const updatedGroup = updateGroupInfo(groupId, updateData, currentUser.uid);
      setGroup(updatedGroup);
      return updatedGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // 권한 체크
  const isOwner = group && currentUser && group.createdBy === currentUser.uid;
  const isMember = group && currentUser && group.members[currentUser.uid];

  return {
    group,
    loading,
    error,
    isOwner,
    isMember,
    addMember,
    removeMember,
    updateGroup,
    refreshGroup
  };
};