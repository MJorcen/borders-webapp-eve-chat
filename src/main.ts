import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "amfe-flexible";
import router from "@/router";
import "tailwindcss/tailwind.css";
import pinia from "@/stores/index";
import Vconsole from "vconsole";
import vant from "vant";
import "vant/lib/index.css";
import { Lazyload } from "vant";
import { ImagePreview } from "vant";
import useWebSocketHeartbeat from "@/hook/useWebScoket";

const { connectWebSocket } = useWebSocketHeartbeat();

// 应用刷新重进后连接ws
const userInfo = localStorage.getItem("userInfo");
if (userInfo) {
  connectWebSocket();
}

if (import.meta.env.NODE_ENV !== "prod") {
  new Vconsole();
}


const app = createApp(App);

// app.config.globalProperties.nim = nim;
app.use(router);
app.use(pinia);
app.use(vant);
// app.use(nim);
app.mount("#app");
app.use(Lazyload);
app.use(ImagePreview);

app.use(Lazyload, {
  lazyComponent: true,
});

// 屏蔽警告信息
app.config.warnHandler = () => null;
