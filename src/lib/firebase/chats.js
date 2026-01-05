import { getFirestore, doc, getDoc, setDoc, collection, query, where, orderBy, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

const chatIdFor = (a, b) => [a, b].sort().join('_');

export const getOrCreateChat = async (userA, userB) => {
  const chatId = chatIdFor(userA, userB);
  const ref = doc(db, 'chats', chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      participants: [userA, userB],
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
    });
  }
  return chatId;
};

export const listenToUserChats = (userId, cb) => {
  const q = query(collection(db, 'chats'), where('participants', 'array-contains', userId), orderBy('lastMessageAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const chats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(chats);
  });
};

export const updateChatLastMessage = async (chatId, text) => {
  const ref = doc(db, 'chats', chatId);
  await updateDoc(ref, { lastMessage: text, lastMessageAt: serverTimestamp() });
};
