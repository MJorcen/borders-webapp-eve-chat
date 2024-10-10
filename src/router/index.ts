import routes from "./routes";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import useWebSocketHeartbeat from "@/hook/useWebScoket";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const { isConnect, connectWebSocket } = useWebSocketHeartbeat();

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

document.addEventListener("click", () => {
  console.log(`ws连接状态`, isConnect.value);
  if (!isConnect.value) {
    connectWebSocket();
  }
});

export default router;
