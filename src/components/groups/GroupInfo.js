import React, { useState } from 'react';
import Button from '../common/Button';

const GroupInfo = ({ group, isOwner, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setFormData({
      name: group.name,
      description: group.description || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: group.name,
      description: group.description || ''
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('모임명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
      alert('모임 정보가 수정되었습니다.');
    } catch (error) {
      alert(`수정 실패: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  if (!group) return null;

  return (
    <div className="group-info-section">
      <div className="section-header">
        <h3>📝 모임 정보</h3>
        {isOwner && !isEditing && (
          <Button
            onClick={handleEdit}
            variant="secondary"
            className="edit-btn"
          >
            ✏️ 수정
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="모임명"
            className="form-input"
            disabled={isSubmitting}
          />
          
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="모임 설명 (선택사항)"
            className="form-textarea"
            rows="3"
            disabled={isSubmitting}
          />
          
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
        <div className="group-info-content">
          <div className="info-item">
            <strong>모임명:</strong>
            <span>{group.name}</span>
          </div>
          
          {group.description && (
            <div className="info-item">
              <strong>설명:</strong>
              <span>{group.description}</span>
            </div>
          )}
          
          <div className="info-item">
            <strong>생성일:</strong>
            <span>{new Date(group.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInfo;