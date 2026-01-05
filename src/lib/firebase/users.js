import { getFirestore, doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);

export const reserveUsername = async (username) => {
  const ref = doc(db, 'usernames', username);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    throw new Error('USERNAME_TAKEN');
  }
  // reserve (will be updated with userId later)
  await setDoc(ref, { reservedAt: serverTimestamp() });
};

export const createUserProfile = async (userId, { email, username, displayName }) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    email,
    username,
    displayName,
    createdAt: serverTimestamp(),
    isOnline: true,
    lastSeen: serverTimestamp(),
    blockedUsers: [],
  });

  // link username -> userId (overwrite reservation)
  const unameRef = doc(db, 'usernames', username);
  await setDoc(unameRef, { userId });
};

export const getUserById = async (userId) => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const setUserOnline = async (userId, online = true) => {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, { isOnline: online, lastSeen: serverTimestamp() });
};
