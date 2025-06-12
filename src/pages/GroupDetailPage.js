import React from 'react';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import BackButton from '../components/navigation/BackButton';
import GroupInfo from '../components/groups/GroupInfo';
import MemberList from '../components/groups/MemberList';
import InviteLink from '../components/groups/InviteLink';
import EventList from '../components/groups/EventList';
import Button from '../components/common/Button';
import { useGroupMembers } from '../hooks/useGroupMembers';

const GroupDetailPage = ({ groupId, user, onBack, onLogout }) => {
  const { 
    group, 
    loading, 
    error, 
    isOwner, 
    isMember, 
    removeMember, 
    updateGroup 
  } = useGroupMembers(groupId, user);

  const handleCreateEvent = () => {
    // TODO: 약속 생성 페이지로 이동 (다음 단계에서 구현)
    alert('약속 생성 기능은 다음 단계에서 구현됩니다! 🚀');
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(userId);
      
      // 자신이 나간 경우 모임 목록으로 돌아가기
      if (userId === user.uid) {
        alert('모임에서 나왔습니다.');
        onBack();
      } else {
        alert('멤버가 제거되었습니다.');
      }
    } catch (error) {
      alert(`오류: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
          <p>모임 정보를 불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  if (error || !group) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="error-page">
            <div className="error-icon">😕</div>
            <h2>모임을 찾을 수 없어요</h2>
            <p>{error || '존재하지 않는 모임이거나 접근 권한이 없습니다.'}</p>
            
            <Button onClick={onBack} variant="primary">
              모임 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isMember) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="access-denied">
            <div className="denied-icon">🔒</div>
            <h2>모임 멤버만 접근 가능해요</h2>
            <p>이 모임의 멤버가 아닙니다. 초대 링크를 통해 먼저 참여해주세요.</p>
            
            <Button onClick={onBack} variant="primary">
              모임 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="🏝️ 모임 스케줄러" />
      
      <div className="content">
        <div className="group-detail-header">
          <BackButton onClick={onBack}>모임 목록</BackButton>
          <div className="group-title-section">
            <h1 className="group-title">
              {isOwner && <span className="owner-crown">👑</span>}
              {group.name}
            </h1>
            <p className="group-subtitle">
              {isOwner ? '모임장' : '멤버'} • 멤버 {Object.keys(group.members).length}명
            </p>
          </div>
        </div>

        <div className="group-detail-content">
          <GroupInfo 
            group={group} 
            isOwner={isOwner} 
            onUpdate={updateGroup}
          />
          
          <MemberList 
            group={group} 
            currentUser={user} 
            isOwner={isOwner}
            onRemoveMember={handleRemoveMember}
          />
          
          <InviteLink groupId={groupId} />
          
          <EventList 
            group={group} 
            onCreateEvent={handleCreateEvent}
          />
        </div>

        <div className="page-actions">
          <Button
            onClick={onLogout}
            variant="secondary"
            className="logout-btn"
          >
            🚪 로그아웃
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default GroupDetailPage;