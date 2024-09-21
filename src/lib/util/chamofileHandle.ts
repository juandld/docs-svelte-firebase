import { db } from "$lib/util/firebase";
import { collection,  getDocs,  query, where, doc, getDoc, setDoc } from "firebase/firestore";



const findChamofilewText = async (username: string) => {
}

const getChamofilewID = async (uID: string) => {
}

const saveChamofile = async (uID: string, content: string) => {
    const docRef = doc(db, 'chamofiles', uID);
    try {
        const response = await setDoc(docRef, { content: content });
        return response;
    } catch (error) {
        console.error("Error querying documents: ", error);
        throw error;
    }
}

const deleteChamofile = async (uID: string) => {
}


export const chamofileQuery = {
    findChamofilewText,
    getChamofilewID
}

export const chamofileCRUD = {
    saveChamofile,
    getChamofilewID,
    deleteChamofile    
}