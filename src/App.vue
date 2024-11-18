<template>
  <div class="appBox">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <keep-alive :include="['HostList', 'Messages', 'Dynamic', 'MatchHome']">
          <component :is="Component" :key="route.path"> </component>
        </keep-alive>
      </transition>
    </router-view>
    <div class="dialogBox">
      <!-- 正常通话弹窗 -->
      <CallDialog
        ref="callDialogRef"
        v-model="showCallDialog"
        v-model:wsData="state.wsData"
      ></CallDialog>
      <!-- 正常通话详情 -->
      <CallDetail
        :wsData="state.wsData"
        v-model="state.showCallDetail"
        :call-id="state.wsData?.call?.id"
      ></CallDetail>
      <!-- 免费通话详情 -->
      <CallFreeDetail
        :wsData="state.callFreeWsData"
        v-model="state.showCallFreeDetail"
      ></CallFreeDetail>
      <!-- 免费通话弹窗 -->
      <CallFreeDialog
        :wsData="state.wsData"
        v-model="state.showFreeDialog"
        @handleCallHangUp="audioRef.muted = true"
        @handleCallPickUp="audioRef.muted = true"
        @handleCallFrend="
          (res, currentTime, isPick) => {
            state.callFreeWsData = { ...res, currentTime: currentTime };
            console.log(`resres`, res);
            state.showFreeDialog = false;
            if (isPick) {
              state.showCallFreeDetail = true;
            }
          }
        "
      ></CallFreeDialog>
    </div>
  </div>
  <!-- 顶部通知消息 -->
  <TopNotification
    v-model="state.showNotification"
    :wsData="state.notificationData"
  ></TopNotification>
  <!-- 音频铃声 -->
  <audio style="display: none" controls loop muted ref="audioRef">
    <source src="./assets/call.mp3" />
  </audio>
  <!-- 谷歌地图 -->
  <div style="display: none">
    <div id="map"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import CallDialog from "@/components/callDialog/index.vue";
import evenBus from "@/common/evenBus";
import { useZego } from "@/hook/useZego";
import { useUserDetailStore } from "@/stores/userDetail";
import CallDetail from "@/components/callDetail/index.vue";
import CallFreeDialog from "@/components/callFreeDialog/index.vue";
import CallFreeDetail from "@/components/callFreeDetail/index.vue";
import Cookies from "js-cookie";
import { userDetail } from "@/api/allApi";
import {
  generateRandomString,
  getLocalMsgList,
  getPositionObj,
  haversine,
} from "./common/utils";
import useWebSocketHeartbeat from "@/hook/useWebScoket";
import TopNotification from "@/components/topNotification/index.vue";
import { useRouter } from "vue-router";

const { setUser, user }: any = useUserDetailStore();

const { fetchData, data } = userDetail();

const state = reactive<any>({
  wsData: {},
  showCallDetail: false,
  showFreeDialog: false,
  callFreeWsData: {},
  showCallFreeDetail: false,
  notificationData: {},
  showNotification: false,
});

const audioRef = ref<any>(null);

const showCallDialog = ref(false);

const callDialogRef = ref<any>(null);

evenBus.on("updateTopNotification", (data: any) => {
  let localCustomObj: any = {};
  try {
    localCustomObj = JSON?.parse(data?.localCustom);
  } catch (e) {}

  if (data?.localCustom && localCustomObj?.unread === 0) return;
  if (!data?.localCustom && data?.unread === 0) return;

  const noticeData = data;
  nim.getUser({
    account: !data?.localCustom
      ? data?.lastMsg?.from
      : `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          localCustomObj.fromUserId
        }`,
    done: (error: any, user: any) => {
      noticeData.avatar = user?.avatar;
      noticeData.nick = user?.nick;
      state.notificationData = noticeData;

      state.showNotification = true;
    },
  });
});

evenBus.on("inviteCall", async (data: any) => {
  const isPlaying = localStorage.getItem("isPlayingGame");
  // 被呼叫时
  if (data[0].body.type === "call/dial") {
    if (isPlaying) return;
    // 判断是否已在通话中
    const isCall = localStorage.getItem("isCall");
    if (isCall === "true") {
      return;
    }

    // audioRef.value.play();
    audioRef.value.muted = false;

    evenBus.emit("byeCall");
    // callDialogRef.value.state.isReactive = false;
    showCallDialog.value = true;
    state.wsData = data[0].body.data;
  }
  // 主动呼叫时
  if (data[0].body.type === "call/pickUp") {
    if (isPlaying) return;

    // callDialogRef.value.state.isReactive = false;
    // showCallDialog.value = true;
    evenBus.emit("activeCall", { ...data[0].body.data, type: "call/dial" });
    //匹配接听后传值过去隐藏停止匹配按钮
    evenBus.emit("matchDone");
  }
  //开始收费的通知
  if (data[0].body.type === "call/data") {
    audioRef.value.muted = true;
  }
  // 免费通话
  if (data[0].body.type === "freeCall/dial") {
    if (isPlaying) return;

    // alert("免费通话");
    const isFreeCalling = localStorage.getItem("isFreeCalling");
    if (isFreeCalling === "true") {
      return;
    }
    state.wsData = data[0].body.data;
    state.showFreeDialog = true;
    audioRef.value.muted = false;
  }
  // 挂断通话
  if (data[0].body.type === "call/hangUp") {
    const { zg } = useZego();
    zg.logoutRoom(data[0].body.data.call.id);
    audioRef.value.muted = true;
    showCallDialog.value = false;

    if (data[0].body.data.call.duration > 0) {
      state.showCallDetail = true;
    }
  }
  // 收到支付成功的通知
  if (data[0].body.type === "payment/success") {
    await fetchData();
    setUser(data.value);
    const link_id = localStorage.getItem("link_id");
    const extra = {
      currency: "USD",
      value: data[0].body.data?.money,
    };
    const obj = {
      link_id,
      event_name: "Purchase",
      extra: extra,
    };
    try {
      const response = await fetch(
        "https://sdk-report.bttzs.com/report/fb/event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
  // 插入定位信息
  if (
    data[0].body?.type === "im/p2p/msg/insert" &&
    data[0].body?.data?.type === "maps"
  ) {
    const resPosition: any = await getPositionObj(data);

    const fromArrMsg: any = await getLocalMsgList(data);
    const idClient = generateRandomString(10);
    const insetObj = {
      unread: fromArrMsg.length,
      bodyString: "[Maps]",
      name: resPosition?.[0]?.name,
      position: {
        lat: resPosition?.[0]?.geometry?.location?.lat(),
        lng: resPosition?.[0]?.geometry?.location?.lng(),
      },
      vicinity: resPosition?.[0]?.vicinity,
      cusstomMsg: JSON.stringify(data[0].body.data),
      ts: new Date().getTime(),
      time: new Date().getTime(),
      fromUserId: data[0].body.data.from,
    };

    nim.saveMsgsToLocal({
      msgs: [
        {
          from: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.from
          }`,
          to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.to
          }`,
          scene: "p2p",
          sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.from
          }`,
          needPushNick: true,
          target: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.to
          }`,
          type: "text",
          text: JSON.stringify(insetObj),
          time: new Date().getTime(),
          idClient: idClient,
          status: "success",
          isUnreadable: true,
        },
      ],
      done: saveMsgsToLocalDone,
    });

    function saveMsgsToLocalDone(error: any, obj1: any) {
      console.log("我被执行了");
      console.log(error);
      console.log(obj1, "插入的会话构造体");
      console.log("插入本地消息" + (!error ? "成功" : "失败"));
      nim.insertLocalSession({
        scene: "p2p",
        to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          data[0].body.data?.from
        }`,
        done: () => {
          nim.updateLocalSession({
            localCustom: JSON.stringify(insetObj),
            id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
              data[0].body.data?.from
            }`,
            done: (err: any, obj: any) => {
              console.log(`output->错误`, err);
              console.log(`output->更新的会话结构`, obj);
            },
          });
        },
      });
    }
  }
});

let nim: any;

evenBus.on("setFunc", (data: any) => {
  nim = data;
});

// 处理ws发送的消息插入到本地数据库
evenBus.on("onSendMsg", async (data: any) => {
  if (
    data[0].body.type === "im/p2p/msg/insert" &&
    data[0].body.data.subType === 0 &&
    data[0]?.body?.data?.type !== "maps"
  ) {
    const idClient = generateRandomString(10);

    const fromArrMsg: any = await getLocalMsgList(data);

    const obg = {
      unread: fromArrMsg.length,
      // cusstomMsg: fromArrMsg[fromArrMsg.length - 1].bodyString,
      cusstomMsg: data[0].body.data.bodyString,
      idClient: idClient,
      time: data[0].body.data.ts,
      fromUserId: data[0].body.data.from,
    };

    nim.saveMsgsToLocal({
      msgs: [
        {
          from: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.from
          }`,
          to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.to
          }`,
          scene: "p2p",
          sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.from
          }`,
          needPushNick: true,
          target: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data[0].body.data?.to
          }`,
          type: "text",
          text: data[0].body.data?.bodyString,
          time: new Date().getTime(),
          idClient: idClient,
          status: "success",
          isUnreadable: true,
        },
      ],
      done: saveMsgsToLocalDone,
    });
    function saveMsgsToLocalDone(error: any, obj: any) {
      console.log("我被执行了");
      console.log(error);
      console.log(obj, "插入的会话构造体");
      console.log("插入本地消息" + (!error ? "成功" : "失败"));
      nim.insertLocalSession({
        scene: "p2p",
        to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          data[0].body.data?.from
        }`,
        done: insertLocalSessionDone,
      });
    }
    function insertLocalSessionDone(error: any, obj: any) {
      console.log(error);
      console.log(obj, "插入的本地会话结构体");
      console.log("插入本地会话" + (!error ? "成功" : "失败"));

      nim.updateLocalSession({
        localCustom: JSON.stringify(obg),
        id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          data[0].body.data?.from
        }`,
        done: (err: any, obj: any) => {
          console.log(`output->错误`, err);
          console.log(`output->更新的会话结构`, obj);
        },
      });
    }
  }
});

const { connectWebSocket } = useWebSocketHeartbeat();

onMounted(async () => {
  // 监听是否在触碰屏幕。在的话，播放音乐
  document.addEventListener(
    "touchmove",
    (e) => {
      // screenfull.request();
      audioRef?.value?.play();
      // e.preventDefault();
    }
    // { passive: false }
  );
  // 监听是否重新返回程序
  document.addEventListener("visibilitychange", handleVisibilityChange);
  // 切换语言 仅供测试使用
  (window as any)?.translate?.changeLanguage("english");
});

onUnmounted(() => {
  window.removeEventListener("touchmove", () => {
    audioRef?.value?.pause();
  });
});

const dataObj = {
  body: {
    path: "active/off",
    code: 0,
  },
  ts: new Date().getTime(),
  tp: 10,
  id: generateRandomString(10),
};

const handleVisibilityChange = async () => {
  console.log(`我重新进来了`, document.visibilityState);
  if (document.visibilityState === "hidden") {
    window.removeEventListener("visibilitychange", () => {});
    Cookies.remove("showDownLoadPopups");
    window.wsConnet?.send(JSON.stringify(dataObj));
    window.wsConnet?.close();
  } else {
    await connectWebSocket(true);
    await fetchData();
    setUser(data.value);
  }
};

const router = useRouter();

let position = 0;

router.beforeEach((to) => {
  // if (to?.name === "AnchorDetail") return;
  if (to.name === "ChatRoom") {
    state.showNotification = false;
  }
  // 判断是前进还是返回
  const isBack = position > window.history.state.position;
  to.meta.transition = isBack ? "slide-right" : "slide-left";
});

router.afterEach((to) => {
  // 跳转后清空
  position = window.history.state?.position || 0;
});
</script>
<style lang="scss" scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 300ms ease, opacity 400ms step-end;
  backface-visibility: hidden;
  width: 100vw;
  height: 100vh;
}

.slide-left-enter-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #241213;
}

.slide-right-leave-active {
  z-index: 99;
}

.slide-left-enter-active {
  background-color: #241213;
}

.slide-left-enter-from {
  transform: translateX(80vw);
}

.slide-right-enter-from {
  transform: translateX(-10vw);
}

.slide-right-leave-from {
  transform: translateX(40vw);
}

.slide-right-leave-active {
  transform: translateX(100vw);
}
.appBox {
  position: relative;
  /* slide */

  .dialogBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
  }
}
</style>
