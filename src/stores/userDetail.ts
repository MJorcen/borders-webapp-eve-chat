import { defineStore } from "pinia";

export const useUserDetailStore = defineStore("userDetail", {
  state: () => {
    return {
      userDetail: {},
    };
  },
  getters: {},
  actions: {
    setUser(op: any) {
      this.userDetail = op;
      localStorage.setItem("userDetail", JSON.stringify(this.userDetail));
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["userDetail"] }],
  },
});
