import { useState, useEffect } from 'react';
import { onAuthStateChange, getUserData, signOutUser } from '../utils/firebaseAuth';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Firebase 사용자가 있으면 Firestore에서 추가 정보 가져오기
          const userData = await getUserData(firebaseUser.uid);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
        setUser(null);
      } finally {
        setLoading(false);
        if (initializing) {
          setInitializing(false);
        }
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return unsubscribe;
  }, [initializing]);

  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    user,
    loading,
    initializing,
    logout,
    updateUser,
    isAuthenticated: !!user
  };
};