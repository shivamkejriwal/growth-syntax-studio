// src/services/firestoreWriter.ts
// This service will be responsible for writing data to Cloud Firestore.

import { db } from '@/lib/firebase'; // Assuming your Firebase init is here
import { collection, addDoc, writeBatch, doc, DocumentData } from 'firebase/firestore';

/**
 * Writes an array of data objects to a specified Firestore collection.
 * Each object in the array will be a new document in the collection.
 * Uses batch writes for efficiency if multiple documents are provided.
 * 
 * @param collectionName - The name of the Firestore collection to write to.
 * @param data - An array of objects, where each object represents a document to be added.
 * @returns A promise that resolves when all data has been successfully written.
 */
export async function writeToFirestore<T extends DocumentData>(
  collectionName: string,
  data: T[]
): Promise<void> {
  if (!data || data.length === 0) {
    console.log('No data provided to write to Firestore.');
    return;
  }

  console.log(`Writing ${data.length} documents to Firestore collection: ${collectionName}`);

  // Firestore allows up to 500 operations in a single batch.
  // If you have more data, you'll need to split it into multiple batches.
  const MAX_BATCH_SIZE = 500;
  let currentBatch = writeBatch(db);
  let operationsInCurrentBatch = 0;

  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    const newDocRef = doc(collection(db, collectionName)); // Auto-generate ID
    currentBatch.set(newDocRef, record);
    operationsInCurrentBatch++;

    if (operationsInCurrentBatch === MAX_BATCH_SIZE || i === data.length - 1) {
      await currentBatch.commit();
      console.log(`Committed batch of ${operationsInCurrentBatch} documents.`);
      if (i < data.length - 1) {
        currentBatch = writeBatch(db); // Start a new batch
        operationsInCurrentBatch = 0;
      }
    }
  }
  
  console.log('Successfully wrote all data to Firestore.');
  // Placeholder: Actual implementation might involve more sophisticated error handling or data validation.
  // For single document writes, you could use:
  // for (const record of data) {
  //   await addDoc(collection(db, collectionName), record);
  // }
  // However, batching is preferred for multiple documents.
}
