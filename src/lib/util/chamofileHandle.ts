import { db } from "$lib/util/firebase";
import { runTransaction, doc, getDoc, collection, Timestamp } from "firebase/firestore";

const findChamofilewText = async (username: string) => {
    // Implementation goes here (probably a query based on a username field)
}
const getChamofilewID = async (uID: string) => {
    try {
        const docRef = doc(db, 'chamofiles', uID);
        const docSnap = (await getDoc(docRef));
        console.log("Document data:", docSnap);
        
        if (docSnap.exists()) {
            console.log("chamofile exists");
            console.log("Document data:", docSnap.data());
            
            return docSnap.data();
        } 
    } catch (error) {
        console.error("Error querying documents:", error);
        throw error;
    }
}

const saveChamofile = async (uID: string, content: string, title: string, topics: string[]) => {
    const chamofileDocRef = doc(db, 'chamofiles', uID);
    const versionCollectionRef = collection(chamofileDocRef, 'versions');
    console.log('trying to save chamofile');
    
    try {
        // Use a transaction to save the new version and update the main document
        await runTransaction(db, async (transaction) => {
            const chamofileDoc = await transaction.get(chamofileDocRef);
            let latestVersion = 1;

            if (chamofileDoc.exists()) {
                console.log("chamofile exists");
                
                const data = chamofileDoc.data();
                latestVersion = data.latestVersion;

                // Convert timestamps to milliseconds for comparison
                const lastUpdate = data.updatedAt.toMillis();
                const currentTime = Timestamp.now().toMillis();

                // Check if more than one hour (3600 seconds) has passed
                if (currentTime - lastUpdate > 3600 * 1000) {
                    // Add a new version document if more than one hour has passed
                    await transaction.set(doc(versionCollectionRef), {
                        content: content,
                        updatedAt: Timestamp.now(),
                        version: latestVersion + 1
                    });
                } else {
                    console.log("updating most recent version");
                    // updating current version
                    await transaction.update(doc(versionCollectionRef, latestVersion.toString()), {
                        content: content,
                        updatedAt: Timestamp.now(),
                    })
                }

                // Update the main chamofile document
                await transaction.update(chamofileDocRef, {
                    updatedAt: Timestamp.now(),
                    latestVersion: latestVersion,
                    title: title,
                    topics: topics // Replace the topics only if passed, otherwise retain existing ones
                });

            } else {
                console.log("creating new version");
                // Create a new chamofile document if it doesn't exist
                await transaction.set(chamofileDocRef, {
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                    title: title,
                    latestVersion: 1,
                    topics: topics,
                });

                // Add the initial version to the 'versions' subcollection
                await transaction.set(doc(versionCollectionRef), {
                    
                    content: content,
                    updatedAt: Timestamp.now(),
                    version: 1
                });
            }
        });
    } catch (error) {
        console.error("Error saving chamofile:", error);
        throw error;
    }
}

const deleteChamofile = async (uID: string) => {
    try {
        const chamofileDocRef = doc(db, 'chamofiles', uID);
        await runTransaction(db, async (transaction) => {
            // Remove chamofile document and possibly its versions if needed
            transaction.delete(chamofileDocRef);
            // Optionally, you can also delete versions if required
            console.log(`Chamofile ${uID} deleted successfully`);
        });
    } catch (error) {
        console.error("Error deleting chamofile:", error);
        throw error;
    }
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
