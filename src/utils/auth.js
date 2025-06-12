// 랜덤 사용자 번호 생성
export const generateUserNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 에러 메시지 변환
  export const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
      'auth/weak-password': '비밀번호가 너무 약습니다.',
      'auth/invalid-email': '유효하지 않은 이메일입니다.',
      'auth/user-not-found': '존재하지 않는 사용자입니다.',
      'auth/wrong-password': '잘못된 비밀번호입니다.'
    };
    return messages[errorCode] || '오류가 발생했습니다. 다시 시도해주세요.';
  };
  
  // Firebase Mock 시뮬레이션
  export const mockAuth = {
    signInWithEmail: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'test@test.com' && password === 'test123') {
        return { uid: 'mock-uid-123', email: email };
      }
      throw new Error('auth/wrong-password');
    },
  
    createUserWithEmail: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'existing@test.com') {
        throw new Error('auth/email-already-in-use');
      }
      
      return { uid: `mock-uid-${Date.now()}`, email: email };
    },
  
    signInWithGoogle: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        uid: `google-uid-${Date.now()}`,
        email: 'google.user@gmail.com',
        isNewUser: Math.random() > 0.5
      };
    }
  };