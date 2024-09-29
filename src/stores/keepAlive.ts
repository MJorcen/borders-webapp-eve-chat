import { defineStore } from "pinia";

// export const useKeepAliveStore = defineStore("keepAlive", {
//   state: () => {
//     return {
//       list: [] as any[],
//       refreshStatus: null as any,
//     };
//   },
//   getters: {},
//   actions: {
//     setData(list: any) {
//       console.log("setData");
//       this.list = list;
//     },
//     setClear() {
//       this.list = [];
//     },
//     setRefreshStatus(val: () => void) {
//       this.refreshStatus = val;
//     },
//   },
//   persist: {
//     enabled: true,
//     strategies: [{ storage: localStorage }],
//   },
// });

export interface KeepAliveState {
  keepAliveComponents: Array<any>;
}

export const useKeepAliveStore = defineStore("keepAlive", {
  state: (): KeepAliveState => {
    return {
      keepAliveComponents: [],
    };
  },

  getters: {
    getKeepAliveComponents(state) {
      return state.keepAliveComponents;
    },
  },

  actions: {
    // 加入到缓存队列
    setKeepAlive(component: any) {
      if (!this.keepAliveComponents.includes(component)) {
        this.keepAliveComponents.push(component);
      }
      console.log("keepAliveComponents", this.keepAliveComponents);
    },

    // 从缓存队列移除
    removeKeepAlive(component: any) {
      const index = this.keepAliveComponents.indexOf(component);
      if (index !== -1) {
        this.keepAliveComponents.splice(index, 1);
      }
    },
  },
});
