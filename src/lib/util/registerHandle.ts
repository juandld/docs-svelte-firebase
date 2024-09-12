import { db } from "$lib/util/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
    //Check if username is taken
    const isUsernameTaken = async (username: string) => {
        const usernameRef = doc(db, 'usernames', username);
        try {
            const usernameDoc = await getDoc(usernameRef);            
            return false;

        } catch (error) {
            throw error;
        }
    }
    //Create a new user
    export const createUser = async (uID: string, email: string, username: string, fullName: string) => {
        // Doc reference syncing firebase Auth unique ID
        try {
            const isaAva = await isUsernameTaken(username);
            console.log(isaAva);
            
            // Check if username is taken
            if(!isaAva) {
                console.log('Username is unavailable');
                return new Error('Username is already taken');
            }
            // New batch for the batch write
            const batch = writeBatch(db);
            // Add username to the usernames collection
            const usernameRef = doc(db, 'usernames', username);
            batch.set(usernameRef, { uID });
            // Add user info to the users collection
            const docRef = doc(db, 'users', uID);
            batch.set(docRef, {
                email: email,
                username: username,
                fullName: fullName
            });
            // Commit the batch
            await batch.commit();
        } catch (error) {
            return error;
        }
    }
  
    