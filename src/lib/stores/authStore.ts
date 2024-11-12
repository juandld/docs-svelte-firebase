import { writable } from 'svelte/store';
import type { User } from '../types/user';

type AuthState = {
  currentUser: User | undefined;
  isLoading: boolean;
};

export const authStore = writable<AuthState>({
  currentUser: undefined,
  isLoading: true
});



