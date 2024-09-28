import { writable } from 'svelte/store';
import type { User } from '../types/user';

type AuthState = {
  email: string | undefined;
  uid: string | null | undefined;
};

export const authStore = writable<AuthState>({
  email: undefined,
  uid: undefined
});



