<template>
  <div class="bigBox">
    <van-nav-bar
      title=""
      left-text=""
      :border="false"
      fixed
      style="background-color: rgba(0, 0, 0, 0.8); color: #fff"
    >
      <template #title>
        <div class="titleName">Live streaming</div>
      </template>
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#ffffff"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
    </van-nav-bar>
    <van-swipe
      class="videoSwipe"
      :loop="false"
      @change="handleSwiperChange"
      vertical
      :show-indicators="false"
      ref="videoSwipeRef"
      @dragStart="handleDragStart"
      @dragEnd="handleDragEnd"
    >
      <van-swipe-item v-for="(item, index) in data?.list" :key="index">
        <div class="topBox">
          <div class="topUserBox">
            <van-image
              round
              fit="cover"
              lazy-load
              radius="50"
              :src="item?.avatar"
              class="topUserBoxImg"
            >
            </van-image>
            <img class="contry" :src="getCountryImg(item)" alt="" />
          </div>
          <div class="topUserBoxRight">
            <div class="topUserBoxRightName">{{ item?.nickname }}</div>
            <div class="topUserBoxRightBottom">
              <div class="topUserBoxRightBottomLeft">
                <img
                  src="./assets/Slice510@2x.webp"
                  class="topUserBoxRightBottomLeftImg"
                />
                <div class="topUserBoxRightBottomLeftNums">{{ item?.age }}</div>
              </div>
              <img
                @click.stop="handleFollow"
                class="followImg"
                src="./assets/Group1000004619@2x.webp"
              />
            </div>
          </div>
        </div>
        <video
          :id="`videoElement-${index}`"
          ref="videoElement"
          class="videoPlayer"
          autoplay
          x5-video-player-type="h5"
          :webkit-playsinline="true"
          :playsinline="true"
          :controls="false"
        ></video>
      </van-swipe-item>
    </van-swipe>
    <div class="showGiftBox" v-if="state.showFromGift">
      <div class="fromName">
        {{ state.fromGiftObj.fromUser.nickname }}Send for
      </div>
      <div class="toName">{{ state.fromGiftObj.fromUser.toUser }}</div>
      <img :src="state.fromGiftObj?.gift.icon" class="toGIftImg" alt="" />
      <div class="fromName">x1</div>
    </div>
    <div class="msgBox">
      <div
        :class="item.type === 'me' ? 'msgItemMe' : 'msgItem'"
        v-for="(item, index) in state.msgList"
        :key="index"
      >
        <div v-if="item?.nickname">
          {{ item?.nickname }}{{ item?.type === "enter" ? "&nbsp;" : "：" }}
        </div>
        <div>{{ item?.content }}</div>
        <img
          v-if="item?.hasImg"
          @click="handleFollow"
          src="./assets/guanzhu.webp"
          class="welcomeImg"
        />
      </div>
    </div>
    <div class="privateBox">Private~</div>
    <div
      class="callBox"
      @click.stop="
        () => {
          handleGo({
            user: {
              inCall: 0,
              active: 1,
              id: state.userObj?.id,
            },
          }).then((res) => {
            const userDetails = getLocalUserDetail();

            if (!res) {
              if (userDetails?.user?.vipLevel === 0) {
                state.showVipPopup = true;
              } else {
                // state.showRechargePopup = true;
                state.showCallDownLoadPopup = true;
              }
            } else {
              state.showCallDownLoadPopup = true;
            }
          });
        }
      "
    >
      <SvgaShow
        :divId="`demoss`"
        :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
      ></SvgaShow>
    </div>
    <div class="inputBottomBox" v-if="state.showInput">
      <input
        @keyup.center="handleSendMsg"
        v-model="state.inputValue"
        class="inputBox"
        ref="inputRef"
        placeholder="Say something... "
      />
      <img
        @click.stop="handleSendMsg"
        src="./assets/Group1627@2x.webp"
        class="sendImg"
      />
    </div>
    <div class="bottomFlex">
      <div
        class="sayBox"
        @click.stop="handleShowInput"
        v-if="configData?.liveCanSendMsg"
      >
        <div class="sayBoxLeft">Say ...</div>
        <img class="sayBoxRight" src="./assets/Group1627@2x.webp" />
      </div>
      <div class="sayBox1" v-else></div>
      <div class="giftScrollBox">
        <div
          class="giftItem"
          v-for="(item, index) in userGiftListData?.recommendList"
          :key="index"
          @click="handleGive(item)"
        >
          <van-image
            round
            fit="cover"
            lazy-load
            :src="item?.icon"
            class="giftItemImg"
          />
          <div class="giftItemText">{{ item?.value }}</div>
        </div>
      </div>
      <img
        @click.stop="state.showGiftPopup = true"
        src="./assets/Group1000004642@2x.webp"
        class="bottomImg"
      />
    </div>
    <giftPopup
      ref="giftPopupRef"
      v-model="state.showGiftPopup"
      @handleGive="handleGive"
    ></giftPopup>
    <SvgaDialog ref="SvgaDialogRef"></SvgaDialog>
    <CallDownLoadPopup
      v-model="state.showCallDownLoadPopup"
    ></CallDownLoadPopup>
    <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
    <van-popup
      @click-overlay="state.showCallPopup = false"
      v-model:show="state.showCallPopup"
      position="center"
      round
      z-index="20"
    >
      <div class="popupBox">
        <div class="popupTitleBox">
          <img src="./assets/vidoo@2x.webp" class="popupImg" />
        </div>
        <div class="popupContentBox">
          <div class="popupContentOne">
            {{ state.severMsg }}
          </div>
          <div class="btnBox">
            <div class="btnBoxLeft" @click="state.showCallPopup = false">
              cancal
            </div>
            <div
              class="btnBoxRight"
              @click.stop="
                () => {
                  handleGo({
                    user: {
                      inCall: 0,
                      active: 1,
                      id: state.userObj?.id,
                    },
                  }).then((res) => {
                    if (!res) {
                      const userDetails = getLocalUserDetail();
                      if (userDetails?.user?.vipLevel === 0) {
                        state.showVipPopup = true;
                      } else {
                        // state.showRechargePopup = true;
                        state.showCallDownLoadPopup = true;
                      }
                    } else {
                      state.showCallDownLoadPopup = true;
                    }
                  });
                }
              "
            >
              <img src="./assets/Path_1540@2x.webp" class="btnImg" />
              <div>call</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgaShow from "@/components/svgaShow/index.vue";
import giftPopup from "@/components/giftPopup/index.vue";
import {
  giftmalesendOfLive,
  userfollow,
  livelistPage,
  livewatch,
  liveexitWatch,
  usergiftmalelist,
  livecheckPreIm,
  userconfig,
} from "@/api/allApi";
import SvgaDialog from "@/components/svgaDialog/index.vue";
import { closeToast, showLoadingToast, showToast } from "vant";
import flvjs from "flv.js";
import { convertRtmpToFlv, getLocalUserDetail } from "@/common/utils";
import SDK from "@yxim/nim-web-sdk";
import evenBus from "@/common/evenBus";
import CallDownLoadPopup from "@/components/callDownLoadPopup/index.vue";
import { handleGo } from "@/common/fetchCommon";
import { useUserDetailStore } from "@/stores/userDetail";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";
const router = useRouter();

const { userDetail }: any = useUserDetailStore();
const { vipConfigData } = useVipConfigStore();

let chatroom: any = "";

const videoElement = ref<any>();

const flvPlayer = ref<any>(null);

const { fetchData, data, loading } = livelistPage();

const route = useRoute();

const videoSwipeRef = ref<any>();

const { fetchData: userGiftListFetch, data: userGiftListData } =
  usergiftmalelist();

const { fetchData: configFetch, data: configData } = userconfig();

onMounted(async () => {
  state.msgList = [];
  addFirstMsg();
  await userGiftListFetch();
  await configFetch();
  await fetchData({
    offset: 0,
  });
  const routeParams: any = route.query;
  handleWatch(Number(routeParams.index));

  nextTick(() => {
    videoSwipeRef.value.swipeTo(Number(routeParams.index));
  });
});

const createdVideo = (index: number, watchObj: any) => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  nextTick(() => {
    if (flvjs.isSupported()) {
      var videoElement = document.getElementById(`videoElement-${index}`);

      flvPlayer.value = flvjs.createPlayer({
        type: "flv",
        url: convertRtmpToFlv(watchObj?.url),
        isLive: true,
        hasAudio: false,
      });

      flvPlayer.value.attachMediaElement(videoElement);
      flvPlayer.value.load();

      flvPlayer.value.play();
      flvPlayer.value.on(flvjs.Events.MEDIA_INFO, () => {
        closeToast();
      });
      //处理视频播放错误的语法
      flvPlayer.value.on("error", () => {
        showToast(`Not Online`);
        return false;
      });
    }
  });
};

let userInfo: any;
try {
  const info = localStorage.getItem("userInfo");
  userInfo = JSON.parse(info as string);
} catch (e) {
  console.log("error::", e);
}

// 登录房间
const chatroomConnect = (loginObj: any) => {
  chatroom = SDK.Chatroom.getInstance({
    debug: true,
    loginAuthType: 1,
    appKey: import.meta.env.VITE_APP_IM_APPKEY,
    account: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      userInfo?.info?.userId
    }`,
    token: loginObj?.imRoomToken,
    chatroomId: loginObj?.imRoomId,
    chatroomAddresses: loginObj?.imRoomAddr,
    onconnect: onChatroomConnect,
    ondisconnect: onChatroomDisconnect,
    onerror: onChatroomError,
    // onwillreconnect: onChatroomWillReconnect,
    // 消息
    onmsgs: onChatroomMsgs,
  });
};

function onChatroomConnect() {
  console.log("聊天室已连接");
}

function onChatroomDisconnect(error: any) {
  // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
  console.log("连接断开", error);
  if (error) {
    switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
        break;
      // 被踢, 请提示错误后跳转到登录页面
      case "kicked":
        handleExitWatch(state.currentSwiperIndex);
        showToast("Live has ended");
        setTimeout(() => {
          router.go(-1);
        }, 2000);
      default:
        break;
    }
  }
}

function onChatroomError() {
  alert("聊天室未连接");
}

function onChatroomMsgs(msgs: any) {
  const obj = JSON.parse(msgs[0]?.content || "{}");
  if (obj.type === 102) {
    SvgaDialogRef.value.state.svgaUrl = obj?.data?.gift?.animateResource;
    SvgaDialogRef.value.state.showModal = true;
    state.showFromGift = false;
    state.showFromGift = true;
    state.fromGiftObj = obj?.data;
    setTimeout(() => {
      state.showFromGift = false;
    }, 12000);
  }

  //   if (obj?.type === "text") {
  //     state.msgList.push({
  //       nickname: obj.fromNick,

  //       content: obj.content,
  //     });
  //   }
  if (msgs[0]?.type === "text") {
    state.msgList.push({
      nickname: msgs[0].fromNick,
      content: msgs[0].text,
    });
  }

  if (msgs[0]?.attach?.type === "memberEnter") {
    state.msgList.push({
      content: "entered the room",
      nickname: msgs[0]?.attach?.fromNick,
      type: "enter",
    });
  }

  console.log("收到聊天室消息", msgs);
}

onUnmounted(() => {
  // chatroom?.destroy?.({
  //   done: function (err: any) {

  //     console.log("实例已被完全清除");
  //   },
  // });
  handleExitWatch(state.currentSwiperIndex);
});

const state = reactive<any>({
  msgList: [],
  showInput: false,
  inputValue: "",
  showGiftPopup: false,
  userObj: {},
  streamId: "",
  currentSwiperIndex: 0,
  showCallDownLoadPopup: false,
  showVipPopup: false,
  showFromGift: false,
  fromGiftObj: {},
  showCallPopup: false,
});

const inputRef = ref<any>(null);

const handleShowInput = () => {
  state.showInput = true;
  nextTick(() => {
    inputRef.value.focus();
    inputRef.value.addEventListener("blur", handleBlur);
  });
};

const handleBlur = async () => {
  if (state.inputValue.trim() === "") {
    state.inputValue = "";
    state.showInput = false;
  }
};

const {
  fetchData: checkPreImFetch,
  success: checkPreImSuccess,
  msg: checkPreImMsg,
  code,
} = livecheckPreIm();

// 发送消息
const handleSendMsg = async () => {
  if (state.inputValue.trim() === "") return;

  await checkPreImFetch({
    message: state.inputValue,
    streamId: state.streamId,
  });
  if (checkPreImSuccess.value) {
    showLoadingToast({
      duration: 0,
      message: "Please wait...",
      forbidClick: true,
    });

    chatroom.sendText({
      text: state.inputValue,
      done: () => {
        state.msgList.push({
          nickname: "Me",
          content: state.inputValue,
          type: "me",
        });

        closeToast();
        state.inputValue = "";
        inputRef.value.blur();
        state.showInput = false;
      },
    });
  } else {
    if (code.value === 5001) {
      state.severMsg = checkPreImMsg.value;
      state.showCallPopup = true;
    } else {
      showToast(checkPreImMsg.value);
    }
  }
};

const handleDragStart = (index: number) => {};

const handleDragEnd = (index: number) => {};

const handleSwiperChange = async (index: number) => {
  //   if (index >= data.value.list.length) {
  //     showToast("Nothing more");
  //     return;
  //   }
  state.currentSwiperIndex = index;
  state.msgList = [];
  addFirstMsg();
  if (flvPlayer.value) {
    flvPlayer.value.unload();
    flvPlayer.value.destroy();
    flvPlayer.value = null;
  }
  console.log("滑动切换", index);
  if (state.streamId !== "") {
    chatroom?.destroy({
      done: function (err: any) {
        handleExitWatch(index);
      },
    });
  }
  handleWatch(index);
};

const addFirstMsg = () => {
  state.msgList.push({
    type: "text",
    content: "Follow me",
    hasImg: true,
  });
};

// 进入直播
const {
  fetchData: watchFetch,
  success: watchSuccess,
  msg: watchMsg,
  data: waitData,
} = livewatch();

const handleWatch = async (index: number) => {
  state.userObj = data.value.list[Number(index)];

  await watchFetch({ userId: state.userObj.id, clientType: "web" });
  if (watchSuccess.value) {
    state.streamId = waitData.value.streamId;
    await chatroomConnect(waitData.value);
    createdVideo(index, waitData.value);
  } else {
    showToast(watchMsg.value);
    setTimeout(() => {
      router.go(-1);
    }, 2000);
  }
};

// 退出直播
const {
  fetchData: exitWatchFetch,
  success: exitWatchSuccess,
  msg: exitWatchMsg,
} = liveexitWatch();

const handleExitWatch = async (index: number) => {
  state.userObj = data.value.list[Number(index)];

  await exitWatchFetch({
    userId: state.userObj.id,
    streamId: state.streamId,
  });
  if (exitWatchSuccess.value) {
  } else {
    showToast(exitWatchMsg.value);
  }
};

evenBus.on("liveEnd", async () => {
  handleExitWatch(state.currentSwiperIndex);
  showToast("Live has ended");
  setTimeout(() => {
    router.go(-1);
  }, 2000);
});

// 关注
const {
  fetchData: followFetch,
  msg: followMsg,
  success: followSuccess,
} = userfollow();

const handleFollow = async () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await followFetch({
    toUserId: state.userObj.id,
  });
  if (followSuccess.value) {
    showToast("Success");
  } else {
    showToast(followMsg.value);
  }
};

// 送礼
const {
  fetchData: giftFetch,
  data: sendGiftData,
  success: giftSuccess,
  msg: giftMsg,
} = giftmalesendOfLive();

const giftPopupRef = ref<any>();

const SvgaDialogRef = ref<any>();

const handleGive = async (item: any) => {
  await giftFetch({
    // backpack: 0,
    streamId: state.streamId,
    // toUserId: state.userObj.id,
    giftId: item.id,
    total: 1,
  });
  if (giftSuccess.value) {
    state.showGiftPopup = false;
    giftPopupRef.value.wollectFetch();
  } else {
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
</script>
<style lang="scss" scoped>
.bigBox {
  //   padding-top: 100px;
  //   min-height: calc(100vh - 100px);
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(40px); /* 模糊效果，数值越大模糊程度越高 */
  -webkit-backdrop-filter: blur(10px); /* 对于Safari的支持 */
  overflow-y: hidden;
  position: relative;
  overflow-x: hidden;
  .videoSwipe {
    width: 100%;
    height: calc(100vh - 100px);
  }
  .titleName {
    font-family: "ABeeZee", sans-serif;
    font-weight: 400;
    font-size: 40px;
    color: #ffffff;
  }
  .videoPlayer {
    width: 100vw;
    height: calc(100vh - 100px);
    object-fit: cover;
  }
  .topBox {
    position: absolute;
    top: 130px;
    display: flex;
    align-items: center;
    padding-left: 32px;
    .topUserBox {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .topUserBoxImg {
        width: 96px;
        height: 96px;
      }
      .contry {
        position: absolute;
        bottom: -10px;
        width: 33px;
        height: 24px;
      }
    }
    .topUserBoxRight {
      margin-left: 10px;

      .topUserBoxRightName {
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 28px;
        color: #ffffff;
        margin-bottom: 12px;
      }
      .topUserBoxRightBottom {
        display: flex;
        align-items: center;
        .topUserBoxRightBottomLeft {
          width: 62px;
          height: 26px;
          background: #ff61b6;
          border-radius: 40px 40px 40px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          .topUserBoxRightBottomLeftImg {
            width: 16px;
            height: 16px;
          }
          .topUserBoxRightBottomLeftNums {
            font-family: "ABeeZee", sans-serif;
            font-weight: 400;
            font-size: 22px;
            color: #ffffff;
          }
        }
        .followImg {
          margin-left: 14px;
          width: 48px;
          height: 48px;
        }
      }
    }
  }
  .showGiftBox {
    position: absolute;
    background-image: url(./assets/Group1000004618@2x.webp);
    background-size: 100% 100%;
    // background-size: cover;
    background-repeat: no-repeat;
    width: 518px;
    height: 70px;
    bottom: 650px;
    left: 32px;
    display: flex;
    align-items: center;
    padding-left: 30px;
    .fromName {
      font-family: "ABeeZee", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }
    .toName {
      font-family: "ABeeZee", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffd600;
      margin-left: 8px;
    }
    .toGIftImg {
      min-width: 46px;
      max-width: 46px;
      height: 46px;
      margin-left: 8px;
      margin-right: 5px;
    }
  }
  .msgBox {
    position: absolute;
    bottom: 240px;
    left: 32px;
    max-width: 480px;
    height: 376px;
    overflow-y: auto;
    border-radius: 0px 0px 0px 0px;
    .msgItem {
      border-radius: 8px;
      background-color: #696266;
      //   min-width: 100px;
      //   max-width: 480px;
      padding: 16px 24px 16px 24px;
      flex-grow: 1; /* 允许元素填充宽度 */
      width: max-content; /* 仅根据内容宽度进行自适应 */
      min-height: 52px;
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #eb6300;
      display: flex;
      align-items: center;
      padding-left: 24px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .welcomeImg {
        margin-left: 12px;
        width: 40px;
        height: 40px;
      }
    }
    .msgItemMe {
      border-radius: 8px;
      background-color: #696266;
      //   min-width: 100px;
      //   max-width: 480px;
      padding: 16px 24px 16px 24px;
      flex-grow: 1; /* 允许元素填充宽度 */
      width: max-content; /* 仅根据内容宽度进行自适应 */
      min-height: 52px;
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #f1db15;
      display: flex;
      align-items: center;
      padding-left: 24px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .welcomeImg {
        margin-left: 12px;
        width: 40px;
        height: 40px;
      }
    }
  }
  .privateBox {
    position: absolute;
    bottom: 370px;
    right: 16px;
    background-image: url("./assets/Group1000004779@2x.webp");
    width: 160px;
    height: 88px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    font-family: "ABeeZee", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    justify-content: center;
    padding-bottom: 30px;
  }
  .callBox {
    position: absolute;
    bottom: 200px;
    right: 16px;
    width: 160px;
    height: 160px;
    background: #f9577e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inputBottomBox {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding-right: 24px;
    z-index: 2;
    .inputBox {
      padding-left: 24px;
      line-height: 88px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      border-radius: 200px 200px 200px 200px;
      color: #000;
      background-color: #fff;
      width: 95%;
    }
    .inputBox::placeholder {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #ababab;
    }
    .sendImg {
      width: 40px;
      height: 40px;
    }
  }
  .bottomFlex {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 32px;
    width: 100%;
    padding-left: 32px;
    padding-right: 18px;
    .sayBox {
      width: 252px;
      height: 112px;
      background: #ffffff;
      box-shadow: inset 0px 0px 180px 0px rgba(255, 255, 255, 0.2);
      border-radius: 80px 80px 80px 80px;
      //   border: 2px solid;

      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 18px;
      padding-right: 36px;
      .sayBoxLeft {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #ababab;
      }
      .sayBoxRight {
        width: 40px;
        height: 40px;
      }
    }
    .sayBox1 {
      width: 252px;
      height: 112px;
      background: none;
      background-color: none;

      //   box-shadow: inset 0px 0px 180px 0px rgba(255, 255, 255, 0.2);
      border-radius: 80px 80px 80px 80px;
      //   border: 2px solid;

      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 18px;
      padding-right: 36px;
      .sayBoxLeft {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #ababab;
      }
      .sayBoxRight {
        width: 40px;
        height: 40px;
      }
    }
    .giftScrollBox {
      width: 348px;
      overflow-x: scroll;
      padding-left: 12px;
      display: flex;
      align-items: center;
      .giftItem {
        flex-shrink: 0;
        margin-right: 12px;
        width: 100px;
        height: 98px;
        background: #415c63;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .giftItemImg {
          width: 63px;
          height: 64px;
        }
        .giftItemText {
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 24px;
          color: #ffffff;
        }
      }
    }
    .bottomImg {
      width: 100px;
      height: 100px;
    }
  }
  .van-popup {
    background: none;
  }
  .popupBox {
    .popupTitleBox {
      width: 600px;
      height: 120px;
      background: linear-gradient(90deg, #fcb73e 0%, #fc9b57 100%);
      border-radius: 20px 20px 0px 0px;
      display: flex;
      align-items: center;
      padding-left: 20px;
      .popupImg {
        width: 138px;
        height: 44px;
      }
    }
    .popupContentBox {
      width: 600px;
      background: #752e2e;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 36px;
      flex-direction: column;
      .popupImg {
        width: 180px;
        height: 175px;
      }
      .popupContentOne {
        //   padding-left: 42px;
        //   padding-right: 42px;
        padding-left: 24px;
        padding-right: 24px;
        font-family: "ABeeZee", sans-serif;
        font-weight: 400;
        font-size: 40px;
        color: #ffffff;
        text-align: center;
      }
      .popupContentTwo {
        text-align: center;
        margin-top: 20px;
        padding-left: 24px;
        padding-right: 24px;
        font-weight: 400;
        font-size: 40px;
        color: #ffffff;
      }
      .btnBox {
        padding-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-left: 32px;
        padding-right: 32px;
        .btnBoxLeft {
          background-image: url(./assets/Slice174@2x.webp);
          background-size: 100% 100%;
          // background-size: cover;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 256px;
          height: 76px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 40px;
          color: #eb6300;
        }
        .btnBoxRight {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 256px;
          height: 76px;
          background-color: #eb6300;
          border-radius: 20px;
          .btnImg {
            width: 44px;
            height: 44px;
            margin-right: 8px;
          }
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 40px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
