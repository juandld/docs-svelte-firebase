import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db } from "$lib/util/firebase";

let docs = [];
let user = null;
let error = null;

export async function load({ params, locals }) {
    const currentUser = locals.user;
    const reqRoute = params.slug;    

    if (reqRoute === currentUser.username) {
        console.log("User is logged in");
    }

    // Fetch user data
    const userRef = doc(db, "users", reqRoute);
    const collRef = collection(userRef, "docs");

    try {
        const querySnapshot = await getDoc(userRef);
        user = querySnapshot.data();

        const querySnapshot2 = await getDocs(collRef);
        docs = querySnapshot2.docs.map(doc => doc.data());

        // Pass the data to the client
        return {
            user: user,
            docs: docs
        };

    } catch (err) {
        error = err.message;
        console.error("Error fetching user data:", err);
    }
}
