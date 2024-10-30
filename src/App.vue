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
      <CallDialog
        ref="callDialogRef"
        v-model="showCallDialog"
        v-model:wsData="state.wsData"
      ></CallDialog>
      <CallDetail
        :wsData="state.wsData"
        v-model="state.showCallDetail"
        :call-id="state.wsData?.call?.id"
      ></CallDetail>
      <CallFreeDetail
        :wsData="state.callFreeWsData"
        v-model="state.showCallFreeDetail"
      ></CallFreeDetail>
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
  <TopNotification
    v-model="state.showNotification"
    :wsData="state.notificationData"
  ></TopNotification>
  <audio style="display: none" controls loop muted ref="audioRef">
    <source src="./assets/call.mp3" />
  </audio>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import CallDialog from "@/components/callDialog/index.vue";
import evenBus from "@/common/evenBus";
import { useZego } from "@/hook/useZego";
import { useUserDetailStore } from "@/stores/userDetail";
import CallDetail from "@/components/callDetail/index.vue";
import CallFreeDialog from "@/components/callFreeDialog/index.vue";
import CallFreeDetail from "@/components/CallFreeDetail/index.vue";
import Cookies from "js-cookie";
import { userDetail } from "@/api/allApi";
import { generateRandomString } from "./common/utils";
import useWebSocketHeartbeat from "@/hook/useWebScoket";
import TopNotification from "@/components/topNotification/index.vue";
import { useRouter } from "vue-router";

const { setUser, user }: any = useUserDetailStore();

const { fetchData, data } = userDetail();

const state = reactive({
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
    account: data?.lastMsg?.from,

    done: (error: any, user: any) => {
      noticeData.avatar = user.avatar;
      noticeData.nick = user?.nick;
      state.notificationData = noticeData;

      state.showNotification = true;
    },
  });
});

evenBus.on("inviteCall", async (data: any) => {
  // 被呼叫时
  if (data[0].body.type === "call/dial") {
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
    // alert("免费通话");
    const isFreeCalling = localStorage.getItem("isFreeCalling");
    if (isFreeCalling === "true") {
      return;
    }
    state.wsData = data[0].body.data;
    state.showFreeDialog = true;
    audioRef.value.muted = false;
  }

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
});

let nim: any;

evenBus.on("setFunc", (data: any) => {
  nim = data;
});

// 处理ws发送的消息插入到本地数据库
evenBus.on("onSendMsg", (data: any) => {
  if (
    data[0].body.type === "im/p2p/msg/insert" &&
    data[0].body.data.subType === 0
  ) {
    let newWsMsgArr: any = [];
    try {
      newWsMsgArr = JSON.parse(localStorage.getItem("wsMsgArr") || "[]");
    } catch (e) {
      console.log(e);
    }

    // 过滤数组，取出数组ws信息传入的from去更新新的会话对象
    let fromArrMsg: any = [];
    fromArrMsg = newWsMsgArr.filter((item: any) => {
      return item.from === data[0].body.data.from;
    });

    const idClient = generateRandomString(10);

    let currentChatRoomObj: any;

    try {
      currentChatRoomObj = JSON.parse(
        localStorage.getItem("currentChatRoomObj") || "{}"
      );
    } catch (e) {
      console.warn(e);
    }

    // 判断是否在房间内的时候，因为要过滤当前房间内的消息，从而得出新的未读消息
    if (
      currentChatRoomObj &&
      currentChatRoomObj.userId === data[0].body.data.from
    ) {
      fromArrMsg = fromArrMsg.filter((item: any) => {
        return item.ts > currentChatRoomObj.time;
      });
    }

    const obg = {
      unread: fromArrMsg.length,
      // cusstomMsg: fromArrMsg[fromArrMsg.length - 1].bodyString,
      cusstomMsg: data[0].body.data.bodyString,
      idClient: idClient,
      time: data[0].body.data.ts,
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
      // debugger;
      // nim?.getLocalMsgs({
      //   scene: "p2p",
      //   limit: 500,
      //   // to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userId}`,
      //   sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      //     data[0].body.data?.from
      //   }`,
      //   done: (error3: any, objMsg: any) => {
      //     const insertData = obg || 0;
      //     insertData.unread = objMsg?.msgs?.length;
      //     // debugger;
      //     nim.updateLocalSession({
      //       localCustom: JSON.stringify(insertData),
      //       id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      //         data[0].body.data?.from
      //       }`,
      //       done: (err: any, obj: any) => {
      //         console.log(`output->错误`, err);
      //         console.log(`output->更新的会话结构`, obj);
      //       },
      //     });
      //   },
      // });
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

const handleVisibilityChange = async () => {
  console.log(`我重新进来了`, document.visibilityState);
  if (document.visibilityState === "hidden") {
    window.removeEventListener("visibilitychange", () => {});
    Cookies.remove("showDownLoadPopups");
  } else {
    await connectWebSocket(true);
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

<!-- <template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition">
      <keep-alive :include="['HostList', 'Messages', 'Dynamic', 'MatchHome']">
        <component :is="Component" :key="route.path"> </component>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
let position = 0;

router.beforeEach((to) => {
  // 判断是前进还是返回
  const isBack = position > window.history.state.position;
  to.meta.transition = "slide-right";
  console.log(`output->`, to.meta.transition);
  // debugger;
});

router.afterEach(() => {
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
  z-index: 1;
}

.slide-right-leave-active {
  z-index: 1;
}

.slide-left-enter-active {
  background-color: #fff;
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
</style> -->
