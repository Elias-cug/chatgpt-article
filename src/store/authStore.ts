import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: null
  }),
  getters: {

  },
  actions: {
    setToken(token: string) {
      this.token = token
    }
  },
})
