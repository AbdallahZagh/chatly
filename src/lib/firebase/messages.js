import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { app } from './firebase';
import { updateChatLastMessage } from './chats';

const db = getFirestore(app);

export const sendMessage = async ({ chatId, senderId, text }) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const msg = {
    senderId,
    text,
    createdAt: serverTimestamp(),
    readBy: [],
  };
  await addDoc(messagesRef, msg);
  await updateChatLastMessage(chatId, text);
};

export const listenToMessages = (chatId, cb) => {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(messages);
  });
};
