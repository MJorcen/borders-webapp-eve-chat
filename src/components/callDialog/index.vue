<template>
  <transition name="slide-fade">
    <div v-if="props.modelValue" class="popup">
      <slot name="modalContent">
        <div id="remote-video" v-if="state.isReactive" class="videoClass"></div>

        <van-image
          v-if="!state.isReactive"
          :src="
            user?.user?.id !== props?.wsData?.fromUser?.id
              ? props?.wsData?.fromUser?.portrait
              : props?.wsData?.toUser?.portrait
          "
          class="hostImg"
          fit="cover"
        />
        <div class="topbox">
          <div class="topLeft">
            <div class="flex items-center">
              <van-image
                fit="cover"
                radius="50"
                :src="
                  user?.user?.id !== props?.wsData?.fromUser?.id
                    ? props?.wsData?.fromUser?.avatar
                    : props?.wsData?.toUser?.avatar
                "
                class="imgClass"
                lazy-load
              ></van-image>
              <div class="nameBox">
                <div class="nameBoxTop">
                  <div
                    class="name"
                    v-if="props?.wsData?.fromUser?.id !== user?.user?.id"
                  >
                    {{ props?.wsData?.fromUser?.nickname }}
                  </div>
                  <div class="name" v-else>
                    {{ props?.wsData?.toUser?.nickname }}
                  </div>
                  <img
                    :src="
                      getCountryImg(
                        user?.user?.id !== props?.wsData?.fromUser?.id
                          ? props?.wsData?.fromUser
                          : props?.wsData?.toUser
                      )
                    "
                    alt=""
                    class="countryImg"
                  />
                </div>
                <!-- <div class="nameBoxBottom">
                  <img
                    src="./assets/image110@2x.webp"
                    class="goldIcon"
                    alt=""
                  />
                  <div class="goldNum">
                    {{ props?.wsData?.call?.goldPrice }}/min
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <div
            class="closeImg"
            v-if="
              user?.user?.id !== props?.wsData?.fromUser?.id &&
              !state.isReactive
            "
            @click="
              () => {
                state.showHangupPopup = true;
              }
            "
          >
            <img src="./assets/Vector@2x(1).webp" class="closeImgNei" alt="" />
          </div>
          <div
            class="closeImg"
            v-if="state.isReactive"
            @click="
              () => {
                state.showHangupPopup = true;
              }
            "
          >
            <img src="./assets/Vector@2x(1).webp" class="closeImgNei" alt="" />
          </div>
        </div>
        <div class="timerDisplay" v-if="state.isReactive">
          <!-- <span>{{ hours }}:</span> -->
          <span>{{ minutes }}:</span>
          <span>{{ seconds }}</span>
        </div>
        <!-- 底部待接听 -->
        <div class="bottomBoxConnect" v-if="!state.isReactive">
          <div
            class="bottomBoxConnectFont"
            v-if="user?.user?.id === props?.wsData?.fromUser?.id"
          >
            Connecting video call
          </div>
          <div class="bottomBoxConnectFont" v-else>
            Invite you to video call…
          </div>

          <!-- 挂断 -->
          <div
            class="bottomBoxConnectGua"
            v-if="user?.user?.id === props?.wsData?.fromUser?.id"
            @click.stop="handleCallHangUp"
          >
            <img
              src="./assets/ic_phone-hangup@2x.png"
              alt=""
              class="bottomBoxConnectGua"
            />
          </div>
          <!-- 挂断 -->
          <!-- 邀请接听 -->
          <div class="bottomBoxInvite" v-else>
            <div class="inviteBox" @click="handleCallPickUp">
              <SvgaShow
                :divId="`demo${props?.wsData?.fromUser?.id}`"
                :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
              ></SvgaShow>
            </div>
          </div>
          <!-- 邀请接听 -->
        </div>

        <!-- 自己的视频推流 -->
        <div class="bottomBoxPushStream" v-if="state.isReactive">
          <div class="mineBox">
            <div id="local-video" class="mineVideo"></div>
            <!-- 
            <img
              class="camera"
              @click.stop="handleChangeCamera"
              src="./assets/ic_changecamera@2x.png"
              alt=""
            /> -->
            <div
              class="kaiCameraBig"
              v-if="state.showVideo"
              @click="handleCloseVideo(false)"
            >
              <img src="./assets/Slice356@2x.webp" class="kaiCamera" />
            </div>
            <div class="kaiCameraBig" v-else @click="handleCloseVideo(true)">
              <img src="./assets/Slice357@2x.webp" class="kaiCamera" />
            </div>
          </div>
        </div>
        <!-- 自己的视频推流 -->

        <!-- 聊天框 -->
        <div class="msgBox" v-if="state.isReactive">
          <div
            class="msgBoxItem"
            v-for="(item, index) in state.msgList"
            :key="index"
          >
            <div v-if="item?.type === 'gift'" class="msgBoxItemGift">
              <div>I send your a gift</div>
              <img
                alt=""
                :src="item?.gift?.icon || item?.icon"
                class="w-[48px] h-[48px] ml-[16px] mr-[16px]"
              />
              <div class="text-[#E405FF]">x1</div>
            </div>
            <div v-else>{{ item }}</div>
          </div>
        </div>
        <!-- 聊天框 -->

        <!-- 接听后底部 -->
        <!-- <img
          class="giftBox"
          src="./assets/ic_calling_gift@2x.png"
          alt=""
          @click="showGiftPopup = true"
          v-if="state.isReactive"
        />
        <div class="reciveBottomBox" v-if="state.isReactive">
          <img
            class="maiKai"
            v-if="state.showAudio"
            src="./assets/ic_calling_mic@2x.png"
            alt=""
            @click="handleCloseAudio(false)"
          />
          <img
            class="maiKai"
            v-else
            src="./assets/ic_mic-off@2x.png"
            alt=""
            @click="handleCloseAudio(true)"
          />
          <img
            class="videoKai"
            v-if="state.showVideo"
            src="./assets/ic_camera_open@2x.png"
            alt=""
            @click="handleCloseVideo(false)"
          />
          <img
            class="videoKai"
            v-if="!state.showVideo"
            src="./assets/ic_camera_close@2x.png"
            alt=""
            @click="handleCloseVideo(true)"
          />

          <div class="sendBox">
            <input
              v-model="state.inputValue"
              class="inputBox"
              type="text"
              placeholder="Say something..."
              @keyup.center="handleSendMsg"
            />
            <img
              src="./assets/ic_send_2@2x.png"
              class="sendImg"
              alt=""
              @click="handleSendMsg"
            />
          </div>
          <img
            class="goldIcon"
            @click="() => (state.showRechargePopup = true)"
            src="./assets/gold@2x.webp"
            alt=""
          />
        </div> -->
        <div class="reciveBottomBoxTwo" v-if="state.isReactive">
          <div class="reciveBottomBoxTwoTop" v-if="state.showAskForGift">
            <div class="reciveBottomBoxTwoTopLeft">
              <div>she ask for gift</div>
              <img :src="state.askForGiftData?.icon" alt="" class="iconImg3" />
              <div>
                [{{ state.askForGiftData?.name }}]
                {{ state.askForGiftData?.value }} coins
              </div>
            </div>
            <div
              class="reciveBottomBoxTwoTopRight"
              @click="handleGive(state.askForGiftData)"
            >
              sent
            </div>
          </div>
          <div class="reciveBottomBoxTwoBottom">
            <div class="reciveBottomBoxTwoBottomItem">
              <img
                src="./assets/Group14008@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
                v-if="state.showInput"
                @click="state.showInput = false"
              />
              <img
                src="./assets/Group1000004829@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
                @click="state.showInput = true"
                v-else
              />
            </div>
            <div
              class="suoGiftList"
              v-if="userGiftListData?.recommendList?.length"
            >
              <div
                class="reciveBottomBoxTwoBottomItem2"
                v-for="(item, index) in userGiftListData?.recommendList"
                @click="handleGive(item)"
              >
                <img
                  :src="item?.icon"
                  class="reciveBottomBoxTwoBottomItemImg2"
                />
                <div class="numsCoins">{{ item?.value }}</div>
              </div>
            </div>
            <div
              class="reciveBottomBoxTwoBottomItem"
              @click="showGiftPopup = true"
            >
              <img
                style="width: 85px; height: 85px"
                src="./assets/image925@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
              />
            </div>

            <div
              class="reciveBottomBoxTwoBottomItem"
              @click.stop="handleChangeCamera"
            >
              <img
                src="./assets/Slice353@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
              />
            </div>
          </div>
          <div class="reciveBottomBoxTwoBottomInputBox" v-if="!state.showInput">
            <input
              class="inputBox"
              v-model="state.inputValue"
              type="text"
              placeholder="Say something..."
              @keyup.center="handleSendMsg"
            />
            <img
              src="./assets/Group1627@2x.webp"
              class="reciveBottomBoxTwoBottomInputBoxImg"
              @click="handleSendMsg"
            />
          </div>
        </div>

        <!-- 接听后底部 -->
      </slot>
    </div>
  </transition>
  <GiftPopup
    ref="giftPopupRef"
    v-model="showGiftPopup"
    @handleGive="handleGive"
  ></GiftPopup>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <SvgaDialog ref="SvgaDialogRef"></SvgaDialog>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  <!-- <FirstVipPromptPopup
    :video-url="configData.firstVipPromptVideo"
    v-model="state.showFirstVipPromptPopup"
  >
  </FirstVipPromptPopup> -->
  <HangupPopup v-model="state.showHangupPopup" @handle-sure="handleClosePopup">
  </HangupPopup>
  <audio style="display: none" controls loop muted ref="audioRef">
    <source src="../../assets/call.mp3" />
  </audio>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  computed,
  reactive,
  watch,
  onUnmounted,
  nextTick,
} from "vue";
import GiftPopup from "@/components/giftPopup/index.vue";
import { useUserStore } from "@/stores/user";
import {
  callpickUp,
  callhangUp,
  datatranslate,
  usergiftmalelist,
  userconfig,
} from "@/api/allApi";
import {
  closeToast,
  showConfirmDialog,
  showLoadingToast,
  showToast,
} from "vant";
import { useZego } from "@/hook/useZego";
import evenBus from "@/common/evenBus";
import { giftsend } from "@/api/allApi";
import RechargePopup from "@/components/rechargePopup/index.vue";
import SvgaDialog from "@/components/svgaDialog/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";
import { useUserDetailStore } from "@/stores/userDetail";
import SvgaShow from "@/components/svgaShow/index.vue";
import { getLocalUserDetail } from "@/common/utils";
// import FirstVipPromptPopup from "@/components/firstVipPromptPopup/index.vue";
import HangupPopup from "@/components/hangupPopup/index.vue";

const { userDetail }: any = useUserDetailStore();

const { vipConfigData } = useVipConfigStore();

let user: any = {};
try {
  const info: any = localStorage.getItem("userInfo");
  user = JSON.parse(info as any);
  // user = user.userDetail;
} catch (e) {
  console.log("error::", e);
}

interface Prop {
  modelValue: boolean;
  wsData: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  wsData: {},
});

onMounted(() => {
  nextTick(() => {
    window.scroll({ top: 0 });
  });
});

const emit = defineEmits(["update:modelValue", "update:wsData"]);

try {
  const info: any = localStorage.getItem("userInfo");
  user = JSON.parse(info as any);
  // user = user.userDetail;
} catch (e) {
  console.log("error::", e);
}

const state: any = reactive({
  isReactive: false, //未接听状态
  inputValue: "", //输入框内容
  msgList: [],
  showAudio: false,
  showVideo: false,
  showCallDetail: false,
  callData: {}, // 主动呼叫传进来的数据
  cammera: 0, // 0:前置摄像头 1:后置摄像头
  showRechargePopup: false,
  showVipPopup: false,
  showInput: true,
  askForGiftData: {},
  showAskForGift: false,
  showFirstVipPromptPopup: false,
  showHangupPopup: false,
});

const toggleBodyScroll = (disable: boolean) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

evenBus.on("askForGift", (data: any) => {
  state.askForGiftData = data;
  state.showAskForGift = true;
});

onUnmounted(() => {
  toggleBodyScroll(false);
  state.isReactive = false;
});

const hours = computed(() => {
  return Math.floor(currentTime.value / 3600)
    .toString()
    .padStart(2, "0");
});

const minutes = computed(() => {
  return Math.floor((currentTime.value % 3600) / 60)
    .toString()
    .padStart(2, "0");
});

const seconds = computed(() => {
  return (currentTime.value % 60).toString().padStart(2, "0");
});

const startTimer = () => {
  startTime.value = Date.now() - currentTime.value * 1000;
  timerId.value = setInterval(() => {
    currentTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);
};

const resetTimer = () => {
  stopTimer();
  currentTime.value = 0;
};

const stopTimer = () => {
  clearInterval(timerId.value);
};

// 计时器
const startTime = ref(0);
const currentTime = ref(0);
const timerId = ref(null);

const { fetchData: userGiftListFetch, data: userGiftListData } =
  usergiftmalelist();

let toastVisible = ref<any>(null);

const audioRef = ref<any>(null);

watch(
  () => props.modelValue,

  async (newValue) => {
    startTime.value = 0;
    currentTime.value = 0;
    state.cammera = 0;
    state.msgList = [];
    state.showInput = true;
    state.showAskForGift = false;
    stopTimer();
    if (newValue) {
      await userGiftListFetch();
      nextTick(() => {
        const localUserDetail = getLocalUserDetail();
        if (localUserDetail?.user?.id !== props?.wsData?.fromUser?.id) {
          audioRef.value.muted = false;
          audioRef.value.play();
        }
      });
      toggleBodyScroll(newValue);
      localStorage.setItem("isCall", "true");
    } else {
      nextTick(() => {
        audioRef.value.muted = true;
        audioRef.value.pause();
      });
      clearInterval(toastVisible.value);
      toggleBodyScroll(false);
      localStorage.setItem("isCall", "false");
    }
  },
  { immediate: true }
);

// const { user }: any = useUserStore();

const showGiftPopup = ref(false);

const handleClosePopup = async () => {
  // showConfirmDialog({
  //   title: "",
  //   message: "Are you sure hang up?",
  //   confirmButtonText: "Yes",
  //   cancelButtonText: "No",
  // })
  //   .then(async () => {
  //     await handleCallHangUp();
  //     emit("update:modelValue", false);
  //   })
  //   .catch(() => {
  //     // on cancel
  //   });
  await handleCallHangUp();
  emit("update:modelValue", false);
};

// 挂断逻辑
const {
  fetchData: handupFetch,
  msg: handupMsg,
  success: handupSuccess,
} = callhangUp();

const handleCallHangUp = async () => {
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  await handupFetch({ callId: props.wsData.call.id });
  if (handupSuccess.value) {
    zg.logoutRoom();
    emit("update:modelValue", false);
    closeToast();
    localStorage.setItem("isCall", "false");
  } else {
    showToast(handupMsg.value);
  }
};

const { loginRoom, zg, roomStreamUpdate, sendBroadcastMessage } = useZego();

// 接听逻辑
const {
  fetchData: callpickUpFetch,
  msg: callpickUpMsg,
  success: callpickUpSuccess,
  data: callpickUpData,
  code,
} = callpickUp();

const { fetchData: configFetch, data: configData } = userconfig();

const handleCallPickUp = async () => {
  // await configFetch();
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  await callpickUpFetch({ callId: props.wsData.call.id });
  if (callpickUpSuccess.value) {
    state.isReactive = true;
    const userID = `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      callpickUpData.value.toUser.id
    }`;
    const userName = `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      callpickUpData.value.toUser.id
    }`;
    const roomID = callpickUpData.value.call.roomId;
    const token = callpickUpData.value.token;

    handleLoginRoom(roomID, token, userID, userName);
    nextTick(() => {
      audioRef.value.muted = true;
      audioRef.value.pause();
    });
    closeToast();
  } else {
    if (code.value === 402) {
      const userDetails = getLocalUserDetail();
      if (userDetails?.user?.vipLevel === 0) {
        state.showVipPopup = true;
      } else {
        state.showRechargePopup = true;
      }
      // if (configData?.value?.showFirstVipPrompt) {
      //   state.showFirstVipPromptPopup = true;
      // }
    }
    showToast(callpickUpMsg.value);
  }
};

const localStream = ref<any>();

// 切换摄像头
const handleChangeCamera = () => {
  if (state.cammera === 0) {
    zg.useFrontCamera(localStream.value, false);
    state.cammera = 1;
  } else {
    zg.useFrontCamera(localStream.value, true);
    state.cammera = 0;
  }
};

const startInterval = () => {
  toastVisible.value = setInterval(() => {
    showToast({
      message:
        "If anyone asks to add contact information or transfer money privately, please report it immediately to avoid being deceived.",
      duration: 4000, // Toast 显示时长
      position: "bottom",
      zIndex: 9999,
    });
  }, 120000); // 每 120 秒触发
};

// 被动接听逻辑
const handleLoginRoom = async (
  roomID: string,
  token: string,
  userID: string,
  userName: string
) => {
  // 登录房间
  await loginRoom(roomID, token, userID, userName).then(async (result) => {
    if (result) {
      console.log("登录成功");
      state.isReactive = true;
      // let localStream: any;
      roomUpdate();
      startTimer();
      setTimeout(() => {
        showToast({
          message:
            "If anyone asks to add contact information or transfer money privately, please report it immediately to avoid being deceived.",
          duration: 4000, // Toast 显示时长
          position: "bottom",
          zIndex: 9999,
        });
      });
      startInterval();
      try {
        localStream.value = await zg.createZegoStream();
      } catch (e) {
        console.log(`output->`, localStream);
      }

      // 预览画面，将播放组件挂载到页面，"local-video" 为组件容器 <div> 元素的 id 。
      localStream.value?.playVideo?.(document.querySelector("#local-video"));
      // 开始推流，将自己的音视频流推送到 ZEGO 音视频云
      let streamID = new Date().getTime().toString();
      zg.startPublishingStream(streamID, localStream.value);
    } else {
      console.log("登录失败");
    }
  });
};

const handleCloseAudio = (show: boolean) => {
  zg.mutePublishStreamAudio(localStream.value, show);
  state.showAudio = show;
};

const handleCloseVideo = (show: boolean) => {
  zg.mutePublishStreamVideo(localStream.value, show);
  state.showVideo = show;
};

// 房间拉流
const roomUpdate = () => {
  roomStreamUpdate().then(async (res: any) => {
    if (res.updateType == "ADD") {
      // 流新增，开始拉流
      // 此处演示拉取流新增的列表中第一条流的音视频
      const streamID = res.streamList[0].streamID;
      // streamList 中有对应流的 streamID
      const remoteStream = await zg.startPlayingStream(streamID);
      // 创建媒体流播放组件
      const remoteView = zg.createRemoteStreamView(remoteStream);
      await zg.setEffectsBeauty(remoteStream, true, {
        sharpenIntensity: 100,
        whitenIntensity: 100,
        rosyIntensity: 100,
        smoothIntensity: 100,
      });
      remoteView.play("remote-video", { enableAutoplayDialog: true });
    } else if (res.updateType == "DELETE") {
      // 流删除，通过流删除列表 streamList 中每个流的 streamID 进行停止拉流。
      const streamID = res.streamList[0].streamID;
      zg.stopPlayingStream(streamID);
    }
  });
};

// 被呼叫时候
evenBus.on("byeCall", () => {
  state.isReactive = false;
});

// 主动拨打逻辑
evenBus.on("activeCall", async (data: any) => {
  await emit("update:wsData", data);
  state.isReactive = false;
  emit("update:modelValue", true);

  const userID = `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
    data?.fromUser.id
  }`;
  const userName = `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
    data?.fromUser.id
  }`;
  const roomID = data?.call.roomId;
  const token = data?.token;
  state.isReactive = false;

  if (data.type === "call/dial") {
    // state.isReactive = false;
    handleLoginRoom(roomID, token, userID, userName);
  }
});

// 聊天逻辑
const handleSendMsg = (obj: any = null) => {
  const userId =
    user?.user?.id !== props?.wsData?.fromUser?.id
      ? props?.wsData?.fromUser?.id
      : props?.wsData?.toUser?.id;

  if (state.inputValue.trim() === "") return;
  const rommId = props?.wsData?.call?.roomId;
  // console.log(props?.wsData)
  // debugger
  // const msg = state.inputValue === "" ? JSON.stringify(obj) : state.inputValue;
  sendBroadcastMessage(rommId, state.inputValue, [
    `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userId}`,
  ]).then((res: any) => {
    if (res) {
      console.log("发送成功");
      state.msgList.push(state.inputValue);
      // if (state.inputValue !== "") {
      //   state.msgList.push(state.inputValue);
      // } else {
      //   let objStr = JSON.parse(JSON.stringify(obj));
      //   objStr = {
      //     ...objStr,
      //     type: "gift",
      //   };
      //   state.msgList.push(objStr);
      // }

      state.inputValue = "";
    } else {
      showToast(res);
    }
  });
};

const {
  fetchData: translateFetch,
  data: translateData,
  success: translateSuccess,
  msg: translateMsg,
} = datatranslate();

// 收发弹幕消息
zg.on("IMRecvCustomCommand", async (roomID, fromUser, command) => {
  console.log("IMRecvCustomCommand", roomID, fromUser, command);
  await translateFetch({
    text: command,
  });
  state.msgList.push(translateData.value.text);
});

const {
  fetchData: giftFetch,
  data: sendGiftData,
  success: giftSuccess,
  msg: giftMsg,
} = giftsend();

const giftPopupRef = ref<any>();

const SvgaDialogRef = ref<any>();

const handleGive = async (item: any) => {
  const userId =
    user?.user?.id !== props?.wsData?.fromUser?.id
      ? props?.wsData?.fromUser?.id
      : props?.wsData?.toUser?.id;
  await giftFetch({
    backpack: 0,
    toUserId: userId,
    giftId: item.id,
    number: 1,
    callId: props?.wsData?.call?.id,
  });
  if (giftSuccess.value) {
    showToast("Success");
    SvgaDialogRef.value.state.svgaUrl =
      sendGiftData?.value?.gift?.animateResource;
    SvgaDialogRef.value.state.showModal = true;

    showGiftPopup.value = false;
    giftPopupRef.value.wollectFetch();
    // handleSendMsg(item);
    state.msgList.push({
      ...item,
      type: "gift",
    });
    state.showAskForGift = false;
  } else {
    // state.showRechargePopup = true;
    state.showVipPopup = true;
    showToast(giftMsg.value);
  }
};

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `/public/contryIcon/icon_counties_rectangle_${item?.region.toLowerCase()}.png`,
    import.meta.url
  );
  return path || "";
};

defineExpose({
  state,
});
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  /* display: flex;
  justify-content: center;
  align-items: flex-end; */
  transition: all 0.3s ease;
  z-index: 40;
  // position: relative;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.videoClass {
  width: 100%;
  height: 100vh;
  // object-fit: fill;
}

.hostImg {
  width: 100vw;
  height: 100vh;
  // object-fit: fill;
  filter: blur(3px);
}
.topbox {
  position: absolute;
  top: 150px;
  z-index: 31;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  .topLeft {
    width: 490px;
    height: 96px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 24px;
    // background: linear-gradient(
    //   270deg,
    //   rgba(0, 0, 0, 0.5) 0%,
    //   rgba(0, 0, 0, 0.1) 100%
    // );
    // border-radius: 200px 200px 200px 200px;
    // border: 2px solid rgba(255, 255, 255, 0.35);
    display: flex;
    align-items: center;
    .imgClass {
      width: 80px;
      height: 80px;
    }
    .nameBox {
      margin-left: 16px;
      .nameBoxTop {
        display: flex;
        align-items: center;
        .name {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 32px;
          color: #ffffff;
          margin-right: 8px;
        }
        .countryImg {
          width: 40px;
          height: 40px;
        }
      }
      .nameBoxBottom {
        display: flex;
        align-items: center;
        .goldIcon {
          width: 32px;
          height: 32px;
        }
        .goldNum {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 24px;
          color: #ffffff;
        }
      }
    }
    .followBtn {
      width: 116px;
      height: 48px;
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 24px 24px 24px 24px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 28px;
      color: #ffffff;
      line-height: 48px;
      text-align: center;
    }
  }

  .closeImg {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #504f56;
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    .closeImgNei {
      width: 52px;
      height: 52px;
    }
  }
}
.timerDisplay {
  position: absolute;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  animation: pulse 2s infinite;
  top: 250px;
  left: 30px;
  z-index: 20;
}
.bottomBoxConnect {
  position: absolute;
  bottom: 120px;
  width: 100%;
  .bottomBoxConnectFont {
    width: 100%;
    text-align: center;
    font-family: "SF Pro Text", sans-serif;
    font-weight: 600;
    font-size: 28px;
    color: #ffffff;
    margin-bottom: 80px;
  }
  .bottomBoxConnectGua {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .bottomBoxConnectGua {
      width: 120px;
      height: 120px;
    }
  }
  .bottomBoxInvite {
    padding-left: 60px;
    padding-right: 60px;
    width: 100%;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    justify-content: center;
    .inviteBox {
      width: 180px;
      height: 180px;
      background: #f9577e;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .bottomBoxInviteGua {
      width: 120px;
      height: 120px;
    }
    .bottomBoxInviteRecive {
      position: relative;
      .bottomBoxInviteReciveImg {
        width: 440px;
        height: 120px;
      }
      .bottomBoxInviteReciveBox {
        position: absolute;
        display: flex;
        align-items: center;
        right: -5px;
        top: -40px;
        .isFreeFont {
          width: 166px;
          height: 58px;
          background: linear-gradient(270deg, #f58921 0%, #fee590 100%);
          border-radius: 20px 20px 20px 20px;
          font-family: "SF Pro Text", sans-serif;
          font-weight: 600;
          font-size: 32px;
          color: #1a1a1a;
          line-height: 58px;
          text-align: center;
          margin-right: 16px;
        }
        .isFreeFontNums {
          font-family: "SF Pro Text", sans-serif;
          font-weight: bold;
          font-size: 32px;
          color: #ffffff;
        }
      }
    }
  }
}
.giftBox {
  position: absolute;
  bottom: 144px;
  right: 20px;
  width: 160px;
  height: 160px;
}
.reciveBottomBox {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 24px;
  padding-right: 24px;
  .maiKai {
    width: 88px;
    height: 88px;
    margin-right: 16px;
  }
  .videoKai {
    width: 88px;
    height: 88px;
    margin-right: 16px;
  }
  .sendBox {
    display: flex;
    align-items: center;
    width: 390px;
    height: 88px;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 200px 200px 200px 200px;
    margin-right: 24px;
    .inputBox {
      padding-left: 24px;
      line-height: 88px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 200px 200px 200px 200px;

      width: 310px;
    }
    .inputBox::placeholder {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: rgba(255, 255, 255, 0.7);
    }
    .sendImg {
      width: 72px;
      height: 72px;
    }
  }
  .goldIcon {
    width: 68px;
    height: 68px;
  }
}
.reciveBottomBoxTwo {
  position: fixed;
  bottom: 20px;
  width: 100%;
  padding-left: 24px;
  padding-right: 24px;
  .reciveBottomBoxTwoTop {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .reciveBottomBoxTwoTopLeft {
      display: flex;
      align-items: center;
      font-family: "ABeeZee", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffe100;
      padding: 16px 16px 16px 36px;
      // width: 528px;
      // height: 60px;
      background: rgba(235, 99, 0, 0.8);
      border-radius: 60px 60px 60px 60px;
      line-height: 60px;
      overflow: hidden;
      .iconImg3 {
        width: 66px;
        height: 66px;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
    .reciveBottomBoxTwoTopRight {
      width: 132px;
      height: 60px;
      background: #eb6300;
      border-radius: 20px 20px 20px 20px;
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 32px;
      color: #fefefe;
      line-height: 60px;
      text-align: center;
      margin-left: 26px;
    }
  }
  .reciveBottomBoxTwoBottom {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .reciveBottomBoxTwoBottomItem {
      width: 80px;
      height: 80px;
      background: #4c545a;
      border-radius: 0px 0px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 50%;
      .reciveBottomBoxTwoBottomItemImg {
        width: 34px;
        height: 30px;
      }
    }
    .suoGiftList {
      display: flex;
      align-items: center;
      .reciveBottomBoxTwoBottomItem2 {
        width: 80px;
        height: 80px;
        background: #4c545a;
        border-radius: 0px 0px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 50%;
        margin-right: 24px;
        .reciveBottomBoxTwoBottomItemImg2 {
          width: 34px;
          height: 30px;
        }
        .numsCoins {
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 24px;
          color: #ffffff;
        }
      }
      .reciveBottomBoxTwoBottomItem2:last-child {
        margin-right: 0px;
      }
    }
  }
  .reciveBottomBoxTwoBottomInputBox {
    margin-top: 38px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 62px;
    padding-right: 42px;
    height: 112px;
    background: #ffffff;
    box-shadow: inset 0px 0px 180px 0px rgba(255, 255, 255, 0.2);
    border-radius: 80px 80px 80px 80px;
    border: 2px solid;
    // border-image: linear-gradient(
    //     315deg,
    //     rgba(255, 95, 109, 0.42),
    //     rgba(255, 195, 113, 0.33)
    //   )
    //   2 2;
    .inputBox {
      padding-left: 24px;
      line-height: 88px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #000000;
      border-radius: 200px 200px 200px 200px;
      width: 96%;
    }
    .inputBox::placeholder {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #ababab;
    }
    .reciveBottomBoxTwoBottomInputBoxImg {
      width: 40px;
      height: 40px;
    }
  }
}

.msgBox {
  position: absolute;
  bottom: 112px;
  left: 16px;
  max-width: 600px;
  height: 742px;
  overflow-y: scroll;
  .msgBoxItem {
    padding: 16px 24px 16px 24px;
    background: rgba(0, 0, 0, 0.6);
    margin-bottom: 16px;
    font-family: "SF Pro Text", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    line-height: 32px;
    border-radius: 32px;
    .msgBoxItemGift {
      display: flex;
      align-items: center;
      font-family: "SF Pro Text", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #ffb443;
    }
  }
}
.bottomBoxPushStream {
  position: absolute;
  top: 368px;
  right: 32px;
  width: 224px;
  height: 300px;
  border-radius: 40px 40px 40px 40px;
  background: #d9d9d9;
  .mineBox {
    position: relative;
    .mineVideo {
      border-radius: 40px 40px 40px 40px;
      transform: scaleX(-1);
    }
    .camera {
      position: absolute;
      z-index: 12;
      width: 88px;
      height: 64px;
      top: 200px;
      left: 68px;
    }
    .kaiCameraBig {
      position: absolute;
      width: 48px;
      height: 48px;
      background: #3a5157;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      top: 0;
      left: 0;
      z-index: 12;

      .kaiCamera {
        width: 27px;
        height: 27px;
      }
    }
  }
}
</style>
