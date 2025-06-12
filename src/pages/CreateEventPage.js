import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import BackButton from '../components/navigation/BackButton';
import EventTypeSelector from '../components/events/EventTypeSelector';
import DateRangeSelector from '../components/events/DateRangeSelector';
import TimeRangeSelector from '../components/events/TimeRangeSelector';
import EventPreview from '../components/events/EventPreview';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useEvents } from '../hooks/useEvents';
import { useGroupMembers } from '../hooks/useGroupMembers';

const CreateEventPage = ({ user, onLogout }) => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  
  const { group, isOwner, isMember } = useGroupMembers(groupId, user);
  const { createEvent } = useEvents(groupId, user, group?.createdBy);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'date', // 'date' or 'time'
    dateRange: {
      start: '',
      end: ''
    },
    timeRange: {
      start: '09:00',
      end: '18:00'
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      // 타입 변경 시 날짜 범위 초기화
      dateRange: {
        start: '',
        end: ''
      }
    }));
    setErrors({});
  };

  const handleDateRangeChange = (dateRange) => {
    setFormData(prev => ({
      ...prev,
      dateRange
    }));
  };

  const handleTimeRangeChange = (timeRange) => {
    setFormData(prev => ({
      ...prev,
      timeRange
    }));
  };

  const setError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '약속 이름을 입력해주세요.';
    }
    
    if (!formData.dateRange.start) {
      newErrors.dateRange = '시작일을 선택해주세요.';
    }
    
    if (!formData.dateRange.end) {
      newErrors.dateRange = '종료일을 선택해주세요.';
    }
    
    if (formData.type === 'time') {
      if (!formData.timeRange.start || !formData.timeRange.end) {
        newErrors.timeRange = '시간 범위를 설정해주세요.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type,
        dateRange: formData.dateRange,
        timeRange: formData.type === 'time' ? formData.timeRange : null
      };
      
      const newEvent = await createEvent(eventData);
      
      alert(`'${newEvent.name}' 약속이 생성되었습니다! 🎉`);
      navigate(`/groups/${groupId}`);
      
    } catch (error) {
      alert(`약속 생성 실패: ${error.message}`);
    }
    
    setIsSubmitting(false);
  };

  const handleBack = () => {
    navigate(`/groups/${groupId}`);
  };

  // 권한 체크
  if (!group || !isMember) {
    return (
      <Layout>
        <Header title="🏝️ 모임 스케줄러" />
        <div className="content">
          <div className="error-page">
            <div className="error-icon">🔒</div>
            <h2>접근 권한이 없어요</h2>
            <p>모임 멤버만 약속을 생성할 수 있습니다.</p>
            <Button onClick={() => navigate('/groups')} variant="primary">
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
        <div className="create-event-header">
          <BackButton onClick={handleBack}>모임으로 돌아가기</BackButton>
          <h1>새 약속 만들기</h1>
          <p>{group.name} 모임의 새로운 약속을 만들어보세요!</p>
        </div>

        <div className="create-event-content">
          {/* 기본 정보 */}
          <div className="form-section">
            <h3>기본 정보</h3>
            <div className="form-group">
              <label>약속 이름 *</label>
              <Input
                type="text"
                placeholder="예: 여름휴가 날짜 정하기"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>설명 (선택사항)</label>
              <textarea
                placeholder="약속에 대한 추가 설명을 입력해주세요."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>

          {/* 약속 타입 선택 */}
          <EventTypeSelector
            selectedType={formData.type}
            onTypeChange={handleTypeChange}
          />

          {/* 날짜 범위 설정 */}
          <DateRangeSelector
            type={formData.type}
            dateRange={formData.dateRange}
            onDateRangeChange={handleDateRangeChange}
            error={errors.dateRange}
            setError={(message) => setError('dateRange', message)}
          />

          {/* 시간 범위 설정 (시간 타입일 때만) */}
          {formData.type === 'time' && (
            <TimeRangeSelector
              timeRange={formData.timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              error={errors.timeRange}
              setError={(message) => setError('timeRange', message)}
            />
          )}

          {/* 미리보기 */}
          <EventPreview formData={formData} />

          {/* 제출 버튼 */}
          <div className="form-actions">
            <Button
              onClick={handleBack}
              variant="secondary"
              disabled={isSubmitting}
            >
              취소
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? '약속 생성 중...' : '🎉 약속 만들기'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventPage;