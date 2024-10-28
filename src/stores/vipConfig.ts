import { defineStore } from "pinia";

export const useVipConfigStore = defineStore("vipConfigData", {
  state: () => {
    return {
      vipConfigData: {},
    };
  },
  getters: {},
  actions: {
    setVipConfigData(op: any) {
      this.vipConfigData = op;
      localStorage.setItem("vipConfigData", JSON.stringify(this.vipConfigData));
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["vipConfigData"] }],
  },
});
