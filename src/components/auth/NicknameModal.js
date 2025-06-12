import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const NicknameModal = ({ isOpen, onSave }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(nickname);
    } catch (error) {
      setError('닉네임 저장에 실패했습니다.');
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <h3>닉네임 설정</h3>
      <p>서비스 이용을 위해 닉네임을 설정해주세요.</p>
      
      <Input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={isSubmitting}
        className="modal-input"
      />
      
      {error && <div className="error">{error}</div>}
      
      <Button
        onClick={handleSave}
        disabled={isSubmitting}
        className="modal-btn"
      >
        {isSubmitting ? '저장 중...' : '확인'}
      </Button>
    </Modal>
  );
};

export default NicknameModal;