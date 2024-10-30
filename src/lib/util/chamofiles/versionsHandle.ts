import { db } from "$lib/util/firebase";
import { collection, getDocs, query, doc, runTransaction, Timestamp, type DocumentData } from "firebase/firestore";

const getVersions = async (uID: string) => {
    try {
        const collRef = collection(db, 'chamofiles', uID, 'versions');
        const q = query(collRef);
        const querySnapshot = await getDocs(q);

        const versions: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
            versions.push(doc.data());
        });
        
    } catch (error) {
        console.error("Error querying documents:", error);
        throw error;
    }
}

const updateVersion = async (uID: string, content: string, title: string, topics: string[]) => {
    const chamofileDocRef = doc(db, 'chamofiles', uID);
    const versionsCollectionRef = collection(chamofileDocRef, 'versions');
    try {
        // Use a transaction to save the new version and update the main document
        await runTransaction(db, async (transaction) => {
            const chamofileDoc = await transaction.get(chamofileDocRef);
            console.log("Document retrieved:", chamofileDoc.data());
            console.log(chamofileDoc.exists());


            if (chamofileDoc.exists()) {
                console.log("chamofile exists");

                const data = chamofileDoc.data();
                let latestVersion = data.latestVersion;

                // Convert timestamps to milliseconds for comparison
                const lastUpdate = data.updatedAt.toMillis();
                const currentTime = Timestamp.now().toMillis();

                // Check if more than one hour has passed
                if (currentTime - lastUpdate > 3600 * 1000) {
                    // Add a new version document if more than one hour has passed
                    const newVersionNumber = latestVersion + 1;
                    console.log("creating new version" + String(newVersionNumber));


                    const newVersionDocRef = doc(versionsCollectionRef, String(newVersionNumber));
                    transaction.set(newVersionDocRef, {
                        content: content,
                        updatedAt: Timestamp.now(),
                        version: latestVersion + 1
                    });
                    // If there is an existing version, update it
                } else if (latestVersion > 0) {
                    // updating current version
                    console.log("updating most recent version" + latestVersion);

                    transaction.update(doc(versionsCollectionRef, latestVersion.toString()), {
                        content: content,
                        updatedAt: Timestamp.now(),
                    })
                }

                // Update the main chamofile document
                transaction.update(chamofileDocRef, {
                    updatedAt: Timestamp.now(),
                    latestVersion: latestVersion + 1,
                    title: title,
                    topics: topics // Replace the topics only if passed, otherwise retain existing ones
                });

                // Make a new Version document
                transaction.set(doc(versionsCollectionRef, (latestVersion).toString()), {
                    content: content,
                    updatedAt: Timestamp.now(),
                    //Add a timestamp for each write on the document, needs a counter
                    write: Timestamp.now()
                })
            } 
        });
    } catch (error) {
        console.error("Error saving chamofile:", error);
        throw error;
    }
}

export const versionsQuery = { getVersions };
export const versionsCRUD = { updateVersion }