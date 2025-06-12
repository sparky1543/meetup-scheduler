import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('모임명을 입력해주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onCreateGroup(formData);
      
      // 성공 시 모달 닫기 및 폼 리셋
      setFormData({ name: '', description: '' });
      onClose();
      
    } catch (error) {
      setError(error.message || '모임 생성에 실패했습니다.');
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '' });
      setError('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="create-group-modal">
        <h3>새 모임 만들기</h3>
        <p>친구들과 함께할 모임을 만들어보세요!</p>
        
        <div className="modal-form">
          <Input
            type="text"
            placeholder="모임명 (예: 여름휴가 계획)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={isSubmitting}
            className="modal-input"
          />
          
          <textarea
            placeholder="모임 설명 (선택사항)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={isSubmitting}
            className="modal-textarea"
            rows="3"
          />
          
          {error && <div className="error">{error}</div>}
          
          <div className="modal-buttons">
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="secondary"
              className="modal-cancel-btn"
            >
              취소
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="modal-submit-btn"
            >
              {isSubmitting ? '생성 중...' : '모임 만들기'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;