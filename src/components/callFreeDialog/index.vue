<template>
  <transition name="slide-fade">
    <div v-if="props.modelValue" class="popup">
      <!-- v-if="state.showVideo" -->
      <div class="videoBox" v-if="state.showVideo">
        <div class="bottomFont" v-if="walletData?.wallet?.gold === 0">
          Top up coins to turn on the voice
        </div>
        <div class="topLeft">
          <div class="flex items-center">
            <van-image
              fit="cover"
              radius="50"
              :src="
                user?.user?.id !== props?.wsData?.fromUser?.id
                  ? props?.wsData?.fromUser?.portrait
                  : props?.wsData?.toUser?.portrait
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
              <div class="nameBoxBottom">
                <img src="./assets/coin_300@2x.png" class="goldIcon" alt="" />
                <div class="goldNum">
                  {{ props?.wsData?.call?.goldPrice }}/min
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomBoxPushStream">
          <div class="mineBox">
            <div id="local-video" class="mineVideo"></div>

            <!-- <img
              class="camera"
              @click="state.showVipPopup = true"
              src="./assets/ic_changecamera@2x.png"
              alt=""
            /> -->
            <div class="kaiCameraBig" @click="state.showVipPopup = true">
              <img src="./assets/Slice356@2x.webp" class="kaiCamera" />
            </div>
          </div>
        </div>
        <!-- ref="videoRef"
          width="100%"
          height="100%"
          :src="props.wsData.call?.videoPath"
          class="videoClass"
          @ended="onVideoEnded"
          autoplay
          muted -->
        <!-- x5-video-player-type="h5"
          :autoplay="true"
          :loop="true"
          :webkit-playsinline="true"
          :playsinline="true" -->
        <video
          width="100%"
          height="100%"
          :autoplay="true"
          :controls="false"
          :muted="true"
          @ended="onVideoEnded"
          :src="props.wsData.call?.videoPath"
          class="videoClass"
          ref="videoRef"
        >
          您的浏览器不支持视频标签。
        </video>
        <div class="closeImgMq" @click="handleCallHangUp">
          <img src="./assets/Vector@2x(1).webp" class="closeImgNei" alt="" />
        </div>
        <div class="timerDisplay">
          <!-- <span>{{ hours }}:</span> -->
          <span>{{ minutes }}:</span>
          <span>{{ seconds }}</span>
        </div>

        <!-- 聊天框 -->
        <div class="msgBox">
          <div
            class="msgBoxItem"
            v-for="(item, index) in state.msgList"
            :key="index"
          >
            <div>{{ item }}</div>
          </div>
        </div>
        <!-- 聊天框 -->

        <!-- 接听后底部 -->
        <!-- <img
          class="giftBox"
          src="./assets/ic_calling_gift@2x.png"
          alt=""
          @click="state.showVipPopup = true"
        />
        <div class="reciveBottomBox">
          <img
            class="maiKai"
            v-if="state.showAudio"
            src="./assets/ic_calling_mic@2x.png"
            alt=""
            @click="state.showVipPopup = true"
          />
          <img
            class="maiKai"
            v-else
            src="./assets/ic_mic-off@2x.png"
            alt=""
            @click="state.showVipPopup = true"
          />
          <img
            class="videoKai"
            v-if="state.showVideo"
            src="./assets/ic_camera_open@2x.png"
            alt=""
            @click="state.showVipPopup = true"
          />
          <img
            class="videoKai"
            v-if="!state.showVideo"
            src="./assets/ic_camera_close@2x.png"
            alt=""
            @click="state.showVipPopup = true"
          />

          <div class="sendBox" @click="state.showVipPopup = true">
            <div class="inputBox">Say somethig...</div>
            <!-- <input
              :disabled="true"
              class="inputBox"
              type="text"
              placeholder="Say something..."
              @click="state.showVipPopup = true"
            />
            <img
              src="./assets/ic_send_2@2x.png"
              class="sendImg"
              alt=""
              @click="state.showVipPopup = true"
            />
          </div>
          <img
            class="goldIcon"
            @click="() => (state.showVipPopup = true)"
            src="./assets/gold@2x.webp"
            alt=""
          />
        </div> -->
        <div class="reciveBottomBoxTwo">
          <div class="reciveBottomBoxTwoBottom">
            <div class="reciveBottomBoxTwoBottomItem">
              <img
                src="./assets/Group14008@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
                @click="state.showVipPopup = true"
              />
            </div>
            <div
              class="suoGiftList"
              v-if="userGiftListData?.recommendList?.length"
            >
              <div
                class="reciveBottomBoxTwoBottomItem2"
                v-for="(item, index) in userGiftListData?.recommendList"
                @click="state.showVipPopup = true"
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
              @click="state.showVipPopup = true"
            >
              <img
                style="width: 85px; height: 85px"
                src="./assets/image925@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
              />
            </div>

            <div
              class="reciveBottomBoxTwoBottomItem"
              @click="state.showVipPopup = true"
            >
              <img
                src="./assets/Slice353@2x.webp"
                class="reciveBottomBoxTwoBottomItemImg"
              />
            </div>
          </div>
          <!-- <div class="reciveBottomBoxTwoBottomInputBox" v-if="!state.showInput">
            <input
              class="inputBox"
              v-model="state.inputValue"
              type="text"
              placeholder="Say somethig..."
              @keyup.center="handleSendMsg"
            />
            <img
              src="./assets/Group1627@2x.webp"
              class="reciveBottomBoxTwoBottomInputBoxImg"
              @click="handleSendMsg"
            />
          </div> -->
        </div>
        <!-- 接听后底部 -->
      </div>
      <div v-else class="freeBox">
        <van-image
          :src="props?.wsData?.fromUser?.avatar"
          class="hostImg"
          fit="cover"
        />
        <!-- <div class="closeImg" @click="handleCallHangUp">
          <img src="./assets/Vector@2x(1).webp" class="closeImgNei" alt="" />
        </div> -->
        <div class="closeImgMq" @click="handleCallHangUp">
          <img src="./assets/Vector@2x(1).webp" class="closeImgNei" alt="" />
        </div>
        <div class="bottomBoxConnect">
          <div class="bottomBoxInvite">
            <!-- <img
              src="./assets/ic_phone-hangup@2x.png"
              alt=""
              class="bottomBoxInviteGua"
              @click.stop="handleCallHangUp"
            />
            <div class="bottomBoxInviteRecive">
              <img
                src="./assets/ic_phone-answer_l@2x.png"
                alt=""
                class="bottomBoxInviteReciveImg"
                @click="handleCallPickUp"
              />
              <div class="posBox" v-if="props?.wsData?.call?.freeCount > 0">
                <div class="posBoxOne">
                  Free
                  <div class="posBoxOneImgBox">
                    {{ props?.wsData?.call?.freeCount }}
                  </div>
                </div>
              </div>
            </div> -->
            <div class="inviteBox" @click="handleCallPickUp">
              <SvgaShow
                :divId="`demo${props?.wsData?.fromUser?.id}`"
                :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
              ></SvgaShow>
              <div class="posBox" v-if="props?.wsData?.call?.freeCount > 0">
                <div class="posBoxOne">
                  Free
                  <div class="posBoxOneImgBox">
                    {{ props?.wsData?.call?.freeCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onUnmounted,
  nextTick,
  onMounted,
  computed,
} from "vue";
import { showConfirmDialog, showLoadingToast, showToast } from "vant";
import {
  freeCallpickUp,
  freeCallhangUp,
  giftsend,
  userwallet,
  usergiftmalelist,
} from "@/api/allApi";
import { useUserStore } from "@/stores/user";
import RechargePopup from "@/components/rechargePopup/index.vue";
import GiftPopup from "@/components/giftPopup/index.vue";
import { useZego } from "@/hook/useZego";
import evenBus from "@/common/evenBus";
import { generateRandomString } from "@/common/utils";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";
import { useUserDetailStore } from "@/stores/userDetail";

const { userDetail }: any = useUserDetailStore();

const { vipConfigData } = useVipConfigStore();
import SvgaShow from "@/components/svgaShow/index.vue";

const { fetchData: wollectFetch, data: walletData } = userwallet();

interface Prop {
  modelValue: boolean;
  wsData: any;
}
const { user }: any = useUserStore();

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  wsData: {},
});

const { fetchData: userGiftListFetch, data: userGiftListData } =
  usergiftmalelist();

const state = reactive({
  src: `${import.meta.env.VITE_APP_BASE_APIW}/蝶梦恋人.mp4`,
  showVideo: false,
  isReactive: false, //未接听状态
  inputValue: "", //输入框内容
  msgList: [],
  showAudio: false,
  showCallDetail: false,
  callData: {}, // 主动呼叫传进来的数据
  cammera: 0, // 0:前置摄像头 1:后置摄像头
  showRechargePopup: false,
  insetData: {},
  isPick: false,
  showVipPopup: false,
});

const toggleBodyScroll = (disable: boolean) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

onUnmounted(() => {
  toggleBodyScroll(false);
  // stopTimer();
});

const videoRef = ref<HTMLVideoElement>();
const localStream = ref<any>();

const { zg } = useZego();

onMounted(() => {});

let nim: any;

evenBus.on("setFunc", (data: any) => {
  nim = data;
});

// 插入搭讪视频聊天后的消息会话
evenBus.on("insetCallMsg", (data: any) => {
  const idClient = generateRandomString(10);

  state.insetData = JSON.parse(data?.bodyString);
  const obj = JSON.parse(data?.bodyString);

  let newWsMsgArr: any = [];
  try {
    newWsMsgArr = JSON.parse(localStorage.getItem("wsMsgArr") || "[]");
  } catch (e) {
    console.log(e);
  }

  const insetObj = {
    bodyString: "[Call]",
    from: obj?.data?.call?.fromUserId,
    to: obj?.data?.call?.toUserId,
    ts: new Date().getTime(),
  };

  newWsMsgArr.push(insetObj);
  localStorage.setItem("wsMsgArr", JSON.stringify(newWsMsgArr));

  nim.saveMsgsToLocal({
    msgs: [
      {
        from: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          obj?.data?.call?.fromUserId
        }`,
        to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          obj?.data?.call?.toUserId
        }`,
        scene: "p2p",
        sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          obj?.data?.call?.fromUserId
        }`,
        needPushNick: true,
        target: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          obj?.data?.call?.toUserId
        }`,
        type: "text",
        text: JSON.stringify(obj?.data?.call),
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
        obj?.data?.call?.fromUserId
      }`,
      done: () => {},
    });
  }
});

const {
  fetchData: pickUpFetch,
  msg: pickUpMsg,
  success: pickUpSuccess,
  code,
} = freeCallpickUp();

const handleCallPickUp = async () => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await pickUpFetch({
    callId: props.wsData.call?.id,
  });
  if (pickUpSuccess.value) {
    state.showVideo = true;
    showToast("Success");
    emit("handleCallPickUp");
    state.isPick = true;
    // localStorage.setItem("isFreeCalling", "true");
  } else {
    if (code.value === 402) {
      if (userDetail?.user?.vipLevel === 0) {
        state.showVipPopup = true;
      } else {
        state.showRechargePopup = true;
      }
    }
    emit("handleCallPickUp");
    showToast(pickUpMsg.value);
    state.isPick = true;
  }
};

const {
  fetchData: hangUpFetch,
  msg: hangUpMsg,
  success: hangUpSuccess,
} = freeCallhangUp();

const handleCallHangUp = async () => {
  showConfirmDialog({
    title: "",
    message: "Are you sure hang up?",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  })
    .then(async () => {
      showLoadingToast({
        message: "Please wait...",
        duration: 0,
        forbidClick: true,
      });
      await hangUpFetch({
        callId: props.wsData.call?.id,
      });
      if (hangUpSuccess.value) {
        showToast("Success");
        emit("update:modelValue", false);
        emit("handleCallHangUp");
        // localStorage.setItem("isFreeCalling", "false");
        emit("handleCallFrend", props.wsData, currentTime.value);
        state.isPick = false;
      } else {
        emit("update:modelValue", false);
        emit("handleCallHangUp");
        showToast(hangUpMsg.value);
        state.isPick = false;
      }
    })
    .catch(() => {
      // on cancel
    });
};

const onVideoEnded = () => {
  emit("update:modelValue", false);
};

// const handleSendMsg = () => {
//   if (state.inputValue.trim() === "") return;
//   state.msgList.push(state.inputValue);
//   state.inputValue = "";
// };

const emit = defineEmits([
  "update:modelValue",
  "handleCallHangUp",
  "handleCallPickUp",
  "handleCallFrend",
]);

// 计时器
const startTime = ref(0);
const currentTime = ref(0);
const timerId = ref(null);

const startTimer = () => {
  startTime.value = Date.now() - currentTime.value * 1000;
  timerId.value = setInterval(() => {
    currentTime.value = Math.floor((Date.now() - startTime.value) / 1000);
  }, 1000);
};

watch(
  () => props.modelValue,
  async (newValue) => {
    state.showVideo = false;
    state.msgList = [];
    toggleBodyScroll(newValue);
    if (newValue) {
      await wollectFetch();
      await userGiftListFetch();
      localStorage.setItem("isFreeCalling", "true");
    } else {
      localStorage.setItem("isFreeCalling", "false");
      toggleBodyScroll(false);
    }
  },
  { immediate: true }
);

const stopTimer = () => {
  clearInterval(timerId.value);
};

watch(
  () => state.showVideo,
  (newValue) => {
    startTime.value = 0;
    currentTime.value = 0;
    stopTimer();
    if (newValue) {
      startTimer();
      nextTick(async () => {
        try {
          localStream.value = await zg.createZegoStream();
        } catch (e) {
          console.log(`output->`, localStream);
        }
        localStream.value?.playVideo?.(document.querySelector("#local-video"));
      });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => currentTime.value,
  (newValue) => {
    if (newValue >= props?.wsData?.call?.durationLimit && props.modelValue) {
      emit("handleCallFrend", props.wsData, currentTime.value, state.isPick);
      stopTimer();
    }
  },
  { deep: true }
);

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

const resetTimer = () => {
  stopTimer();
  currentTime.value = 0;
};

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `/public/contryIcon/icon_counties_rectangle_${item?.region.toLowerCase()}.png`,
    import.meta.url
  );
  return path || "";
};
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

.videoBox {
  width: 100%;
  height: 100vh;
  position: relative;
  .bottomFont {
    position: absolute;
    bottom: 200px;
    left: 20px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    font-size: 32px;
    z-index: 10;
    color: #fff;
  }
  .videoClass {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }

  .closeImgMq {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #504f56;
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 130px;
    right: 20px;
    height: 96px;
    z-index: 20;
    .closeImgNei {
      width: 52px;
      height: 52px;
    }
  }
  .topLeft {
    position: absolute;
    top: 130px;
    left: 20px;
    width: 490px;
    height: 96px;
    display: flex;
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
  .timerDisplay {
    position: absolute;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    animation: pulse 2s infinite;
    top: 240px;
    left: 30px;
    z-index: 20;
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
  .giftBox {
    position: absolute;
    bottom: 144px;
    right: 20px;
    width: 160px;
    height: 160px;
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
}

.freeBox {
  width: 100%;
  height: 100vh;
  position: relative;
  .hostImg {
    width: 100%;
    height: 100vh;
  }
  .closeImgMq {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #504f56;
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 130px;
    right: 20px;
    height: 96px;
    z-index: 20;
    .closeImgNei {
      width: 52px;
      height: 52px;
    }
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
        position: relative;
        .posBox {
          position: absolute;
          top: -85px;
          // right: 20px;
          background-image: url("./assets/Group 7636@2x.png");
          background-repeat: no-repeat;
          width: 226px;
          height: 100px;
          background-size: 100% 100%;
          z-index: 2;
          // display: flex;
          // align-items: center;
          // justify-content: center;

          font-family: "Arial", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #ffffff;
          text-shadow: 0px 8px 8px rgba(255, 100, 100, 0.25);
          .posBoxOne {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 10;
            line-height: 80px;
            text-align: center;
            .posBoxOneImgBox {
              position: absolute;
              top: -20px;
              right: 0px;
              background-image: url("./assets/quan.png");
              background-repeat: no-repeat;
              width: 66px;
              height: 54px;
              background-size: 100% 100%;
              font-family: "Arial", sans-serif;
              font-weight: bold;
              font-size: 28px;
              color: #ffffff;
              line-height: 33px;
              text-shadow: 0px 8px 8px rgba(255, 100, 100, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              padding-top: 15px;
            }
          }
        }
      }
      .bottomBoxInviteGua {
        width: 120px;
        height: 120px;
      }

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
</style>
