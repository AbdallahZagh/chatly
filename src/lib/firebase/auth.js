import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { app } from './firebase';
import { createUserProfile, reserveUsername } from './users';

const auth = getAuth(app);

export const signup = async ({ email, password, username, displayName }) => {
  // normalize username
  const uname = username.trim().toLowerCase();

  // reserve username (throws if exists)
  await reserveUsername(uname);

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  // update firebase auth displayName
  await updateProfile(user, { displayName });

  // create user profile document
  await createUserProfile(user.uid, { email, username: uname, displayName });

  return user;
};

export const login = async ({ email, password }) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const logout = async () => {
  return signOut(auth);
};

export const onAuthState = (cb) => onAuthStateChanged(auth, cb);

export const getAuthInstance = () => auth;
