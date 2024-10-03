import { authStore } from '$lib/stores/authStore';
import { auth } from '$lib/util/firebase';
import { db } from '$lib/util/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { signInWithEmailAndPassword as signInByEmailAndPassword, createUserWithEmailAndPassword as createUserByEmailAndPassword } from 'firebase/auth';
import { signOut, sendPasswordResetEmail, updateEmail, updatePassword, onAuthStateChanged } from 'firebase/auth';

export const authHandlers = {
    login: async (email: string, password: string) => {
        try {
            const data = await signInByEmailAndPassword(auth, email, password)
            authStore.update(() => ({
                uid: data.user.uid,
                isLoading: false,
                email: email
            }));
            return data
        } catch (error) {
            throw error
        }
    },
    signup: async (email: string, password: string, username: string, fullName: string) => {
        const usernameRef = doc(db, 'usernames', username);
        try {
            // First, run the transaction to check if the username is available
            const isUsernameAvailable = await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(usernameRef);
    
                if (sfDoc.exists()) {
                    throw new Error('Username already exists');
                }
                // If username does not exist, allow the process to proceed
                return true;
            });
    
            if (isUsernameAvailable) {
                // Now create the user with Firebase Authentication
                const authR = await createUserByEmailAndPassword(auth, email, password);
                const uID = authR.user.uid;
    
                // If the email is valid and user is created, add both username and user to Firestore
                await runTransaction(db, async (transaction) => {
                    // Add new username to the username collection
                    transaction.set(usernameRef, { username: username });
                    // Add new user to the users collection
                    transaction.set(doc(db, 'users', uID), { email: email, username: username, fullName: fullName });
                });
    
                return true;
            }
        } catch (error) {
            throw error
        }
    },
    
    logout: async () => {
        try {
            authStore.update(() => ({
                uid: undefined,
                isLoading: true,
                email: undefined
            }));
            return await signOut(auth)
        } catch (error) {
            throw error
        }
    },
    resetPassword: async (email: string) => {
        try {
            return await sendPasswordResetEmail(auth, email);
        } catch (error) {
            throw error;
        }
    },
    updateEmail: async (email: string) => {
        try {
            return await updateEmail(auth.currentUser!, email);
        } catch (error) {
            throw error;
        }
    },
    updatePassword: async (password: string) => {
        try {
            return await updatePassword(auth.currentUser!, password);
        } catch (error) {
            throw error;
        }
    },
    authstatus: (onUserChanged) => {
        // No need for async/await here since onAuthStateChanged is synchronous
        try {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                onUserChanged(user); // Call the provided callback with user data
            });

            return unsubscribe;  // Return the unsubscribe function synchronously
        } catch (error) {
            throw error;
        }
    }
}
