import { db } from "$lib/util/firebase";
import { 
    doc, getDoc, collection, Timestamp, query, getDocs, 
    where, setDoc, updateDoc, runTransaction, type DocumentData 
} from "firebase/firestore";

interface ChamofileData {
    latestVersion: number;
    isPublic: boolean;
    author: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    title: string;
    topics: string[];
    content?: string; // Optionally include content for certain operations
}

class ChamofileService {
    private db: any;

    constructor() {
        this.db =  db; // Allow passing custom Firestore instance
    }

    /** Fetch a chamofile by its document ID */
    async fetchByID(uID: string): Promise<ChamofileData | null> {
        try {
            const docRef = doc(this.db, 'chamofiles', uID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data() as ChamofileData;
            } else {
                console.log(`Chamofile with ID ${uID} does not exist.`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching chamofile:", error);
            throw error;
        }
    }

    /** Fetch public chamofiles by a username */
    async fetchPublicByUsername(username: string): Promise<ChamofileData[]> {
        try {
            const collectionRef = collection(this.db, 'chamofiles');
            const q = query(collectionRef, where('username', '==', username), where('isPublic', '==', true));
            const querySnapshot = await getDocs(q);

            const chamofiles: ChamofileData[] = [];
            querySnapshot.forEach((doc) => chamofiles.push(doc.data() as ChamofileData));
            return chamofiles;
        } catch (error) {
            console.error("Error fetching public chamofiles:", error);
            throw error;
        }
    }

    /** Fetch all chamofiles by a username */
    async fetchAllByUsername(username: string): Promise<ChamofileData[]> {
        try {
            const collectionRef = collection(this.db, 'chamofiles');
            const q = query(collectionRef, where('author', '==', username));
            const querySnapshot = await getDocs(q);

            const chamofiles: ChamofileData[] = [];
            querySnapshot.forEach((doc) => chamofiles.push(doc.data() as ChamofileData));
            return chamofiles;
        } catch (error) {
            console.error("Error fetching chamofiles by username:", error);
            throw error;
        }
    }

    /** Create a new chamofile */
    async create(author: string, title: string = '', topics: string[] = [], isPublic: boolean = true): Promise<string> {
        const chamofileDocRef = doc(collection(this.db, 'chamofiles'));
        try {
            const newChamofile: ChamofileData = {
                latestVersion: 0,
                isPublic,
                author,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                title,
                topics,
            };

            await setDoc(chamofileDocRef, newChamofile);
            return chamofileDocRef.id; // Return the document ID
        } catch (error) {
            console.error("Error creating chamofile:", error);
            throw error;
        }
    }

    /** Update an existing chamofile */
    async update(uID: string, content: string, title?: string, topics?: string[]): Promise<void> {
        const chamofileDocRef = doc(this.db, 'chamofiles', uID);
        try {
            const updateData: Partial<ChamofileData> = {
                content,
                title: title || '',
                topics: topics || [],
                updatedAt: Timestamp.now(),
            };

            await updateDoc(chamofileDocRef, updateData);
        } catch (error) {
            console.error("Error updating chamofile:", error);
            throw error;
        }
    }

    /** Delete a chamofile (with optional version deletion) */
    async delete(uID: string, deleteVersions: boolean = false): Promise<void> {
        try {
            const chamofileDocRef = doc(this.db, 'chamofiles', uID);
            await runTransaction(this.db, async (transaction) => {
                transaction.delete(chamofileDocRef);

                if (deleteVersions) {
                    const versionsRef = collection(this.db, `chamofiles/${uID}/versions`);
                    const versionDocs = await getDocs(versionsRef);
                    versionDocs.forEach((doc) => transaction.delete(doc.ref));
                }
            });
            console.log(`Chamofile ${uID} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting chamofile:", error);
            throw error;
        }
    }

    /** Additional method to fetch specific versions */
    async fetchVersion(uID: string, versionNumber: number): Promise<DocumentData | null> {
        try {
            const versionRef = doc(this.db, `chamofiles/${uID}/versions`, versionNumber.toString());
            const versionSnap = await getDoc(versionRef);
            if (versionSnap.exists()) {
                return versionSnap.data();
            } else {
                console.log(`Version ${versionNumber} of chamofile ${uID} not found.`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching version ${versionNumber}:`, error);
            throw error;
        }
    }
}

export default ChamofileService;
