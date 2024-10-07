import { db } from "$lib/util/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { error } from '@sveltejs/kit';


export const findUserByUsername = async (username: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.metadata.fromCache) {
            console.warn("Results are from cache. Firestore backend might be unavailable.");
            throw error(500, "Unable to connect to Firebase backend (Maybe google cloud is down or you can't reach google services)");
        }

        if (querySnapshot.empty) {
            // Throwing a 404 error if user not found
            throw error(404, {
                message: 'User not found'
            });
        }
        // There should not be more than one with the same username
        /* if (querySnapshot.size > 1) {
            console.log('Multiple users found with the same username');
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });

            return null;
        } */
        return querySnapshot.docs[0].data() ;
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}

export const getUserByID = async (uID: string) => {
    const docRef = doc(db, 'users', uID);
    try {
        const response = await getDoc(docRef);
        return response;
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}