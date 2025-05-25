// src/lib/db/companies.ts
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
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';

const companiesCollection = collection(db, 'companies');

// Define a basic interface for Company data
// Adjust this to match the actual structure of your company data
export interface Company {
  id?: string; // Firestore document ID
  ticker: string;
  name: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  mostBought?: boolean;
  mostSold?: boolean;
  mostTraded?: boolean;
  closingPrice?: number;
  openingPrice?: number;
  volume?: number;
  // Add other relevant fields
  lastRefreshed?: Timestamp | Date; // When this data was last updated from a source
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * Adds a new company to the Firestore database.
 * @param companyData - The data for the new company.
 * @returns The ID of the newly created company document.
 */
export async function addCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const newCompany: Omit<Company, 'id'> = {
      ...companyData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(companiesCollection, newCompany);
    return docRef.id;
  } catch (error) {
    console.error('Error adding company:', error);
    throw new Error('Failed to add company.');
  }
}

/**
 * Fetches a single company by its Firestore document ID.
 * @param companyId - The Firestore document ID of the company.
 * @returns The company data or null if not found.
 */
export async function getCompany(companyId: string): Promise<Company | null> {
  try {
    const companyDocRef = doc(companiesCollection, companyId);
    const docSnap = await getDoc(companyDocRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Company;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw new Error('Failed to fetch company.');
  }
}

/**
 * Fetches a company by its ticker symbol.
 * @param ticker - The ticker symbol of the company.
 * @returns The company data or null if not found.
 */
export async function getCompanyByTicker(ticker: string): Promise<Company | null> {
  try {
    const q = query(companiesCollection, where('ticker', '==', ticker));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const companyDoc = querySnapshot.docs[0];
      return { id: companyDoc.id, ...companyDoc.data() } as Company;
    }
    return null;
  } catch (error)
 {
    console.error(`Error fetching company by ticker ${ticker}:`, error);
    throw new Error(`Failed to fetch company by ticker ${ticker}.`);
  }
}


/**
 * Fetches all companies from the Firestore database.
 * @returns An array of company data.
 */
export async function getAllCompanies(): Promise<Company[]> {
  try {
    const querySnapshot = await getDocs(companiesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw new Error('Failed to fetch all companies.');
  }
}

/**
 * Updates an existing company in Firestore.
 * @param companyId - The Firestore document ID of the company.
 * @param updatedData - The partial data to update.
 */
export async function updateCompany(companyId: string, updatedData: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const companyDocRef = doc(companiesCollection, companyId);
    await updateDoc(companyDocRef, {
      ...updatedData,
      updatedAt: serverTimestamp(), // Automatically update the timestamp
    });
  } catch (error) {
    console.error('Error updating company:', error);
    throw new Error('Failed to update company.');
  }
}

/**
 * Deletes a company from Firestore.
 * @param companyId - The Firestore document ID of the company.
 */
export async function deleteCompany(companyId: string): Promise<void> {
  try {
    const companyDocRef = doc(companiesCollection, companyId);
    await deleteDoc(companyDocRef);
  } catch (error) {
    console.error('Error deleting company:', error);
    throw new Error('Failed to delete company.');
  }
}
