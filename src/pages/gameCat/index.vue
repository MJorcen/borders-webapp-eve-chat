<template>
  <div class="bigBox">
    <!-- https://greedy-cat.duome.live/greedy-cat.html#/ -->
    <iframe
      ref="iframeRef"
      class="iframe"
      :src="
        isDev === 'development' ? 'http://localhost:8008/greedy-cat.html#/' : token.url
      "
      width="100%"
      height="1000px"
      frameborder="0"
      @load="onIframeLoad"
    ></iframe>
    <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted } from "vue";
import { gametoken } from "@/api/allApi";
import { useUserStore } from "@/stores/user";

const token = ref<any>("");
const { user }: any = useUserStore();
const { fetchData, data } = gametoken();

const state = reactive({
  showRechargePopup: false,
});

onMounted(() => {
  localStorage.setItem("isPlayingGame", "true");
  window.addEventListener("message", (event) => {
    const data = event.data.data;
    if (data.code === "success") {
      if (data.isCallNotice) {
        localStorage.setItem("isPlayingGame", "true");
      } else {
        localStorage.removeItem("isPlayingGame");
      }
    }
  });
});

onUnmounted(() => {
  localStorage.removeItem("isPlayingGame");
  window.removeEventListener("message", () => {});
});

const iframeRef = ref<any>(null);

const isDev = import.meta.env.VITE_NODE_ENV;
const onIframeLoad = async () => {
  await fetchData();
  token.value = data.value;
  let info: any = {};
  info.token = token.value?.token;
  info.uid = user?.user?.id;
  // 确保 iframe 加载完成后再发送消息
  if (iframeRef.value.contentWindow) {
    const message = {
      info: JSON.stringify(info),
    };
    iframeRef.value.contentWindow.postMessage(
      message,
      isDev === "development"
        ? "http://localhost:8008/greedy-cat.html#/"
        : token.value.url
    );
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  height: 100%;
  background-color: #c91e31;
  .iframe {
    width: 100%;
    height: 100vh;
  }
}
</style>
