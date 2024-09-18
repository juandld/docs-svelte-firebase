import { db } from "$lib/util/firebase";
import { collection,  getDocs,  query, where, doc, getDoc } from "firebase/firestore";



const findChamofilewText = async (username: string) => {
}

const getChamofilewID = async (uID: string) => {
}

const createChamofile = async (uID: string) => {

}

const updateChamofile = async (uID: string) => {

}

const deleteChamofile = async (uID: string) => {
}


export const chamofileQuery = {
    findChamofilewText,
    getChamofilewID
}

export const chamofileCRUD = {
    createChamofile,
    updateChamofile,
    deleteChamofile    
}