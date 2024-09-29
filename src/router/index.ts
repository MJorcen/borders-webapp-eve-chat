import routes from "./routes";
import { createRouter, createWebHistory } from "vue-router";
import pinia, { useKeepAliveStore } from "@/stores";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from: any) => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) {
    if (!["Login"].includes(to.name as string)) {
      return {
        name: "Login",
        query: {
          redirect: to.fullPath,
        },
      };
    }
    return true;
  } else {
    console.log("to.name:::", to.name);
    return true;
  }
});

export default router;
