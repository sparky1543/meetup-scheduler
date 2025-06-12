import { useState, useEffect } from 'react';
import { 
  validateInviteLink, 
  isUserInGroup,
  addMemberToGroup,
  getInviteStats
} from '../services/groupService';

export const useFirebaseInvite = (groupId, currentUser) => {
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);

  // 초대 링크 검증 및 데이터 로드
  useEffect(() => {
    const loadInviteData = async () => {
      if (!groupId) {
        setError('초대 링크가 유효하지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        // 초대 링크 유효성 검증
        const validation = await validateInviteLink(groupId);
        
        if (!validation.valid) {
          setError(validation.error);
          setLoading(false);
          return;
        }

        // 모임 정보 및 통계 가져오기
        const group = validation.group;
        const stats = getInviteStats(group);
        
        setInviteData({
          group,
          stats
        });

        // 이미 멤버인지 확인
        if (currentUser) {
          const isMember = isUserInGroup(group, currentUser.uid);
          setIsAlreadyMember(isMember);
        }

      } catch (err) {
        setError(err.message || '초대 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadInviteData();
  }, [groupId, currentUser]);

  // 모임 참여하기
  const joinGroup = async () => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!inviteData?.group) {
      throw new Error('모임 정보를 찾을 수 없습니다.');
    }

    try {
      setError('');
      
      // 이미 멤버인지 다시 한번 확인
      if (isUserInGroup(inviteData.group, currentUser.uid)) {
        setIsAlreadyMember(true);
        return { success: true, alreadyMember: true };
      }

      // 모임에 멤버 추가
      const updatedGroup = await addMemberToGroup(
        groupId, 
        currentUser.uid, 
        currentUser.nickname
      );
      
      // 상태 업데이트
      setInviteData(prev => ({
        ...prev,
        group: updatedGroup,
        stats: getInviteStats(updatedGroup)
      }));
      
      setIsAlreadyMember(true);
      
      return { success: true, alreadyMember: false };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    inviteData,
    loading,
    error,
    isAlreadyMember,
    joinGroup
  };
};