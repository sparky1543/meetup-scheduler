import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import GroupCard from '../components/groups/GroupCard';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import EmptyGroups from '../components/groups/EmptyGroups';
import Button from '../components/common/Button';
import { useFirebaseGroups } from '../hooks/useFirebaseGroups';

const GroupsPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { groups, loading, error, createGroup, deleteGroup } = useFirebaseGroups(user);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await createGroup(groupData);
      alert(`'${newGroup.name}' 모임이 생성되었습니다! 🎉`);
    } catch (error) {
      throw error; // CreateGroupModal에서 에러 처리
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      alert('모임이 삭제되었습니다.');
    } catch (error) {
      alert(`삭제 실패: ${error.message}`);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
          <p>모임 목록을 불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header 
        title="🏝️ 모임 스케줄러"
        user={user}
      />
      
      <div className="content">
        <div className="groups-section">
          <div className="section-header">
            <h2>📋 내 모임 ({groups.length}개)</h2>
            <div className="header-actions">
              {groups.length > 0 && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                  className="add-group-btn"
                >
                  ➕ 모임 만들기
                </Button>
              )}
            </div>
          </div>

          {error && <div className="error section-error">{error}</div>}

          {groups.length === 0 ? (
            <EmptyGroups onCreateGroup={() => setShowCreateModal(true)} />
          ) : (
            <div className="groups-grid">
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  user={user}
                  onDelete={handleDeleteGroup}
                  onClick={handleGroupClick}
                />
              ))}
            </div>
          )}
        </div>

        <div className="page-actions">
          <Button
            onClick={handleProfileClick}
            variant="secondary"
            className="profile-btn"
          >
            👤 마이페이지
          </Button>
          
          <Button
            onClick={onLogout}
            variant="secondary"
            className="logout-btn"
          >
            🚪 로그아웃
          </Button>
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGroup={handleCreateGroup}
      />
    </Layout>
  );
};

export default GroupsPage;