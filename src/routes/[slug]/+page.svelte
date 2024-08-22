<script>
    import { page } from '$app/stores';
    import { db } from '$lib/firebase/config';
    import { getDoc, doc } from "firebase/firestore";
    import { onMount } from 'svelte';

    // Assuming slug is a URL parameter representing the username
    let username = $page.params.slug || '';
    const docRef = doc(db, "users", username);

    let user = null;
    let error = null;

    async function fetchUserByUsername() {
        try {
            const querySnapshot = await getDoc(docRef);
            user = querySnapshot.data();
            console.log("User data:", user);
            
        } catch (err) {
            error = err.message; // Store the error message for display
            console.error("Error fetching user data:", err);
            // Consider setting an error state or showing an error message to the user
        }
    }

    onMount(fetchUserByUsername);
</script>

<!-- Display user data or error message -->
{#if user}
    <div>User found:</div>
    <pre>{JSON.stringify(user, null, 2)}</pre>
{:else if error}
    <div>Error: {error}</div>
{/if}
