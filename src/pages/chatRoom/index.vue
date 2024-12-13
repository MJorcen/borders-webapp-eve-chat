<template>
  <div class="bigBox">
    <van-nav-bar title="" left-text="" fixed>
      <template #left>
        <div class="topLeftBox">
          <van-icon
            name="arrow-left"
            size="18"
            color="#eb6300"
            @click="
              () => {
                nim.resetSessionUnread(`p2p-${preFix}${data?.user?.id}`);
                router.go(-1);
                handleSetCash();
              }
            "
          />
          <van-image
            round
            fit="cover"
            radius="50"
            lazy-load
            :src="data?.user?.avatar"
            alt=""
            class="hostImg"
          ></van-image>
          <div class="hostName">
            {{ data?.user?.nickname }}
          </div>
          <div
            class="onlineBox"
            v-if="data?.user?.inCall === 0 && data?.user?.active === 1"
          >
            <div class="onlineYuan"></div>
            <div class="onlineYuanFont">Online</div>
          </div>
          <div v-if="data?.user?.active === 0" class="offlineBox">
            <div class="onlineYuan"></div>
            <div class="onlineYuanFont">Offline</div>
          </div>
          <div
            v-if="data?.user?.inCall === 1 && data?.user?.active === 1"
            class="busyBox"
          >
            <div class="onlineYuan"></div>
            <div class="onlineYuanFont">Busy</div>
          </div>
        </div>
      </template>
      <template #right>
        <div class="flex items-center">
          <div
            v-if="data?.user?.liked === 0"
            class="rightBtn"
            @click.stop="handleFollow"
          >
            Follow
          </div>
          <!-- <div v-else class="rightBtnUn" @click.stop="handleCancelFollow">
            UnFollow
          </div> -->
          <!-- <img src="./assets/列表图标@2x.png" class="w-[24px] h-[24px]" /> -->
        </div>
      </template>
    </van-nav-bar>
    <div class="chatBox">
      <van-skeleton :loading="loading" title :row="3">
        <div class="hostBox">
          <div class="hostBoxTop">
            <van-image
              round
              fit="cover"
              radius="50"
              lazy-load
              :src="data?.user?.avatar"
              alt=""
              class="hostImg"
              @click.stop="
                () => {
                  showImagePreview([data?.user?.avatar]);
                }
              "
            ></van-image>
            <div class="hostBoxTopRight">
              <div class="hostBoxTopRightFlex">
                <div class="yuan" v-if="data?.user?.onDuty"></div>
                <div class="hostName">{{ data?.user?.nickname }}</div>
                <div class="age">{{ data?.user?.age }}</div>
              </div>
              <div class="hostBoxTopRightFlexBottom">
                <img
                  :src="getCountryImg(data?.user)"
                  alt=""
                  class="countryImg"
                />
                <div class="country">{{ data?.user?.region }}</div>
              </div>
            </div>
          </div>
          <div class="contentBox">
            {{ data?.user?.intro }}
          </div>
          <div class="photoBox">
            <van-image
              fit="cover"
              radius="8"
              class="photoImg"
              v-for="(item, index) in data.images"
              :src="item.image"
              lazy-load
              @click.stop="
                () => {
                  showImagePreview([item.image]);
                }
              "
            >
            </van-image>
          </div>
        </div>
      </van-skeleton>
      <div
        class="chatMsgBox"
        v-for="(item, index) in state.messageList"
        :key="index"
      >
        <div class="chatMsgTime">
          {{ item.date }}
        </div>

        <div v-for="(it, inx) in item.messages" :key="inx">
          <div :class="it.to !== roomUserId ? 'userLeftBox' : 'userRightBox'">
            <van-image
              fit="cover"
              radius="50"
              :src="
                it.to !== roomUserId
                  ? data?.user?.avatar
                  : userInfo?.user?.avatar
              "
              :class="
                it.to !== roomUserId ? 'userLeftBoxImg' : 'userRightBoxImg'
              "
              lazy-load
              v-if="it.to !== roomUserId"
            ></van-image>
            <!-- 文字 -->
            <!-- <div> -->
            <img
              class="noSendSuccessImg"
              src="./assets/Slice 404@2x.png"
              v-if="it.to === roomUserId && it?.callbackExt"
            />
            <div
              :class="
                it.to !== roomUserId
                  ? 'userLeftBoxContent'
                  : 'userRightBoxContent'
              "
              v-if="
                it.type === 'text' &&
                !it.text.includes('md5') &&
                !it.text.includes('anchorUserId') &&
                !it.text.includes('ext') &&
                !it.text.includes('displayName')
              "
            >
              {{ it.text }}
              <div
                class="transBox"
                v-if="it.type === 'text' && it.to !== roomUserId"
                @click="handleTranslate(it)"
              >
                <img
                  src="./assets/Slice130@2x.webp"
                  class="w-[20px] h-[20px] mr-[8px]"
                />
                <div>See translation</div>
              </div>
            </div>

            <!-- </div> -->
            <!-- 文字 -->
            <!-- 位置 -->
            <div
              v-if="it?.text?.includes('displayName') || it?.geo"
              :class="
                it.to !== roomUserId
                  ? 'userLeftBoxContentDis'
                  : 'userRightBoxContentDis'
              "
            >
              <div v-if="it.to !== roomUserId">
                {{ JSON.parse(it?.text)?.name }}
              </div>
              <!-- <div class="locationBox" v-if="it.to !== roomUserId">
                {{ JSON.parse(it?.text)?.vicinity }}
              </div> -->
              <img
                :src="JSON.parse(it?.text)?.mapUrl"
                style="width: 300px; height: 250px"
              />
              <div class="mapFont" v-if="JSON.parse(it?.text)?.name === ''">
                Allow location access to view the message
              </div>
              <div class="allowBig">
                <div class="allowBtn" @click.stop="handleAllow">Allow</div>
              </div>
              <!-- <GoogleMap
                :position="getDistance(it)"
                v-if="it?.type === 'geo' || it?.text?.includes('locationLat')"
              ></GoogleMap> -->
            </div>
            <!-- 位置 -->

            <!-- 礼物 -->
            <div
              class="giftBox"
              v-if="it.type === 'custom' && JSON.parse(it.content).type === 1"
            >
              <div class="giftBoxLeft">
                <div class="giftBoxLeftTop">
                  <div class="giftBoxLeftTopFont">
                    {{ JSON.parse(it.content).data.gift.name }}
                  </div>
                  <div class="giftBoxLeftTopFontNums">
                    x {{ JSON.parse(it.content)?.data?.number }}
                  </div>
                </div>
                <div class="giftBoxLeftBottom">
                  <img
                    src="./assets/coin_16@2x.png"
                    class="w-[16px] h-[16px] mr-[4px]"
                  />
                  <div class="giftBoxLeftBottomFont">
                    {{ JSON.parse(it.content)?.data?.gift?.value }}
                  </div>
                </div>
              </div>
              <img
                :src="JSON.parse(it.content)?.data?.gift?.icon"
                alt=""
                class="giftBoxRightImg"
              />
            </div>
            <!-- 礼物 -->

            <!-- 发送图片 -->

            <van-image
              fit="cover"
              lazy-load
              radius="8"
              style="min-width: 80px"
              v-if="
                (it.type === 'image' ||
                  it.text.includes('png') ||
                  it.text.includes('jpg') ||
                  it.text.includes('jpeg') ||
                  it.text.includes('jfif')) &&
                !it.text.includes('displayName')
              "
              :src="it.file?.url || JSON.parse(it?.text)?.url"
              @click.stop="
                () => {
                  showImagePreview([it.file?.url || JSON.parse(it?.text)?.url]);
                }
              "
              class="sendImg"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>

            <!-- 发送图片 -->

            <!-- 视频文件 -->
            <div class="w-[200px] h-[200px]" v-if="it.sss">
              <video
                width="100%"
                height="100%"
                src="http://devres.sqqy188.com/蝶梦恋人.mp4"
                controls
                class="videoClass"
                preload="metadata"
              >
                您的浏览器不支持视频标签。
              </video>
            </div>
            <!-- 视频文件 -->

            <!-- 拨打完成和未完成 -->
            <div
              v-if="it.type === 'custom' && JSON.parse(it.content).type === 2"
              :class="
                it.to !== roomUserId ? 'audioBoxUserLeft' : 'audioBoxUserRight'
              "
            >
              <img
                v-if="it.to !== roomUserId"
                src="./assets/ic_video-off@3x.png"
                class="w-[24px] h-[24px]"
              />
              <div
                class="cancelFont"
                v-if="JSON.parse(it.content)?.data?.call?.duration === 0"
              >
                Canceled
              </div>
              <div v-else class="callTime">
                Video call
                {{
                  formatSecondsToTime(
                    JSON.parse(it.content)?.data?.call?.duration
                  )
                }}
              </div>
              <img
                v-if="it.to === roomUserId"
                src="./assets/ic_video-off@2x.png"
                class="w-[24px] h-[24px]"
              />
            </div>

            <!-- 拨打完成和未完成 -->

            <!-- 搭讪视频的通话完成和未完成 -->
            <div
              v-if="it.text.includes('anchorUserId')"
              :class="
                it.to !== roomUserId ? 'audioBoxUserLeft' : 'audioBoxUserRight'
              "
            >
              <img
                v-if="it.to !== roomUserId"
                src="./assets/ic_video-off@3x.png"
                class="w-[24px] h-[24px]"
              />
              <div
                class="cancelFont"
                v-if="JSON.parse(it.text)?.duration === 0"
              >
                Canceled
              </div>
              <div v-else class="callTime">
                Video call
                {{ formatSecondsToTime(JSON.parse(it.text)?.duration) }}
              </div>
              <img
                v-if="it.to === roomUserId"
                src="./assets/ic_video-off@2x.png"
                class="w-[24px] h-[24px]"
              />
            </div>
            <!-- 搭讪视频的通话完成和未完成 -->

            <!-- 音频文件 -->
            <div
              v-if="
                it.type === 'audio' ||
                it.text.includes('audio') ||
                JSON?.parse?.(JSON.stringify(it.text))?.ext === 'aac'
              "
              :class="
                it.to !== roomUserId ? 'audioBoxUserLeft' : 'audioBoxUserRight'
              "
              @click="
                (e) => {
                  if (it?.file) {
                    it.file.isRead = true;
                    it.file.isPlay = true;
                  } else {
                    it.isPlay = true;
                  }
                  handlePlay(e, it?.file?.mp3Url || JSON.parse(it?.text)?.url);
                  // if (it?.file) {
                  handlePlayOver(it);
                  // }
                }
              "
            >
              <img
                v-if="it.to !== roomUserId && !it.file?.isPlay && !it.isPlay"
                src="./assets/ic_voice.png"
                class="w-[24px] h-[24px] mr-[10px]"
              />
              <img
                v-if="it.to !== roomUserId && (it.file?.isPlay || it.isPlay)"
                src="./assets/saying.gif"
                class="w-[24px] h-[24px] mr-[10px]"
              />
              <!-- <img
                v-if="it.to === roomUserId"
                src="./assets/ic_play.png"
                class="w-[30px] h-[30px]"
              /> -->
              <div class="audioNums">
                {{
                  Math.floor(
                    it.file?.dur / 1000 || JSON.parse(it?.text)?.dur / 1000
                  ) || 2
                }}"
              </div>
              <!-- <img
                v-if="it.to !== roomUserId"
                src="./assets/ic_play.png"
                class="w-[30px] h-[30px]"
              /> -->
              <!-- <audio
                style="display: none"
                width="100%"
                height="100%"
                controls
                class="audioClass"
                :ref="setRefList"
              >
                <source :src="it?.file.mp3Url" />
              </audio> -->
              <img
                v-if="it.to === roomUserId && !it.file?.isPlay"
                src="./assets/ic_voice.png"
                class="w-[24px] h-[24px] ml-[10px] rotate-180"
              />
              <img
                v-if="it.to === roomUserId && it.file?.isPlay"
                src="./assets/saying.gif"
                class="w-[24px] h-[24px] ml-[10px] rotate-180"
              />
            </div>
            <!-- 小圆点 -->
            <!-- <div
              v-if="
                it.to !== roomUserId &&
                it.type === 'audio' &&
                !it.file?.isRead &&
                it.file.isNewAudioMsg
              "
              class="yuan"
            ></div> -->
            <!-- 小圆点 -->

            <!-- 右边的头像 -->
            <van-image
              fit="cover"
              radius="50"
              :src="userDetail?.user?.avatar"
              class="userRightBoxImg"
              lazy-load
              v-if="it.to === roomUserId"
            ></van-image>
            <!-- 右边的头像 -->
          </div>
        </div>
      </div>

      <div class="w-[100%] h-[100px]"></div>
    </div>
    <div class="bottomBox">
      <div class="bottomBoxTop">
        <img
          v-if="state.isInput"
          src="./assets/ic_mic_44.png"
          class="audioImg"
          @click="state.isInput = false"
        />
        <img
          v-else
          src="./assets/Frame 3367.png"
          class="ic_mic_44"
          @click="state.isInput = true"
        />
        <input
          v-if="state.isInput"
          v-model="state.inputText"
          type="text"
          placeholder="Say something..."
          class="bottomInput"
          @keyup.enter="handleSend"
        />
        <div
          ref="touchElement"
          class="audioBox"
          v-if="!state.isInput"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
          @touchmove="onTouchMove"
        >
          touch to talk
        </div>

        <!-- <div
          class="audioBox"
          v-if="isRecording && !state.isInput"
          @click="stopRecording"
        >
          Stop Recording
        </div> -->
        <img
          class="sendImg"
          src="./assets/ic_send@2x.png"
          @click="handleSend"
        />
      </div>
      <div class="bottomBoxBottom">
        <div class="bottomImgPos">
          <img
            class="toolsImg"
            @click.stop="handleFileChange"
            src="./assets/ic_photo_44@2x.png"
          />
          <input
            class="uploadClass"
            type="file"
            ref="fileInput"
            @change="triggerFileInput"
            id="upload-files"
            accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
            multiple
          />
        </div>
        <div
          class="toolsImg"
          @click.stop="
            () => {
              handleGo(data).then((res) => {
                const userDetails = getLocalUserDetail();

                if (!res) {
                  if (userDetails?.user?.vipLevel === 0) {
                    state.showVipPopup = true;
                  } else {
                    // state.showRechargePopup = true;
                    // state.showCallDownLoadPopup = true;
                    state.showAppUserDownLoadPopup = true;
                  }
                } else {
                  // state.showCallDownLoadPopup = true;
                  state.showAppUserDownLoadPopup = true;
                }
              });
            }
          "
        >
          <SvgaShow
            :url="'https://fs.duome.live/app/animation/call_animation_color.svga'"
          ></SvgaShow>
        </div>
        <!-- <img
          class="disImg"
          src="./assets/dis3.webp"
          @click.stop="handleSendDistance"
        /> -->

        <img
          class="toolsImg"
          src="./assets/ic_gift@2x.png"
          @click.stop="showGiftPopup = true"
        />
      </div>
    </div>
    <audio
      style="display: none"
      width="100%"
      height="100%"
      controls
      class="audioClass"
      ref="audioRef"
    >
      <source type="audio/aac" />
      <source type="audio/mp3" />
      <source type="audio/mp4" />

      <!-- <source type="audio/mpeg,mp3,mp4"/> -->
    </audio>
    <Dialog ref="DialogRef">
      <template v-slot:modalContent>
        <div class="redBig">
          <div class="redBox" v-if="!isInside">
            <img class="redSource" src="./assets/Group14140@2x.webp" />
            <div class="redText">Swipe up cancel to sending</div>
          </div>
        </div>
        <!-- <div class="whiteBox" v-else>
          <img class="whiteSource" src="./assets/whiteSource.png" />
        </div> -->
      </template>
    </Dialog>
    <SvgaDialog ref="SvgaDialogRef"></SvgaDialog>
    <giftPopup
      ref="giftPopupRef"
      v-model="showGiftPopup"
      @handleGive="handleGive"
    ></giftPopup>
    <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
    <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
    <!-- <FirstVipPromptPopup
      :video-url="configData.firstVipPromptVideo"
      v-model="state.showFirstVipPromptPopup"
    >
    </FirstVipPromptPopup> -->
    <CallDownLoadPopup
      v-model="state.showCallDownLoadPopup"
    ></CallDownLoadPopup>
    <AppUserDownLoadPopup
      v-model="state.showAppUserDownLoadPopup"
    ></AppUserDownLoadPopup>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  computed,
  nextTick,
  watch,
  onUnmounted,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { userget, userfollow } from "@/api/allApi";
import {
  showImagePreview,
  showLoadingToast,
  showToast,
  closeToast,
} from "vant";
import { useImHook } from "@/hook/useIm";
import evenBus from "@/common/evenBus";
import {
  generateRandomString,
  extractDate,
  groupMessagesByDay,
  groupMessagesByDayNoReverse,
  formatSecondsToTime,
  getLocalUserDetail,
} from "@/common/utils";
import dayjs from "dayjs";
import Recorder from "recorder-core"; //注意如果未引用Recorder变量，可能编译时会被优化删除（如vue3 tree-shaking），请改成 import 'recorder-core'，或随便调用一下 Recorder.a=1 保证强引用
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
import Dialog from "./compoents/Dialog.vue";
import SvgaDialog from "@/components/svgaDialog/index.vue";
import giftPopup from "@/components/giftPopup/index.vue";
import {
  giftsend,
  datatranslate,
  userunfollow,
  userconfig,
  userlocation,
} from "@/api/allApi";
import { handleGo } from "@/common/fetchCommon";
import { useUserDetailStore } from "@/stores/userDetail";
import RechargePopup from "@/components/rechargePopup/index.vue";
import SvgaShow from "@/components/svgaShow/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import GoogleMap from "@/components/googleMap/index.vue";
// import FirstVipPromptPopup from "@/components/firstVipPromptPopup/index.vue";
import CallDownLoadPopup from "@/components/callDownLoadPopup/index.vue";
import AppUserDownLoadPopup from "@/components/appUserDownLoadPopup/index.vue";

const { vipConfigData } = useVipConfigStore();

const preFix = import.meta.env.VITE_APP_ACCOUNT_PREFIX;

const { fetchData: configFetch, data: configData } = userconfig();

const { userDetail }: any = useUserDetailStore();

let userInfo: any;
try {
  const info = localStorage.getItem("userInfo");
  userInfo = JSON.parse(info as string);
} catch (e) {
  console.log("error::", e);
}

const showGiftPopup = ref(false);

const router = useRouter();

const route = useRoute();

// const roomUserId = computed(() => {
//   return `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${data?.value?.user?.id}`;
// });

const roomUserId = ref();

const info = JSON.parse(route.query?.user as string);

const { nim, getRoomMsg } = useImHook();

const state = reactive<any>({
  inputText: "",
  messageList: [],
  isInput: true,
  showRechargePopup: false,
  showVipPopup: false,
  showFirstVipPromptPopup: false,
  showCallDownLoadPopup: false,
  showAppUserDownLoadPopup: false,
});

const SvgaDialogRef = ref<any>();

onMounted(async () => {
  getUserData();
  await configFetch();
  nextTick(() => {
    // var height = document.body.clientHeight;
    window.scroll({ top: 100000000, behavior: "instant" });
  });
  // 初始化组件时确保浏览器支持 MediaDevices.getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error("getUserMedia not supported in this browser.");
  }
  // useBetterScroll(".bigBox");
});

onUnmounted(() => {
  nim.resetSessionUnread(`p2p-${preFix}${data?.value.user?.id}`);
  // 离开页面存在自定义字段的localCustom数据清洗
  nim.getLocalSession({
    sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
      data?.value?.user?.id
    }`,
    done: (error: any, session: any) => {
      console.log(error);
      console.log(session);

      console.log("获取本地会话" + (!error ? "成功" : "失败"));

      if (session?.localCustom) {
        let newWsMsgArr: any = [];
        try {
          newWsMsgArr = JSON.parse(localStorage.getItem("wsMsgArr") || "[]");
        } catch (e) {
          console.log(e);
        }

        let fromArrMsg: any = [];
        fromArrMsg = newWsMsgArr.filter((item: any) => {
          return item.from === data?.value?.user?.id;
        });

        fromArrMsg = fromArrMsg.filter((item: any) => {
          return item.time > new Date().getTime();
        });

        const currentObj = {
          userId: data.value.user.id,
          time: new Date().getTime(),
        };
        localStorage.setItem("currentChatRoomObj", JSON.stringify(currentObj));

        const obj = JSON.parse(session.localCustom);
        obj.unread = fromArrMsg.length;
        nim.updateLocalSession({
          localCustom: JSON.stringify(obj),
          id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
            data?.value?.user?.id
          }`,
          done: (err: any, obj: any) => {
            console.log(`output->错误`, err);
            console.log(`output->更新的会话结构`, obj);
          },
        });
      }
    },
  });
  window.scroll({ top: 0 });
});

watch(
  () => state.messageList,
  () => {
    nextTick(() => {
      // if (route.name === "chatRoom") {
      window.scroll({ top: 100000000, behavior: "instant" });
      // }
    });
  },
  { immediate: true, deep: true }
);

const { fetchData, data, loading } = userget();

const getUserData = async () => {
  await fetchData({
    id: route.query?.type === "formMsgList" ? info?.custom?.cuteId : info?.id,
    scene: "userPage",
  });
  roomUserId.value = `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
    data.value.user.id
  }`;
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  getRoomMsg(data.value.user.cuteId).then((res) => {
    getChatMsgList(res || [], "首次获取进来");
  });
};

// 防止浏览器刷新
evenBus.on("setFunc", () => {
  // showLoadingToast({
  //   message: "Please wait...",
  //   forbidClick: true,
  //   duration: 0,
  // });
  getRoomMsg(data.value?.user?.cuteId).then((res) => {
    getChatMsgList(res || [], "shuaxin");
  });
});

// 监听到消息更新后更新页面数据
evenBus.on("updateSessionChatRoom", () => {
  getRoomMsg(data.value?.user?.cuteId).then((res) => {
    getChatMsgList(res || [], "监听到消息更新");
  });
});

const getChatMsgList = (msgList: any, from: string) => {
  console.log(`从哪个监听获取到的消息`, from);
  // state.messageList = msgList;

  // state.messageList = groupMessagesByDay(state.messageList);
  state.messageList = groupMessagesByDay(msgList);
  nextTick(() => {
    // window.scroll({ top: 100000000, behavior: "instant" });
    closeToast();
  });
  console.log(state.messageList, "最终获取的数据");
  closeToast();
};

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
    toUserId: data.value.user.id,
  });
  if (followSuccess.value) {
    showToast("Success");
    getUserData();
  } else {
    showToast(followMsg.value);
  }
};

const fileInput = ref<any>(null);
const handleFileChange = () => {
  fileInput.value.click();
};

const triggerFileInput = (event: any) => {
  const files = event.target.files;
  if (files.length > 0) {
    // const file = files[0];
    // afterRead(file);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (configData.value?.hasPayment) {
        state.showAppUserDownLoadPopup = true;
        return;
      } else {
        afterRead(file);
      }
    }
  }
};

// 发送图片
const afterRead = async (file: any) => {
  const md532Str = generateRandomString();
  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });
  nim.sendFile({
    scene: "p2p",
    to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${data.value.user.id}`,
    type: "image",
    // fileInput: "upload-files",
    blob: file,
    fastPass: `{"w":200,"h":110,"md5":${md532Str}}`,
    env: `${import.meta.env.VITE_APP_CHAOSONG_ENV}`,
    beginupload: function (upload: any) {
      // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
      // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
    },
    uploadprogress: function (obj: any) {
      console.log("文件总大小: " + obj.total + "bytes");
      console.log("已经上传的大小: " + obj.loaded + "bytes");
      console.log("上传进度: " + obj.percentage);
      console.log("上传进度文本: " + obj.percentageText);
    },
    uploaddone: function (error: any, file: any) {
      console.log(error);
      console.log(file);
      console.log("上传" + (!error ? "成功" : "失败"));
    },
    beforesend: function (msg: any) {
      console.log("正在发送p2p image消息, id=" + msg.idClient);
      // getNowMsgList(msg);
      // 判断是不是存在自定义消息的用户，存在则需要去清洗自定义数据
      nim.getLocalSession({
        sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          data?.value?.user?.id
        }`,
        done: (error: any, session: any) => {
          console.log(error);
          console.log(session);
          console.log("获取本地会话" + (!error ? "成功" : "失败"));

          if (session?.localCustom) {
            const obj = JSON.parse(session.localCustom);
            obj.unread = 0;
            obj.cusstomMsg = "";
            nim.updateLocalSession({
              localCustom: JSON.stringify(obj),
              id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
                data?.value?.user?.id
              }`,
              done: (err: any, obj: any) => {
                console.log(`output->错误`, err);
                console.log(`output->更新的会话结构`, obj);
              },
            });
          }
        },
      });
    },
    done: sendMsgDone,
  });
};

// 发送文字
const handleSend = async () => {
  if (configData.value?.hasPayment) {
    state.showAppUserDownLoadPopup = true;
    return;
  }
  if (state.inputText.trim() === "") {
    return;
  }

  showLoadingToast({
    message: "Please wait...",
    forbidClick: true,
    duration: 0,
  });

  nim.sendText({
    scene: "p2p",
    to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${data.value.user.id}`,
    text: state.inputText,
    env: `${import.meta.env.VITE_APP_CHAOSONG_ENV}`,
    done: sendMsgDone,
  });
  state.inputText = "";
};

// 发送消息回调
async function sendMsgDone(error: any, msg: any) {
  console.log(error);
  console.log(msg);
  console.log(
    "发送" +
      msg.scene +
      " " +
      msg.type +
      "消息" +
      (!error ? "成功" : "失败") +
      ", id=" +
      msg.idClient
  );
  // await configFetch();

  if (error) {
    showToast(error);
  } else {
    if (msg.callbackExt) {
      // state.showVipPopup = true;
      const userDetails = getLocalUserDetail();
      if (userDetails?.user?.vipLevel === 0) {
        state.showVipPopup = true;
      } else {
        state.showRechargePopup = true;
      }
      if (configData?.value?.showFirstVipPrompt) {
        state.showFirstVipPromptPopup = true;
      }
    }
    // if (state.messageList.length) {
    //   getNowMsgList(msg);
    // } else {
    //   state.messageList.push(msg);
    //   state.messageList = groupMessagesByDay([...state.messageList]);
    // }

    // 加定时器是为了拿callbackExt的抄送字段
    const timer = setInterval(() => {
      getRoomMsg(data.value.user.cuteId).then((res) => {
        getChatMsgList(res || [], "send");
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
    }, 1000);

    nim.getLocalSession({
      sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
        data?.value?.user?.id
      }`,
      done: (error: any, session: any) => {
        console.log(error);
        console.log(session);
        console.log("获取本地会话" + (!error ? "成功" : "失败"));

        if (session?.localCustom) {
          const obj = JSON.parse(session.localCustom);
          obj.unread = 0;
          obj.cusstomMsg = "";
          nim.updateLocalSession({
            localCustom: JSON.stringify(obj),
            id: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
              data?.value?.user?.id
            }`,
            done: (err: any, obj: any) => {
              console.log(`output->错误`, err);
              console.log(`output->更新的会话结构`, obj);
            },
          });
        }
      },
    });
  }
}

// 收到消息后推送到数组里
evenBus.on("onMsg", (msg: any) => {
  getRoomMsg(data.value.user.cuteId).then((res) => {
    getChatMsgList(res || [], "收到消息");
  });
  // getNowMsgList(msg);
});

const getNowMsgList = (msg: any) => {
  // showLoadingToast({
  //   message: "Please wait...",
  //   forbidClick: true,
  //   duration: 0,
  // });
  const time = extractDate(msg.time);
  let newMsg = msg;

  if (msg.type === "audio") {
    newMsg.file.isRead = false;
    newMsg.file.isNewAudioMsg = true;
  }
  // if (msg.type === "custom") {
  //   newMsg.content = JSON.parse(newMsg.content);
  // }
  let resArr: any = [];
  let flag: boolean = false;
  state.messageList = state.messageList.map((item: any) => {
    if (item.date === time) {
      item.messages.push(newMsg);
      flag = true;
    }
    resArr = [...item.messages, ...resArr];
    return item;
  });
  if (!flag) {
    resArr.push(newMsg);
  }
  state.messageList = groupMessagesByDayNoReverse(resArr);
  if (flag) {
    state.messageList = [...state.messageList].reverse();
  }

  nextTick(() => {
    if (route.name === "chatRoom") {
      window.scroll({ top: 100000000, behavior: "instant" });
      closeToast();
    }
  });
};

const isRecording = ref(false);

var rec: any;

rec = Recorder({
  type: "mp3", //录音格式，可以换成wav等其他格式
  sampleRate: 16000, //录音的采样率，越大细节越丰富越细腻
  bitRate: 16, //录音的比特率，越大音质越好
  onProcess: (): void => {
    //录音实时回调，大约1秒调用12次本回调
    //可实时绘制波形，实时上传（发送）数据
  },
});
rec.open(
  () => {
    console.log("录音已打开");
  },
  (msg: string, isUserNotAllow: boolean) => {
    //用户拒绝了录音权限，或者浏览器不支持录音
    console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
  }
);

// 手指触碰事件
const DialogRef = ref<any>();

const touchElement = ref<any>(null);

const isInside = ref<any>(false);

const onTouchStart = (event: any) => {
  if (!configData.value?.hasPayment) {
    const userDetails = getLocalUserDetail();

    if (userDetails?.user?.vipLevel === 0) {
      state.showVipPopup = true;
    } else {
      // state.showRechargePopup = true;
      // state.showCallDownLoadPopup = true;
      state.showAppUserDownLoadPopup = true;
    }
  } else {
    state.showAppUserDownLoadPopup = true;
    return;
  }
  event.preventDefault();

  rec.start();
  DialogRef.value.state.showModal = true;
  isInside.value = true;
};

const onTouchEnd = (event: any) => {
  event.preventDefault();
  console.log(`output->`, "触摸结束了");
  if (isInside.value) {
    stopRecording();
  }
  DialogRef.value.state.showModal = false;
};

const onTouchMove = (event: any) => {
  const touch = event.touches[0];
  const rect = touchElement.value.getBoundingClientRect();
  isInside.value =
    touch.clientX >= rect.left &&
    touch.clientX <= rect.right &&
    touch.clientY >= rect.top &&
    touch.clientY <= rect.bottom;
};

// 结束录音
function stopRecording() {
  rec.stop(function (blob: any, duration: any) {
    var localUrl = (window.URL || webkitURL).createObjectURL(blob);
    console.log(blob, localUrl, "时长:" + duration + "ms");
    nim.sendFile({
      scene: "p2p",
      to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${data.value.user.id}`,
      type: "audio",
      blob: blob,
      env: `${import.meta.env.VITE_APP_CHAOSONG_ENV}`,
      beginupload: function (upload: any) {
        // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
        // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
        showLoadingToast({
          message: "Please wait...",
          forbidClick: true,
          duration: 0,
        });
      },
      uploadprogress: function (obj: any) {
        console.log("文件总大小: " + obj.total + "bytes");
        console.log("已经上传的大小: " + obj.loaded + "bytes");
        console.log("上传进度: " + obj.percentage);
        console.log("上传进度文本: " + obj.percentageText);
      },
      uploaddone: function (error: any, file: any) {
        console.log(error);
        console.log(file);
        console.log("上传" + (!error ? "成功" : "失败"));
      },
      beforesend: function (msg: any) {
        console.log("正在发送p2p image消息, id=" + msg.idClient);
      },
      done: sendMsgDone,
    });
  });

  isRecording.value = false;
}

const audioRef = ref<any>(null);

// 播放语音
const handlePlay = (e: any, url: string) => {
  e.preventDefault();
  if (audioRef?.value?.paused) {
    audioRef.value.src = url;
    audioRef.value?.play();
  } else {
    audioRef.value?.pause();
  }
};

const handlePlayOver = (item: any) => {
  if (item?.file) {
    setTimeout(() => {
      item.file.isPlay = false;
    }, item.file.dur);
  } else {
    setTimeout(() => {
      item.isPlay = false;
    }, JSON.parse(item.text)?.dur);
  }
};

const {
  fetchData: translateFetch,
  data: translateData,
  success: translateSuccess,
  msg: translateMsg,
} = datatranslate();

const handleTranslate = async (item: any) => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await translateFetch({
    text: item.text,
  });
  if (translateSuccess.value) {
    showToast("Success");
    item.text = translateData.value.text;
  } else {
    showToast(translateMsg.value);
  }
};

const {
  fetchData: UnFollowFetch,
  msg: UnFollowMsg,
  success: UnFollowSuccess,
} = userunfollow();

const handleCancelFollow = async () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  await UnFollowFetch({
    toUserId: data.value.user.id,
  });
  if (UnFollowSuccess.value) {
    showToast("Success");
    getUserData();
  } else {
    showToast(UnFollowMsg.value);
  }
};

// 发送定位消息，只发送到本地，不发到服务器
const handleSendDistance = async () => {
  if (!configData.value?.hasPayment) {
    if (userDetail?.user?.vipLevel === 0) {
      state.showVipPopup = true;
    } else {
      // state.showRechargePopup = true;
      // state.showCallDownLoadPopup = true;
      state.showAppUserDownLoadPopup = true;
    }
    return;
  } else {
    state.showAppUserDownLoadPopup = true;
    return;
  }
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  // navigator.geolocation.getCurrentPosition(function (position) {
  // var latitude = position.coords.latitude;
  // var longitude = position.coords.longitude;
  let latitude = "";
  let longitude = "";
  await fetch(
    `https://www.googleapis.com/geolocation/v1/geolocate?key=${
      import.meta.env.VITE_APP_GOOGLE_MAP_KEY
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        considerIp: true,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Location Data:", data);
      latitude = data.location.lat;
      longitude = data.location.lng;
    })
    .catch((error) => console.error("Error:", error));

  nim.sendGeo({
    scene: "p2p",
    to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${data.value.user.id}`,
    isLocal: true,
    env: `${import.meta.env.VITE_APP_CHAOSONG_ENV}`,
    geo: {
      lng: longitude,
      lat: latitude,
      title: "distance",
    },
    done: () => {
      nim?.getLocalMsgs({
        scene: "p2p",
        limit: 500,
        // to: `${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${userId}`,
        sessionId: `p2p-${import.meta.env.VITE_APP_ACCOUNT_PREFIX}${
          data.value.user.id
        }`,
        done: (error: any, obj: any) => {
          if (error) {
          } else {
            getChatMsgList(obj.msgs || [], "发定位");
            closeToast();
          }
        },
      });
    },
  });
  // });
};

const { fetchData: localFetchData } = userlocation();

// 授权定位信息
const handleAllow = async () => {
  showLoadingToast({
    duration: 0,
    message: "Please wait...",
    forbidClick: true,
  });
  navigator.geolocation.getCurrentPosition(async function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    await localFetchData({
      latitude: latitude,
      longitude: longitude,
    });
    showToast("Success");
  });
};

const getDistance = (it: any) => {
  if (it?.geo) {
    const position = {
      lat: it.geo.lat,
      lng: it.geo.lng,
    };
    return position;
  } else {
    return JSON.parse(it.text).position;
  }
};

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `/public/contryIcon/icon_counties_rectangle_${item?.region.toLowerCase()}.png`,
    import.meta.url
  );
  return path || "";
};

const {
  fetchData: giftFetch,
  data: sendGiftData,
  success: giftSuccess,
  msg: giftMsg,
  code: giftCode,
} = giftsend();

const giftPopupRef = ref<any>();

const handleGive = async (item: any) => {
  if (!item?.id) {
    return;
  }
  await giftFetch({
    backpack: 0,
    toUserId: data.value.user.id,
    giftId: item.id,
    number: 1,
  });
  // debugger
  if (giftSuccess.value) {
    SvgaDialogRef.value.state.svgaUrl =
      sendGiftData?.value?.gift?.animateResource;
    // showToast("Success");
    SvgaDialogRef.value.state.showModal = true;
    // svgaUrl.value = item.icon;

    showGiftPopup.value = false;
    giftPopupRef.value.wollectFetch();
  } else {
    showToast(giftMsg.value);
    if (giftCode.value === 402) {
      const userDetails = getLocalUserDetail();
      if (userDetails?.user?.vipLevel === 0) {
        state.showVipPopup = true;
      } else {
        state.showAppUserDownLoadPopup = true;
      }
    }
  }
};

const handleSetCash = () => {
  // localStorage.setItem("currentChatRoomObj", "");
  localStorage.setItem("topNotification", "");
};
</script>
<style lang="scss" scoped>
.bigBox {
  padding-bottom: 100px;
}
.topLeftBox {
  display: flex;
  align-items: center;
  .hostImg {
    width: 64px;
    height: 64px;
    margin-left: 18px;
    margin-right: 12px;
  }
  .hostName {
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 32px;
    color: #554c5f;
  }
  .onlineBox {
    width: 104px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: #24e672;
    margin-left: 12px;
    .onlineYuan {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 4px;
    }
    .onlineYuanFont {
      font-family: "PingFang SC", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }
  }
  .offlineBox {
    width: 104px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: #898987;
    margin-left: 12px;
    .onlineYuan {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 4px;
    }
    .onlineYuanFont {
      font-family: "PingFang SC", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }
  }
  .busyBox {
    width: 104px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: #f3cc41;
    margin-left: 12px;
    .onlineYuan {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 4px;
    }
    .onlineYuanFont {
      font-family: "PingFang SC", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #ffffff;
    }
  }
}
.rightBtn {
  width: 116px;
  height: 48px;
  background: #eb6300;

  // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
  border-radius: 24px 24px 24px 24px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: bold;
  font-size: 28px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  margin-right: 20px;
}
.rightBtnUn {
  width: 150px;
  height: 48px;
  background: #eb6300;
  // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
  border-radius: 24px 24px 24px 24px;
  font-family: "SF Pro Display", sans-serif;
  font-weight: bold;
  font-size: 28px;
  color: #ffffff;
  text-align: center;
  line-height: 48px;
  margin-right: 20px;
}
.chatBox {
  background: rgba(0, 0, 0, 0.1);

  background-color: #ffffff;
  padding: 32px;
  min-height: 100vh;
  overflow-y: scroll;
  .hostBox {
    margin-top: 100px;
    padding: 32px;
    background-color: #f6f9fe;
    border-radius: 32px 32px 32px 32px;
    // margin-bottom: 32px;
    .hostBoxTop {
      display: flex;
      align-items: center;
      .hostImg {
        min-width: 80px;
        max-width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .hostBoxTopRight {
        .hostBoxTopRightFlex {
          display: flex;
          align-items: center;
          .yuan {
            min-width: 12px;
            max-width: 12px;
            height: 12px;
            background: #00ffa3;
            border-radius: 50%;
            margin-right: 4px;
          }
          .hostName {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #1a1a1a;
            margin-right: 4px;
          }
          .age {
            width: 32px;
            height: 32px;
            background: #fd5fab;
            margin-right: 4px;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 500;
            font-size: 20px;
            color: #ffffff;
            line-height: 32px;
            text-align: center;
            border-radius: 50%;
          }
        }
        .hostBoxTopRightFlexBottom {
          display: flex;
          align-items: center;
          .countryImg {
            min-width: 20px;
            max-width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          .country {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #1a1a1a;
          }
        }
      }
    }
    .contentBox {
      margin-top: 20px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #1a1a1a;
      line-height: 33px;
      margin-bottom: 20px;
    }
    .photoBox {
      display: flex;
      overflow-x: scroll;
      gap: 16px;
      .photoImg {
        min-width: 143px;
        max-width: 143px;
        height: 148px;
        border-radius: 12px 12px 12px 12px;
      }
    }
  }
  .chatMsgBox {
    margin-top: 32px;
    margin-bottom: 32px;
    .chatMsgTime {
      width: 100%;
      text-align: center;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 24px;
      color: #8c8c8c;
      margin-bottom: 32px;
    }
    .userLeftBox {
      display: flex;
      margin-bottom: 20px;

      .userLeftBoxImg {
        min-width: 80px;
        max-width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-right: 16px;
      }
      .audioBoxUserLeft {
        max-width: 494px;
        min-width: 120px;
        background: #f6f9fe;
        border-radius: 30px 30px 30px 30px;
        display: flex;
        align-items: center;
        padding-right: 20px;
        .audioNums {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #1a1a1a;
        }
        .cancelFont {
          margin-left: 5px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #ea1c00;
        }
        .callTime {
          margin-left: 5px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #1a1a1a;
        }
      }

      .userLeftBoxContent {
        position: relative;
        // min-width: 100px;
        max-width: 494px;
        // min-width: auto; /* 自动最小宽度 */
        // max-width: none; /* 不设置最大宽度 */
        background: #f6f9fe;
        border-radius: 30px 30px 30px 30px;
        padding: 24px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #112437;
        line-height: 40px;
        // margin-bottom: 32px;

        margin-bottom: 62px;
        .transBox {
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          position: absolute;
          bottom: -60px;
          width: 230px;
          left: -10px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 24px;
          color: #ffcaa3;
        }
      }
      .userLeftBoxContentDis {
        position: relative;
        // min-width: 100px;
        max-width: 494px;
        // min-width: auto; /* 自动最小宽度 */
        // max-width: none; /* 不设置最大宽度 */
        background: #f6f9fe;
        border-radius: 30px 30px 30px 30px;
        padding: 24px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #112437;
        line-height: 40px;
        .locationBox {
          color: grey;
          font-size: 24px;
          font-family: "Inter", sans-serif;
          font-weight: 400;
        }
        .mapFont {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #112437;
          line-height: 40px;
        }
        .allowBig {
          margin-top: 32px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .allowBtn {
            width: 228px;
            height: 57px;
            background: #eb6300;
            border-radius: 1200px 1200px 1200px 1200px;
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #ffffff;
            text-align: center;
            line-height: 57px;
          }
        }
      }
      .yuan {
        margin-top: 30px;
        width: 16px;
        height: 16px;
        background: #ea1c00;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
        margin-left: 16px;
      }
      .giftBox {
        display: flex;
        align-items: center;
        margin-bottom: 32px;
        padding: 24px;
        width: 360px;
        height: 148px;
        background: #ffd4d4;
        border-radius: 20px 20px 20px 20px;
        justify-content: space-between;
        .giftBoxLeft {
          margin-left: 8px;
          .giftBoxLeftTop {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            .giftBoxLeftTopFont {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 600;
              font-size: 32px;
              color: #1a1a1a;
              margin-right: 16px;
            }
            .giftBoxLeftTopFontNums {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 600;
              font-size: 28px;
              color: #e405ff;
            }
          }
          .giftBoxLeftBottom {
            display: flex;
            align-items: center;
            .giftBoxLeftBottomFont {
              font-family: "SF Pro Display", sans-serif;
              font-weight: bold;
              font-size: 20px;
              color: #ff4d42;
            }
          }
        }
        .giftBoxRightImg {
          margin-right: 8px;
          width: 100px;
          height: 100px;
        }
      }
      .sendImg {
        max-width: 200px;
        border-radius: 20px 20px 20px 20px;
      }
      .videoClass {
        width: 200px;
        height: 200px;
        border-radius: 20px 20px 20px 20px;
        object-fit: cover;
      }
      .audioClass {
        max-width: 494px;
        background: #ffffff;
        border-radius: 0px 32px 32px 32px;
        padding: 24px;
      }
    }
    .userRightBox {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
      align-items: center;

      .userRightBoxImg {
        min-width: 80px;
        max-width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-left: 16px;
      }
      .audioBoxUserRight {
        max-width: 494px;
        min-width: 120px;
        background: #eb6300;
        border-radius: 30px 30px 30px 30px;
        display: flex;
        align-items: center;
        padding: 10px;
        .audioNums {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #fff;
        }
        .cancelFont {
          margin-right: 5px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #fff;
        }
        .callTime {
          margin-right: 5px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #fff;
        }
      }
      .yuan {
        margin-top: 30px;
        width: 16px;
        height: 16px;
        background: #ea1c00;
        border-radius: 0px 0px 0px 0px;
        border-radius: 50%;
        margin-right: 16px;
      }
      .userRightBoxContent {
        max-width: 494px;
        padding: 24px;
        color: #fff;
        line-height: 33px;
        background: #eb6300;
        border-radius: 30px 30px 30px 30px;
        font-family: "Jost", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
        // margin-bottom: 32px;
      }
      .userRightBoxContentDis {
        max-width: 494px;
        padding: 24px;
        color: #fff;
        line-height: 33px;
        background: #eb6300;
        border-radius: 30px 30px 30px 30px;
        font-family: "Jost", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
        // margin-bottom: 32px;
      }
      .noSendSuccessImg {
        min-width: 40px;
        max-width: 40px;
        height: 40px;
        margin-right: 8px;
      }
      .giftBox {
        display: flex;
        align-items: center;
        margin-bottom: 32px;
        padding: 24px;
        width: 360px;
        height: 148px;
        background: #ffd4d4;
        border-radius: 20px 20px 20px 20px;
        justify-content: space-between;
        .giftBoxLeft {
          margin-left: 8px;
          .giftBoxLeftTop {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            .giftBoxLeftTopFont {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 600;
              font-size: 32px;
              color: #1a1a1a;
              margin-right: 16px;
            }
            .giftBoxLeftTopFontNums {
              font-family: "SF Pro Display", sans-serif;
              font-weight: 600;
              font-size: 28px;
              color: #e405ff;
            }
          }
          .giftBoxLeftBottom {
            display: flex;
            align-items: center;
            .giftBoxLeftBottomFont {
              font-family: "SF Pro Display", sans-serif;
              font-weight: bold;
              font-size: 20px;
              color: #ff4d42;
            }
          }
        }
        .giftBoxRightImg {
          margin-right: 8px;
          width: 100px;
          height: 100px;
        }
      }
      .sendImg {
        max-width: 200px;
        border-radius: 20px 20px 20px 20px;
      }
      .videoClass {
        width: 200px;
        height: 200px;
        border-radius: 20px 20px 20px 20px;
        object-fit: cover;
      }
      .audioClass {
        max-width: 494px;
        background: #ffffff;
        border-radius: 32px 32px 0px 32px;
        padding: 24px;
      }
    }
  }
}
.bottomBox {
  position: fixed;
  z-index: 20;
  bottom: 0px;
  background-color: #fff;
  padding-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;

  .bottomBoxTop {
    display: flex;
    align-items: center;
    height: 112px;
    margin-bottom: 16px;
    .ic_mic_44 {
      width: 88px;
      height: 88px;
      margin-left: 12px;
      margin-right: 6px;
    }
    .audioImg {
      width: 88px;
      height: 88px;
      margin-left: 12px;
      margin-right: 6px;
    }
    .audioBox {
      // width: 418px;
      width: 100%;
      height: 80px;
      background: #eb6300;
      // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 44px 44px 44px 44px;
      font-family: "SF Pro Text", sans-serif;
      font-weight: bold;
      font-size: 28px;
      color: #ffffff;
      line-height: 80px;
      text-align: center;
    }
    .bottomInput {
      width: 100%;
      height: 88px;
      background: #f8f8f8;
      border-radius: 44px 44px 44px 44px;
      padding-left: 24px;
      line-height: 88px;
      font-family: "SF Pro Text", sans-serif;
      font-weight: 400;
      font-size: 28px;
    }
    .bottomInput::placeholder {
      font-family: "SF Pro Text", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #cccccc;
    }
    .sendImg {
      width: 80px;
      height: 80px;
      margin-left: 12px;
    }
  }
  .bottomBoxBottom {
    display: flex;
    height: 112px;
    align-items: center;
    justify-content: space-around;
    .bottomImgPos {
      position: relative;

      .uploadClass {
        position: absolute;
        opacity: 0;
        left: 0px;
        top: 0px;
        max-width: 80px;
        height: 80px;
        z-index: 1;
      }
    }
    .toolsImg {
      z-index: 2;
      width: 80px;
      height: 80px;
    }
    .disImg {
      width: 45px;
      height: 45px;
      z-index: 2;
    }
  }
}
.redBig {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.redBox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  bottom: 320px;

  .redSource {
    width: 160px;
    height: 160px;
    // position: absolute;
  }
  .redText {
    margin-top: 30px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 32px;
    color: #ffffff;
  }
}
.whiteBox {
  width: 416px;
  height: 160px;
  background: #fff;
  border-radius: 24px 24px 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  .whiteSource {
    width: 256px;
    height: 48px;
  }
}
</style>
