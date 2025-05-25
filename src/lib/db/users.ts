// src/lib/db/users.ts
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export interface UserProfile {
  id?: string; // Firestore document ID
  uid: string; // Firebase Auth UID
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  // Add any other user-specific fields here
  // e.g., preferences, roles, etc.
}

/**
 * Creates a new user profile in Firestore.
 * Typically called after a new user signs up.
 * @param uid - The Firebase Auth UID of the user.
 * @param data - Partial user data (e.g., email, displayName).
 * @returns The ID of the newly created user document.
 */
export async function createUserProfile(uid: string, data: Partial<Omit<UserProfile, 'id' | 'uid' | 'createdAt'>>): Promise<string> {
  try {
    const userDocRef = doc(usersCollection, uid); // Use UID as document ID for easy lookup
    const newUserProfile: Omit<UserProfile, 'id'> = {
      uid,
      email: data.email || null,
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      createdAt: serverTimestamp() as Timestamp, // Use serverTimestamp for consistency
      ...data,
    };
    await addDoc(collection(db, 'users'), newUserProfile); // Or setDoc(userDocRef, newUserProfile) if using UID as doc ID
    // If using UID as doc ID with setDoc, it doesn't return an ID as it's known.
    // If using addDoc, it returns a DocumentReference.
    // For simplicity with addDoc and a separate ID field:
    const docRef = await addDoc(usersCollection, newUserProfile);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile.');
  }
}

/**
 * Fetches a user profile from Firestore by their Firebase Auth UID.
 * @param uid - The Firebase Auth UID of the user.
 * @returns The user profile data or null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    // If using UID as document ID:
    // const userDocRef = doc(usersCollection, uid);
    // const docSnap = await getDoc(userDocRef);
    // if (docSnap.exists()) {
    //   return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    // }
    // return null;

    // If UID is a field in the document:
    const q = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile.');
  }
}

/**
 * Updates an existing user profile in Firestore.
 * @param userId - The Firestore document ID of the user profile.
 * @param updatedData - The partial data to update.
 */
export async function updateUserProfile(userId: string, updatedData: Partial<UserProfile>): Promise<void> {
  try {
    const userDocRef = doc(usersCollection, userId);
    await updateDoc(userDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(), // Automatically update the timestamp
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile.');
  }
}

/**
 * Deletes a user profile from Firestore.
 * @param userId - The Firestore document ID of the user profile.
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const userDocRef = doc(usersCollection, userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile.');
  }
}
