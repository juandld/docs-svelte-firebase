import { chamofileCRUD } from '$lib/util/chamofiles/chamofileHandle';


interface ChamofileData {
    timestamp: number; // or string, depending on your data format
    content: string;
}

let value: string = '';
let docID: string = 'examplusMaximus';
let title: string = 'Untitled masterpiece';
let topics = ['topic1', 'topic2', 'topic3'];
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastSavedValue: string | null = null; // Keep track of the last saved value

// Function to save to Firebase based on debounce
function debouncedSaveToFirebase(content: string) {
    if (debounceTimer) {
        clearTimeout(debounceTimer); // Clear the existing timer
    }

    // Set a new timeout with a 5-second delay
    debounceTimer = setTimeout(() => {
        // Only save if the content has changed
        if (content !== lastSavedValue) {
            chamofileCRUD.saveChamofile(docID, content, title, topics);
            lastSavedValue = content; // Update the last saved value
        } else {
            return;
        }
    }, 5000); // 5 seconds delay
}

// Function to save to local storage
function saveToLocalStorage(content: string) {
    const timestamp = Date.now();
    localStorage.setItem('markdownContent', JSON.stringify({ content, timestamp }));
}

// Function to load from local storage
function loadFromLocalStorage(): ChamofileData | null {
    const stored = localStorage.getItem('markdownContent');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

// Load from local storage and sync to/from firebase
// Explicitly declare the types
const localData: ChamofileData | null = loadFromLocalStorage();
const firebaseData = await chamofileCRUD.getChamofilewID(docID);

if (localData && firebaseData) {
    // Ensure timestamps exist and are valid numbers before comparison
    if (localData.timestamp && firebaseData.timestamp) {
        value =
            localData.timestamp > firebaseData.timestamp ? localData.content : firebaseData.content;
    }
} else if (localData) {
    value = localData.content;
    // Sync the local data to Firebase
    await chamofileCRUD.saveChamofile(docID, value, title, topics);
    lastSavedValue = value; // Initialize last saved value
} else if (firebaseData) {
    value = firebaseData.content;
    lastSavedValue = value; // Initialize last saved value
}

// Optional: Handle case where both localData and firebaseData are null/undefined
if (!value) {
    console.log('No data available from either source');
}
