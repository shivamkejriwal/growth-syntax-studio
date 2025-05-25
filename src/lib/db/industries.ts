
// src/lib/db/industries.ts
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  type Timestamp,
} from 'firebase/firestore';

const industriesCollection = collection(db, 'industries');

export interface Industry {
  id?: string; // Firestore document ID
  name: string;
  description?: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * Adds a new industry to the Firestore database.
 * @param industryData - The data for the new industry.
 * @returns The ID of the newly created industry document.
 */
export async function addIndustry(industryData: Omit<Industry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const newIndustry: Omit<Industry, 'id'> = {
      ...industryData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(industriesCollection, newIndustry);
    return docRef.id;
  } catch (error) {
    console.error('Error adding industry:', error);
    throw new Error('Failed to add industry.');
  }
}

/**
 * Fetches a single industry by its Firestore document ID.
 * @param industryId - The Firestore document ID of the industry.
 * @returns The industry data or null if not found.
 */
export async function getIndustry(industryId: string): Promise<Industry | null> {
  try {
    const industryDocRef = doc(industriesCollection, industryId);
    const docSnap = await getDoc(industryDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Industry;
    }
    return null;
  } catch (error) {
    console.error('Error fetching industry:', error);
    throw new Error('Failed to fetch industry.');
  }
}

/**
 * Fetches an industry by its name.
 * @param name - The name of the industry.
 * @returns The industry data or null if not found.
 */
export async function getIndustryByName(name: string): Promise<Industry | null> {
  try {
    const q = query(industriesCollection, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const industryDoc = querySnapshot.docs[0];
      return { id: industryDoc.id, ...industryDoc.data() } as Industry;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching industry by name ${name}:`, error);
    throw new Error(`Failed to fetch industry by name ${name}.`);
  }
}

/**
 * Fetches all industries from the Firestore database.
 * @returns An array of industry data.
 */
export async function getAllIndustries(): Promise<Industry[]> {
  try {
    const querySnapshot = await getDocs(industriesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Industry));
  } catch (error) {
    console.error('Error fetching all industries:', error);
    throw new Error('Failed to fetch all industries.');
  }
}

/**
 * Updates an existing industry in Firestore.
 * @param industryId - The Firestore document ID of the industry.
 * @param updatedData - The partial data to update.
 */
export async function updateIndustry(industryId: string, updatedData: Partial<Omit<Industry, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const industryDocRef = doc(industriesCollection, industryId);
    await updateDoc(industryDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating industry:', error);
    throw new Error('Failed to update industry.');
  }
}

/**
 * Deletes an industry from Firestore.
 * @param industryId - The Firestore document ID of the industry.
 */
export async function deleteIndustry(industryId: string): Promise<void> {
  try {
    const industryDocRef = doc(industriesCollection, industryId);
    await deleteDoc(industryDocRef);
  } catch (error) {
    console.error('Error deleting industry:', error);
    throw new Error('Failed to delete industry.');
  }
}
