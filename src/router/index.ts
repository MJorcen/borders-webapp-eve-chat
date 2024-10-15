import routes from "./routes";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: true });

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from: any) => {
  let loadingDom: any = document.getElementById("app-loading-wrapper");
  loadingDom.parentNode.removeChild(loadingDom);
  const userInfo = localStorage.getItem("userInfo");
  NProgress.start();
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
  NProgress.done();
});

export default router;
