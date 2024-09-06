import { auth } from '$lib/util/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, updateEmail, updatePassword, getAuth } from 'firebase/auth';

type AuthHandlers = {
    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updateEmail: (email: string) => Promise<void>
    updatePassword: (password: string) => Promise<void>
}

export const authHandlers = {
    login: async (email: string, password: string) => {
        return await signInWithEmailAndPassword(auth, email, password)
        
    },
    signup: async (email: string, password: string) => {
        return await createUserWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
        return await signOut(auth)
    },
    resetPassword: async (email: string) => {
        return await sendPasswordResetEmail(auth, email)
    },
    updateEmail: async (email: string) => {
        return await updateEmail(auth.currentUser!, email)
    },
    updatePassword: async (password: string) => {
        return await updatePassword(auth.currentUser!, password)
    }
}
