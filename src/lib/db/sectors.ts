
// src/lib/db/sectors.ts
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

const sectorsCollection = collection(db, 'sectors');

export interface Sector {
  id?: string; // Firestore document ID
  name: string;
  description?: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * Adds a new sector to the Firestore database.
 * @param sectorData - The data for the new sector.
 * @returns The ID of the newly created sector document.
 */
export async function addSector(sectorData: Omit<Sector, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const newSector: Omit<Sector, 'id'> = {
      ...sectorData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(sectorsCollection, newSector);
    return docRef.id;
  } catch (error) {
    console.error('Error adding sector:', error);
    throw new Error('Failed to add sector.');
  }
}

/**
 * Fetches a single sector by its Firestore document ID.
 * @param sectorId - The Firestore document ID of the sector.
 * @returns The sector data or null if not found.
 */
export async function getSector(sectorId: string): Promise<Sector | null> {
  try {
    const sectorDocRef = doc(sectorsCollection, sectorId);
    const docSnap = await getDoc(sectorDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Sector;
    }
    return null;
  } catch (error) {
    console.error('Error fetching sector:', error);
    throw new Error('Failed to fetch sector.');
  }
}

/**
 * Fetches a sector by its name.
 * @param name - The name of the sector.
 * @returns The sector data or null if not found.
 */
export async function getSectorByName(name: string): Promise<Sector | null> {
  try {
    const q = query(sectorsCollection, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const sectorDoc = querySnapshot.docs[0];
      return { id: sectorDoc.id, ...sectorDoc.data() } as Sector;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching sector by name ${name}:`, error);
    throw new Error(`Failed to fetch sector by name ${name}.`);
  }
}

/**
 * Fetches all sectors from the Firestore database.
 * @returns An array of sector data.
 */
export async function getAllSectors(): Promise<Sector[]> {
  try {
    const querySnapshot = await getDocs(sectorsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector));
  } catch (error) {
    console.error('Error fetching all sectors:', error);
    throw new Error('Failed to fetch all sectors.');
  }
}

/**
 * Updates an existing sector in Firestore.
 * @param sectorId - The Firestore document ID of the sector.
 * @param updatedData - The partial data to update.
 */
export async function updateSector(sectorId: string, updatedData: Partial<Omit<Sector, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const sectorDocRef = doc(sectorsCollection, sectorId);
    await updateDoc(sectorDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating sector:', error);
    throw new Error('Failed to update sector.');
  }
}

/**
 * Deletes a sector from Firestore.
 * @param sectorId - The Firestore document ID of the sector.
 */
export async function deleteSector(sectorId: string): Promise<void> {
  try {
    const sectorDocRef = doc(sectorsCollection, sectorId);
    await deleteDoc(sectorDocRef);
  } catch (error) {
    console.error('Error deleting sector:', error);
    throw new Error('Failed to delete sector.');
  }
}
