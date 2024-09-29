import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
    };
  },
  getters: {},
  actions: {
    setUser(op: any) {
      this.user = op;
      localStorage.setItem("userInfo", JSON.stringify(this.user));
    },
    // remoUser() {
    //   localStorage.removeItem("userInfo");
    // },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["user"] }],
  },
});
