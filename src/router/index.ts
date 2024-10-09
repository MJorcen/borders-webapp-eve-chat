import routes from "./routes";
import { createRouter, createWebHistory } from "vue-router";
import useWebSocketHeartbeat from "@/hook/useWebScoket";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const { ws, connectWebSocket } = useWebSocketHeartbeat();

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
    if (ws?.value?.readyState === 3) {
      connectWebSocket();
    }
    // 存在用户信息的时候不需要去登录页面
    if (userInfo && to.name === "Login") {
      return {
        name: "HostList",
        query: {
          redirect: to.fullPath,
        },
      };
    }
    return true;
  }
});

export default router;
