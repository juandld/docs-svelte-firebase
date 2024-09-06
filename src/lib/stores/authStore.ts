// src/stores/authStore.ts
import { writable } from 'svelte/store';

const initialState = {
  currentUser: null,
  isLoading: true,
};

export const authStore = writable(initialState);
