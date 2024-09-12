import { writable } from 'svelte/store';
import type { User } from '../types/user';

type AuthState = {
  currentUser: User | null;
};

export const authStore = writable<AuthState>({
  currentUser: null
});



