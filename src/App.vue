<template>
  <div class="appBox">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HostList', 'Messages', 'Dynamic', 'MatchHome']">
        <component :is="Component"> </component>
      </keep-alive>
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
      <CallFreeDialog
        :wsData="state.wsData"
        v-model="state.showFreeDialog"
        @handleCallHangUp="audioRef.muted = true"
        @handleCallPickUp="audioRef.muted = true"
      ></CallFreeDialog>
    </div>
  </div>

  <audio style="display: none" controls loop muted ref="audioRef">
    <source src="./assets/call.mp3" />
  </audio>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import CallDialog from "@/components/callDialog/index.vue";
import evenBus from "@/common/evenBus";
import { useZego } from "@/hook/useZego";
import { useUserDetailStore } from "@/stores/userDetail";
import CallDetail from "@/components/callDetail/index.vue";
import CallFreeDialog from "@/components/callFreeDialog/index.vue";
import { userDetail } from "@/api/allApi";
import { generateRandomString, getCurrentQueryParams } from "./common/utils";
// import { generateRandomString } from "./common/utils";
// import { useImHook } from "@/hook/useIm";
// import screenfull from "screenfull";

const { setUser, user }: any = useUserDetailStore();

const { fetchData, data } = userDetail();

const state = reactive({
  wsData: {},
  showCallDetail: false,
  showFreeDialog: false,
});

const audioRef = ref<any>(null);

const showCallDialog = ref(false);

const callDialogRef = ref<any>(null);

document.addEventListener("click", () => {
  // screenfull.request();
  audioRef?.value?.play();
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
  if (data[0].body.type === "payment/success") {
    await fetchData();
    setUser(data.value);
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

onMounted(() => {
  const res = getCurrentQueryParams();

  // 切换语言 仅供测试使用
  (window as any)?.translate?.changeLanguage("english");
});
</script>
<style lang="scss" scoped>
.appBox {
  position: relative;
  .dialogBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
  }
}
</style>
