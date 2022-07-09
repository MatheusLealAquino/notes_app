import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { User } from '../components/models';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: useStorage('user', {
      id: '',
      name: '',
      email: '',
    } as User),
  }),
  getters: {
    isLogged(): boolean {
      return !!(this.user.id && this.user.name && this.user.email);
    },
  },
  actions: {
    async authenticateWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        this.user.id = result.user.uid as string;
        this.user.email = result.user.email as string;
        this.user.name = result.user.displayName as string;
        this.user.lastLoginAt = new Date();
      } catch (error: any) {
        console.error(error);
      }
    },
  },
});
