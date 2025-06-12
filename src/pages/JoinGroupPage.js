import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import InvitePreview from '../components/invite/InvitePreview';
import JoinButton from '../components/invite/JoinButton';
import InviteError from '../components/invite/InviteError';
import Button from '../components/common/Button';
import { useInvite } from '../hooks/useInvite';

const JoinGroupPage = ({ user }) => {
  const { groupId } = useParams(); // URL 파라미터에서 groupId 추출
  const navigate = useNavigate();
  
  const { 
    inviteData, 
    loading, 
    error, 
    isAlreadyMember, 
    joinGroup 
  } = useInvite(groupId, user);

  const handleJoin = async () => {
    const result = await joinGroup();
    
    // 참여 성공 시 모임 상세 페이지로 이동
    if (result.success) {
      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 1500); // 1.5초 후 이동 (알림 확인 시간)
    }
    
    return result;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLoginRequired = () => {
    // 현재 URL을 state로 전달해서 로그인 후 돌아올 수 있게 함
    navigate('/login', { state: { from: `/join/${groupId}` } });
  };

  const handleGoHome = () => {
    navigate(user ? '/groups' : '/');
  };

  if (loading) {
    return (
      <Layout>
        <Header title="🏝️ 모임 초대" />
        <div className="content">
          <div className="loading">
            <div className="spinner"></div>
            <p>초대 정보를 확인하는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !inviteData) {
    return (
      <Layout>
        <Header title="🏝️ 모임 초대" />
        <div className="content">
          <InviteError
            error={error || '초대 정보를 불러올 수 없습니다.'}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="🏝️ 모임 초대" />
      
      <div className="content">
        <div className="join-group-content">
          <InvitePreview 
            group={inviteData.group} 
            stats={inviteData.stats}
          />
          
          <JoinButton
            onJoin={handleJoin}
            isAlreadyMember={isAlreadyMember}
            isLoggedIn={!!user}
            onLoginRequired={handleLoginRequired}
            groupName={inviteData.group.name}
          />
          
          {isAlreadyMember && (
            <div className="member-actions">
              <Button
                onClick={() => navigate(`/groups/${groupId}`)}
                variant="primary"
                className="go-to-group-btn"
              >
                모임으로 이동하기 →
              </Button>
            </div>
          )}
          
          <div className="invite-footer">
            <Button
              onClick={handleGoHome}
              variant="secondary"
              className="home-btn"
            >
              🏠 홈으로 가기
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JoinGroupPage;