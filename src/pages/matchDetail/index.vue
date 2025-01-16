<template>
  <div class="bigBox">
    <van-nav-bar
      style="background-color: #2c1a1a; color: #fff"
      :title="data?.nickname || ''"
      left-text=""
      fixed
      :border="false"
    >
      <template #left>
        <div class="topLeftBox">
          <van-icon
            name="arrow-left"
            size="18"
            color="#fff"
            @click="router.go(-1)"
          />
        </div>
      </template>
      <template #right>
        <img
          @click="
            () => {
              router.push({
                name: 'BlockAndReport',
                query: {
                  type: 'Report',
                  id: data?.id,
                },
              });
            }
          "
          src="./assets/jubao.webp"
          class="jubaoImg"
        />
      </template>
    </van-nav-bar>
    <div class="titleBox" v-html="data?.intro"></div>
    <div class="matchScan">
      <video
        :id="`videoElement`"
        class="videoPlayer"
        src=""
        autoplay
        muted
        :controls="false"
        loop
      ></video>
      <div id="localvideo" class="mineVideo"></div>
    </div>
    <div class="rulesFont" v-if="!state.hostStar && !state.userStar">
      Click like to match her
    </div>
    <div class="rulesFont" v-if="state.hostStar && !state.userStar">
      She liked you! Tap the heart to Like her back!
    </div>

    <div class="rulesFont2" v-if="!state.isNext">
      Your dream girl will be hidden in 10 seconds. Don’t miss her
    </div>
    <div class="xingxingBox">
      <img
        @click="handleZan"
        class="xingxingImg1"
        v-if="!state.hostStar && !state.userStar"
        src="./assets/Union@2x.webp"
      />
      <img
        @click="handleZan"
        v-else-if="state.hostStar && !state.userStar"
        class="xingxingImg1"
        src="./assets/zuoxing.png"
      />
      <img
        @click="handleZan"
        v-else-if="!state.hostStar && state.userStar"
        class="xingxingImg1"
        src="./assets/youxing.png"
      />
      <img
        v-else-if="state.hostStar && state.userStar"
        class="xingxingImg1"
        src="./assets/wanzhengxing.png"
      />
    </div>
    <div class="bottomLineBox">
      <div class="line">
        <div class="leftLine" :style="leftProgressStyle"></div>
        <div class="rightLine" :style="rightProgressStyle"></div>
      </div>
      <!-- <div class="progress-container">
        <div
          class="progressbar"
          :style="{
            backgroundColor: `linear-gradient(to center, ${leftColor} ${leftProgress}%, ${rightColor} ${rightProgress}%)`,
          }"
        ></div>
      </div> -->
    </div>
    <div class="nextBox">
      <div class="nextFont" @click="handleNext()">Next</div>
    </div>
    <QuickPopup
      @handleOpen="
        () => {
          state.showVipPopup = true;
        }
      "
      @handleClose="handleNext"
      v-model="state.showQuickPopup"
      :imgUrl="data?.avatar || ''"
    ></QuickPopup>
    <VipPopup
      :showVideo="false"
      @handleClose="
        () => {
          state.showQuickPopup = true;
        }
      "
      :vipConfg="vipConfigData"
      v-model="state.showVipPopup"
    ></VipPopup>
    <CutDownDialog v-model="state.shwoCutDownDialog"></CutDownDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useZego } from "@/hook/useZego";
import { useRouter } from "vue-router";
import QuickPopup from "@/components/quickPopup/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import { matchbeforePaymentstart } from "@/api/allApi";
import CutDownDialog from "@/components/cutDownDialog/index.vue";
import { handleGo } from "@/common/fetchCommon";
import { getLocalUserDetail } from "@/common/utils";

const { vipConfigData } = useVipConfigStore();

const localStream = ref<any>(null);

const router = useRouter();

const { zg } = useZego();

const state = reactive({
  showQuickPopup: false,
  showVipPopup: false,
  shwoCutDownDialog: false,
  isNext: false,
  hostStar: false,
  userStar: false,
});

const leftProgress = ref(0); // 左边颜色进度
const rightProgress = ref(0); // 右边颜色进度

const leftProgressStyle = ref();
const rightProgressStyle = ref();

onMounted(async () => {
  localStorage.setItem("isMatch", "true");
  await scheduler.yield();
  await nextTick();
  handleMatch();
  nextTick(async () => {
    try {
      localStream.value = await zg.createZegoStream();
    } catch (e) {
      console.log(`output->`, localStream);
    }
    localStream.value?.playVideo?.(document.querySelector("#localvideo"));
  });
});

onUnmounted(() => {
  localStorage.setItem("isMatch", "false");

  matchTimeouts.forEach((timeoutId: any) => clearTimeout(timeoutId));
  matchTimeouts = [];
  clearInterval(progressTimer.value);
});

const { fetchData, success, data, code, msg } = matchbeforePaymentstart();

let matchTimeouts: any = []; // 存储定时器 ID

const progressTimer = ref<any>(null);

const handleMatch = async () => {
  let currentWidth = 0; // 初始宽度为 0%
  const targetWidth = 50; // 目标宽度为 50%
  const duration = 10; // 持续时间 10 秒
  const interval = 1000; // 每次更新间隔 1 秒
  const increment = targetWidth / duration; // 每秒增加的宽度

  progressTimer.value = setInterval(() => {
    currentWidth += increment;
    if (currentWidth >= targetWidth) {
      currentWidth = targetWidth; // 确保不超过目标宽度
      clearInterval(progressTimer.value); // 停止定时器
    }

    leftProgressStyle.value = {
      width: `${currentWidth}%`,
      background: "#f2ac6e",
    };

    rightProgressStyle.value = {
      width: `${currentWidth}%`,
      background: "#f2ac6e",
    };
  }, interval);

  state.hostStar = false;
  state.userStar = false;

  // 清除之前的定时器
  matchTimeouts.forEach((timeoutId: any) => clearTimeout(timeoutId));
  matchTimeouts = []; // 清空定时器列表

  await fetchData();
  if (success.value) {
    const randomTime = Math.floor(Math.random() * 5000) + 1000; // 1000ms 到 5000ms

    // 设置定时器，并保存定时器 ID
    const timeout1 = setTimeout(() => {
      state.hostStar = true;
    }, randomTime);
    matchTimeouts.push(timeout1);

    const timeout2 = setTimeout(() => {
      state.isNext = true;
      handleMatch();
    }, 10000);
    matchTimeouts.push(timeout2);

    const video: any = document.getElementById("videoElement");
    const mediaUrl = data.value?.url;

    if (mediaUrl.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else {
      video.src = mediaUrl; // 如果是 MP4 或 MP3 文件，直接赋值播放
      video.play();
    }
  } else {
    if (code.value === 4010) {
      // state.shwoCutDownDialog = true;
      router.go(-1);
    }
  }
};

const handleNext = () => {
  // 清除所有之前的定时器
  matchTimeouts.forEach((timeoutId: any) => clearTimeout(timeoutId));
  matchTimeouts = []; // 清空定时器列表
  clearInterval(progressTimer.value);
  state.isNext = true;
  handleMatch();
};

const handleZan = () => {
  state.userStar = true;
};
const userInfo = getLocalUserDetail();

watch(
  () => [state.userStar, state.hostStar],
  async () => {
    if (state.userStar && state.hostStar) {
      matchTimeouts.forEach((timeoutId: any) => clearTimeout(timeoutId));
      matchTimeouts = []; // 清空定时器列表
      handleGo({
        user: {
          inCall: 0,
          active: 1,
          id: data.value?.userId,
        },
      }).then((res) => {
        if (!res) {
          if (userInfo?.user?.vipLevel === 0) {
            state.showVipPopup = true;
          }
        }
      });
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="scss" scoped>
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
.bigBox {
  .jubaoImg {
    width: 48px;
    height: 48px;
  }
  padding-top: 150px;
  .titleBox {
    padding-left: 36px;
    padding-right: 36px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 36px;
    color: #ffffff;
    margin-bottom: 30px;
  }
  .matchScan {
    display: flex;
    align-items: center;
    position: relative;
    .videoPlayer {
      height: 482px;
      width: 50%;
      object-fit: cover;
    }
    .mineVideo {
      height: 482px;
      width: 50%;
      transform: scaleX(-1);
    }
  }
  .rulesFont {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 48px;
    color: #ffffff;
    text-align: center;
    margin-top: 50px;
  }
  .xingxingBox {
    margin-top: 50px;
    // position: absolute;
    width: 100%;
    // bottom: -50px;
    display: flex;
    align-items: center;
    justify-content: center;
    .xingxingImg1 {
      width: 224px;
      height: 184px;
    }
  }
  .rulesFont2 {
    padding-left: 82px;
    padding-right: 76px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 36px;
    color: #ffffff;
    text-align: center;
    margin-top: 30px;
  }
  .bottomLineBox {
    position: fixed;
    bottom: 126px;
    padding-left: 32px;
    padding-right: 32px;
    width: 100%;

    .line {
      width: 100%;
      height: 8px;
      border-radius: 12px 12px 12px 12px;
      background: #ddd; /* 背景灰色 */
      display: flex;
      justify-content: space-between;
      transition: all 0.1s linear; /* 平滑过渡 */
    }
  }
  .nextBox {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 28px;
    width: 100%;
    .nextFont {
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 48px;
      color: #ffffff;
    }
  }
}
</style>
