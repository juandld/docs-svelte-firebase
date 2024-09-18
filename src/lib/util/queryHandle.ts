import { db } from "$lib/util/firebase";
import { collection,  getDocs,  query, where, doc, getDoc } from "firebase/firestore";


export const getUserwUsername = async (username: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        // There should not be more than one with the same username
        if (querySnapshot.size > 1) {
            console.log('Multiple users found with the same username');
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
            
            return null;
        }
        return {...querySnapshot.docs[0].data()};
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}

export const getDocwID = async (uID: string) => {
    const docRef = doc(db, 'users', uID); 
    try {
        const response = await getDoc(docRef);
        return response;
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}