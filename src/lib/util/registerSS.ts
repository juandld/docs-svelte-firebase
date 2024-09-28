import { db } from "$lib/util/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp();


//Create a new user checking if username is available with FB transaction
export const createUser = async ( uID: string, email: string, username: string, fullName: string ) => {
    const usernameRef = doc(db, 'usernames', username);
    try {
        const message = await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(usernameRef);
            console.log("Document data:", sfDoc.data());
            
            // Check if username already exists
            if (sfDoc.exists()) { 
                return 'Username already exists';
            } else {
              // Add new username to the username collection
              transaction.set(usernameRef, { username: username });
              // Add new user to the users collection
              transaction.set(doc(db, 'users', uID), { email: email, username: username, fullName: fullName });
              return 'User created successfully';
            }
          });

        return message;
    } catch (error) {
        return error;
    }
}

