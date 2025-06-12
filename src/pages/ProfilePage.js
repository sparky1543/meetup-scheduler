import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import BackButton from '../components/navigation/BackButton';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { updateUserData } from '../utils/firebaseAuth';

const ProfilePage = ({ user, onLogout, onUserUpdate }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user?.nickname || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setFormData({ nickname: user.nickname });
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setFormData({ nickname: user.nickname });
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (formData.nickname === user.nickname) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const updatedUser = await updateUserData(user.uid, {
        nickname: formData.nickname.trim()
      });

      onUserUpdate(updatedUser);
      setIsEditing(false);
      alert('닉네임이 변경되었습니다! 🎉');
    } catch (error) {
      setError('닉네임 변경에 실패했습니다.');
      console.error('닉네임 변경 오류:', error);
    }

    setIsSubmitting(false);
  };

  const handleBack = () => {
    navigate('/groups');
  };

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      await onLogout();
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="error-page">
            <div className="error-icon">😕</div>
            <h2>사용자 정보를 찾을 수 없어요</h2>
            <p>로그인이 필요합니다.</p>
            <Button onClick={() => navigate('/login')} variant="primary">
              로그인하기
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
        <div className="profile-header">
          <BackButton onClick={handleBack}>모임 목록</BackButton>
          <h1>마이페이지</h1>
        </div>

        <div className="profile-content">
          {/* 사용자 정보 카드 */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>👤 내 정보</h3>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  className="edit-profile-btn"
                >
                  ✏️ 수정
                </Button>
              )}
            </div>

            <div className="profile-info">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>닉네임</label>
                    <Input
                      type="text"
                      placeholder="닉네임을 입력해주세요"
                      value={formData.nickname}
                      onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                     disabled={isSubmitting}
                     className={error ? 'error' : ''}
                   />
                   {error && <span className="field-error">{error}</span>}
                 </div>
                 
                 <div className="edit-actions">
                   <Button
                     onClick={handleCancel}
                     variant="secondary"
                     disabled={isSubmitting}
                   >
                     취소
                   </Button>
                   <Button
                     onClick={handleSave}
                     disabled={isSubmitting}
                   >
                     {isSubmitting ? '저장 중...' : '저장'}
                   </Button>
                 </div>
               </div>
             ) : (
               <div className="info-display">
                 <div className="info-item">
                   <span className="info-label">이메일:</span>
                   <span className="info-value">{user.email}</span>
                 </div>
                 
                 <div className="info-item">
                   <span className="info-label">닉네임:</span>
                   <span className="info-value">{user.nickname}</span>
                 </div>
                 
                 <div className="info-item">
                   <span className="info-label">사용자 번호:</span>
                   <span className="info-value">#{user.userNumber}</span>
                 </div>
                 
                 <div className="info-item">
                   <span className="info-label">가입 방법:</span>
                   <span className="info-value">
                     {user.provider === 'email' ? '📧 이메일' : 
                      user.provider === 'google' ? '🔵 구글' : '💛 카카오'}
                   </span>
                 </div>
                 
                 <div className="info-item">
                   <span className="info-label">가입일:</span>
                   <span className="info-value">
                     {user.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') || 'Unknown'}
                   </span>
                 </div>
               </div>
             )}
           </div>
         </div>

         {/* 계정 관리 */}
         <div className="account-management">
           <h3>⚙️ 계정 관리</h3>
           
           <div className="management-actions">
             <Button
               onClick={handleLogout}
               variant="secondary"
               className="logout-btn"
             >
               🚪 로그아웃
             </Button>
             
             <div className="danger-zone">
               <h4>⚠️ 위험 영역</h4>
               <p>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
               <Button
                 onClick={() => alert('계정 삭제 기능은 준비 중입니다.')}
                 variant="secondary"
                 className="delete-account-btn"
               >
                 🗑️ 계정 삭제
               </Button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </Layout>
 );
};

export default ProfilePage;