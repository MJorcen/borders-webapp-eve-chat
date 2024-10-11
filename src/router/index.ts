import routes from "./routes";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useWebSocketHeartbeat from "@/hook/useWebScoket";

NProgress.configure({ showSpinner: true })

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const { isConnect, connectWebSocket } = useWebSocketHeartbeat();

router.beforeEach((to, from: any) => {
  const userInfo = localStorage.getItem("userInfo");
  NProgress.start()
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

router.afterEach(() => {
  NProgress.done()
})

document.addEventListener("click", () => {
  console.log(`ws连接状态`, isConnect.value);
  if (!isConnect.value) {
    connectWebSocket();
  }
});

export default router;
