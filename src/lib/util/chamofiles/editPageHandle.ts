import { versionsCRUD } from "$lib/util/chamofiles/versionsHandle";
import ChamofileService from "$lib/util/chamofiles/chamofileHandle";
import type { Timestamp } from "firebase-admin/firestore";

interface ChamofileData {
    timestamp: number;
    content: string;
}

// Add interface for Firebase data structure
interface FirebaseData {
    content: string;
    createdAt: Timestamp;
}

class ChamofileEditor {
    private chamofileService: ChamofileService;
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;
    private lastSavedValue: string | null = null;

    constructor(dbInstance: any) {
        this.chamofileService = new ChamofileService();
    }

    debouncedSaveToFirebase(
        content: string,
        docID: string,
        title: string,
        topics: string[],
    ): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            if (content !== this.lastSavedValue) {
                versionsCRUD.updateVersion(docID, content, title, topics);
                this.lastSavedValue = content;
            }
        }, 5000);
    }

    saveToLocalStorage(content: string): void {
        const timestamp = Date.now();
        localStorage.setItem(
            "markdownContent",
            JSON.stringify({ content, timestamp }),
        );
    }

    loadFromLocalStorage(): ChamofileData | null {
        console.log("Attempting to load from local storage");
        const stored = localStorage.getItem("markdownContent");
        if (stored) {
            return JSON.parse(stored);
        }
        console.log("No stored data found");
        return null;
    }

    async loadEditor(
        docID: string,
        title: string,
        topics: string[],
    ): Promise<{ value: string; lastSavedValue: string | null }> {
        let value = ""; 
        const localData = this.loadFromLocalStorage();
        const firebaseData = await this.chamofileService.fetchByID(docID) as FirebaseData | null;

        if (localData && firebaseData?.createdAt) {
            // Compare timestamps - ensure firebaseData.createdAt exists
            value = localData.timestamp > firebaseData.createdAt.toMillis()
                ? localData.content
                : firebaseData.content;
            this.lastSavedValue = value;
        } else if (localData) {
            value = localData.content;
            console.log("Syncing local data to Firebase " + docID);
            await versionsCRUD.updateVersion(docID, value, title, topics);
            this.lastSavedValue = value;
        } else if (firebaseData) {
            value = firebaseData.content;
            this.lastSavedValue = value;
        } else {
            console.log("No data available from either source");
            // value is already initialized as empty string
        }

        return { value, lastSavedValue: this.lastSavedValue };
    }
}

export { ChamofileEditor };