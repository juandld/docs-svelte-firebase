import { db } from "$lib/util/firebase";
import { collection,  getDocs,  query, where, doc, getDoc } from "firebase/firestore";


export const getDocwUsername = async (username: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
        });
        return querySnapshot;
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