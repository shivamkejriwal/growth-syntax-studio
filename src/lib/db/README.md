# Firestore Database Logic

This directory contains modules responsible for direct interaction with the Cloud Firestore database. Each file typically represents a specific data entity or collection (e.g., `users.ts`, `companies.ts`) and exports functions for CRUD (Create, Read, Update, Delete) operations related to that entity.

## Structure

-   **`users.ts`**: Contains functions to manage user data in Firestore (e.g., creating, fetching, updating, deleting users).
-   **`companies.ts`**: Contains functions to manage company data in Firestore.
-   Add more files here as your application grows, for example, `portfolios.ts`, `watchlistItems.ts`, etc.

## Usage

These modules import the initialized `db` instance from `src/lib/firebase.ts` and use the Firebase SDK methods for database operations.

Higher-level service logic (e.g., in `src/services`) can import and use these functions to persist or retrieve data, keeping the direct database interaction code organized and centralized here.
