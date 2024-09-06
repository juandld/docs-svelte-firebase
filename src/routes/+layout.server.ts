// +layout.server.ts
import { auth } from '$lib/util/firebase'; // Assuming you have a firebase.js file in your src/lib directory
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { goto } from '$app/navigation';
export const load = async ({ locals }) => {
  // Initialize Firebase Authentication
  if (!auth) {
    throw new Error('Firebase Authentication is not Connected or online in some way');
  }

  // Check if the user is already authenticated
  const user = auth.currentUser;

  console.log('user', user);
  
  // If not authenticated, redirect to login page
  if (!user) {
    return {redirect: "redirect to login"}
  }

  return   {redirect: "redirect to nada loser"}
};
