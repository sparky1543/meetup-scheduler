import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
  import { auth, db, googleProvider } from '../config/firebase';
  
  // 랜덤 사용자 번호 생성 (8자리 영숫자)
  export const generateUserNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 사용자 데이터를 Firestore에 저장
  export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
  
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
  
    // 사용자 문서가 존재하지 않으면 생성
    if (!userSnap.exists()) {
      const { email, displayName } = user;
      const createdAt = serverTimestamp();
  
      try {
        await setDoc(userRef, {
          email,
          nickname: additionalData.nickname || displayName || email.split('@')[0],
          userNumber: generateUserNumber(),
          provider: additionalData.provider || 'email',
          createdAt,
          updatedAt: createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('사용자 문서 생성 오류:', error);
        throw error;
      }
    }
  
    return userRef;
  };
  
  // 사용자 정보 가져오기
  export const getUserData = async (uid) => {
    if (!uid) return null;
  
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { uid, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('사용자 데이터 조회 오류:', error);
      throw error;
    }
  };
  
  // 이메일 회원가입
  export const signUpWithEmail = async (email, password, nickname) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await createUserDocument(user, {
        nickname,
        provider: 'email'
      });
  
      const userData = await getUserData(user.uid);
      return userData;
    } catch (error) {
      console.error('이메일 회원가입 오류:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };
  
  // 이메일 로그인
  export const signInWithEmail = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(user.uid);
      return userData;
    } catch (error) {
      console.error('이메일 로그인 오류:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };
  
  // 구글 로그인
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // 기존 사용자인지 확인
      const existingUser = await getUserData(user.uid);
      
      if (!existingUser) {
        // 새 사용자인 경우 - 닉네임 입력 필요
        return {
          isNewUser: true,
          user: user,
          needsNickname: true
        };
      }
  
      return {
        isNewUser: false,
        user: existingUser
      };
    } catch (error) {
      console.error('구글 로그인 오류:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };
  
  // 카카오 로그인 (추후 구현)
  export const signInWithKakao = async () => {
    // 실제 프로덕션에서는 카카오 SDK 연동
    throw new Error('카카오 로그인은 준비 중입니다. 구글 로그인을 이용해주세요.');
  };
  
  // 사용자 정보 업데이트 (닉네임 변경 등)
  export const updateUserData = async (uid, updateData) => {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      }, { merge: true });
  
      const updatedUser = await getUserData(uid);
      return updatedUser;
    } catch (error) {
      console.error('사용자 정보 업데이트 오류:', error);
      throw error;
    }
  };
  
  // 로그아웃
  export const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };
  
  // 인증 상태 리스너
  export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // 에러 메시지 변환
  export const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
      'auth/weak-password': '비밀번호가 너무 약합니다. 6자리 이상 입력해주세요.',
      'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
      'auth/user-not-found': '존재하지 않는 사용자입니다.',
      'auth/wrong-password': '잘못된 비밀번호입니다.',
      'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
      'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
      'auth/popup-closed-by-user': '로그인이 취소되었습니다.',
      'auth/cancelled-popup-request': '로그인이 취소되었습니다.'
    };
    
    return messages[errorCode] || '오류가 발생했습니다. 다시 시도해주세요.';
  };