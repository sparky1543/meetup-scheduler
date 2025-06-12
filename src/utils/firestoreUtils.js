import { 
    collection, 
    doc, 
    addDoc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp,
    arrayUnion,
    arrayRemove
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  // 랜덤 ID 생성 (8자리 영숫자)
  export const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // 컬렉션 참조 헬퍼
  export const getCollectionRef = (collectionName) => {
    return collection(db, collectionName);
  };
  
  // 문서 참조 헬퍼
  export const getDocRef = (collectionName, docId) => {
    return doc(db, collectionName, docId);
  };
  
  // 문서 생성
  export const createDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      console.error('문서 생성 오류:', error);
      throw error;
    }
  };
  
  // 문서 조회
  export const getDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('문서 조회 오류:', error);
      throw error;
    }
  };
  
  // 문서 업데이트
  export const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return await getDocument(collectionName, docId);
    } catch (error) {
      console.error('문서 업데이트 오류:', error);
      throw error;
    }
  };
  
  // 문서 삭제
  export const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('문서 삭제 오류:', error);
      throw error;
    }
  };
  
  // 쿼리 실행
  export const executeQuery = async (collectionName, conditions = []) => {
    try {
      const collectionRef = collection(db, collectionName);
      let q = collectionRef;
      
      // 조건 적용
      conditions.forEach(condition => {
        if (condition.type === 'where') {
          q = query(q, where(condition.field, condition.operator, condition.value));
        } else if (condition.type === 'orderBy') {
          q = query(q, orderBy(condition.field, condition.direction || 'asc'));
        }
      });
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('쿼리 실행 오류:', error);
      throw error;
    }
  };
  
  // 배열 필드에 값 추가
  export const addToArrayField = async (collectionName, docId, fieldName, value) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        [fieldName]: arrayUnion(value),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('배열 필드 추가 오류:', error);
      throw error;
    }
  };
  
  // 배열 필드에서 값 제거
  export const removeFromArrayField = async (collectionName, docId, fieldName, value) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        [fieldName]: arrayRemove(value),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('배열 필드 제거 오류:', error);
      throw error;
    }
  };
  
  // 타임스탬프를 Date 객체로 변환
  export const timestampToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };
  
  // 서버 타임스탬프 생성
  export const getServerTimestamp = () => {
    return serverTimestamp();
  };