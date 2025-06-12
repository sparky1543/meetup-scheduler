import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import BackButton from '../components/navigation/BackButton';
import GroupInfo from '../components/groups/GroupInfo';
import MemberList from '../components/groups/MemberList';
import InviteLink from '../components/groups/InviteLink';
import EventList from '../components/groups/EventList';
import Button from '../components/common/Button';
import { useGroupMembers } from '../hooks/useGroupMembers';

const GroupDetailPage = ({ user, onLogout }) => {
  const { groupId } = useParams(); // URL 파라미터에서 groupId 추출
  const navigate = useNavigate();
  
  const { 
    group, 
    loading, 
    error, 
    isOwner, 
    isMember, 
    removeMember, 
    updateGroup 
  } = useGroupMembers(groupId, user);

  const handleRemoveMember = async (userId) => {
    try {
      await removeMember(userId);
      
      // 자신이 나간 경우 모임 목록으로 돌아가기
      if (userId === user.uid) {
        alert('모임에서 나왔습니다.');
        navigate('/groups');
      } else {
        alert('멤버가 제거되었습니다.');
      }
    } catch (error) {
      alert(`오류: ${error.message}`);
    }
  };

  const handleBack = () => {
    navigate('/groups');
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
            
            <Button onClick={handleBack} variant="primary">
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
            
            <Button onClick={handleBack} variant="primary">
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
          <BackButton onClick={handleBack}>모임 목록</BackButton>
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
            user={user}
            isOwner={isOwner}
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