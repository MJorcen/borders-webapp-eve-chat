<template>
  <div class="bigBox">
    <div class="titleBig">
      <div class="title">Match</div>
    </div>
    <div v-if="beforeConfigData?.remainingTimes !== 0">
      <div class="matchTop">
        <img class="matchLeftImg" src="./assets/Group427320734@2x.webp" />
        <div class="matchCenter">
          <img class="matchCenterTop" src="./assets/image738@2x.webp" />
          <img class="matchCenterBottom" src="./assets/maibo.webp" />
        </div>
        <img src="./assets/Group427320739@2x.webp" class="matchRightImg" />
      </div>
      <div class="matchScan">
        <van-swipe
          class="myswipe"
          :autoplay="3000"
          vertical
          :show-indicators="false"
        >
          <van-swipe-item
            v-for="(item, index) in beforeAnchors?.list"
            :key="index"
          >
            <van-image
              fit="cover"
              :src="item?.portrait"
              class="matchLeftImg"
              lazy-load
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <!-- <img class="matchLeftImg" src="./assets/Group427320734@2x.webp" /> -->
          </van-swipe-item>
        </van-swipe>
        <div id="localvideos" class="mineVideo"></div>
      </div>
      <div class="font">3000+ Girls are currently matching....</div>
      <div class="buttonBox">
        <div
          class="button"
          v-if="beforeConfigData?.remainingTimes !== 0"
          @click="router.push('/matchDetail')"
        >
          Start
        </div>
      </div>
    </div>
    <div v-else>
      <img class="bgImg" src="./assets/bg.webp" />
      <div class="contentBoxBig">
        <div class="contentBox">
          <van-count-down :time="state.time">
            <template #default="timeData">
              <div class="contentBoxTop">
                <div class="cutDownBgImg">{{ timeData.hours }}</div>
                <div class="cutDownFont">H</div>
                <div class="cutDownBgImg">{{ timeData.minutes }}</div>
                <div class="cutDownFont">M</div>
                <div class="cutDownBgImg">{{ timeData.seconds }}</div>
                <div class="cutDownFont">S</div>
              </div>
            </template>
          </van-count-down>
          <div class="cutDownText">
            You cannot match any more users today. your free quota will be reset
            when the countdown timer has end .
          </div>
          <div class="cutDownText">VIP members can match unlimited times</div>
          <div class="btnBox">
            <div
              class="btn"
              @click="
                () => {
                  state.showVipPopup = true;
                }
              "
            >
              Get Vip
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <CutDownDialog v-model="state.shwoCutDownDialog"></CutDownDialog> -->
  </div>
  <VipPopup
    :show-video="false"
    :vipConfg="vipConfigData"
    v-model="state.showVipPopup"
  ></VipPopup>
  <Tabbar></Tabbar>
</template>

<script setup lang="ts" name="MatchNew">
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onActivated,
  onDeactivated,
  computed,
} from "vue";
import { useZego } from "@/hook/useZego";
import { useRouter } from "vue-router";
import Tabbar from "@/components/Tabbar/index.vue";
import CutDownDialog from "@/components/cutDownDialog/index.vue";
import {
  matchbeforePaymentconfig,
  matchbeforePaymentlistAnchors,
} from "@/api/allApi";
import { showToast } from "vant";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";

const { vipConfigData } = useVipConfigStore();

const localStream = ref<any>(null);

const router = useRouter();

const { zg } = useZego();

const state = reactive<any>({
  shwoCutDownDialog: false,
  showVipPopup: false,
  time: "",
});

const { fetchData: fetchMatchbeforePaymentlistAnchors, data: beforeAnchors } =
  matchbeforePaymentlistAnchors();

const { fetchData: beforeConfigFetch, data: beforeConfigData } =
  matchbeforePaymentconfig();

onMounted(async () => {
  await beforeConfigFetch();

  showToast(
    `You get ${beforeConfigData.value?.limitTimes} free matching card!`
  );
});

const getRemainingMilliseconds = () => {
  // 获取当前时间
  const now: any = new Date();

  // 创建下一天零点的时间
  const nextDay: any = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 日期加1，表示下一天
    0,
    0,
    0,
    0 // 设置时间为零点
  );

  // 计算剩余时间（毫秒）
  const remainingMilliseconds = nextDay - now;

  return remainingMilliseconds;
};

onActivated(async () => {
  await beforeConfigFetch();
  state.time = getRemainingMilliseconds();
  await fetchMatchbeforePaymentlistAnchors();
  if (beforeConfigData.value?.remainingTimes === 0) {
    state.shwoCutDownDialog = true;
  }
  nextTick(async () => {
    try {
      localStream.value = await zg.createZegoStream();
      const videoElement = document.querySelector("#localvideos");
      // 清空旧的视频流绑定
      if (videoElement) {
        videoElement.innerHTML = ""; // 清除容器中的旧内容
        localStream.value.playVideo?.(videoElement); // 将新流绑定到该元素
      }
    } catch (e) {}
  });
});

onDeactivated(async () => {
  localStream.value = null;
});
</script>
<style lang="scss" scoped>
.bigBox {
  width: 100%;
  height: 100%;
  position: relative;
  .titleBig {
    padding-top: 100px;
    .title {
      font-family: "Inter", sans-serif;
      display: flex;
      align-items: center;
      padding-left: 32px;
      font-weight: normal;
      font-size: 44px;
      color: #eb6300;
      height: 120px;
      border-bottom: 1px solid #575050;
      z-index: 12;
      top: 0;
      position: absolute;
      background-color: #241213;
      width: 100%;
    }
  }

  .matchTop {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-top: 26px;
    margin-bottom: 32px;
    .matchLeftImg {
      width: 160px;
      height: 160px;
      margin-right: 56px;
    }
    .matchCenter {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .matchCenterTop {
        width: 118px;
        height: 118px;
      }
      .matchCenterBottom {
        width: 126px;
        height: 126px;
      }
    }
    .matchRightImg {
      width: 160px;
      height: 160px;
      margin-left: 56px;
    }
  }
  .matchScan {
    display: flex;
    align-items: center;
    .myswipe {
      height: 482px;
      width: 50%;
    }
    .mineVideo {
      height: 482px;
      width: 50%;
      transform: scaleX(-1);
    }
  }
  .font {
    display: flex;
    align-items: center;
    text-align: center;
    margin-top: 20px;
    padding-left: 94px;
    padding-right: 86px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 48px;
    color: #ffffff;
  }
  .buttonBox {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .button {
      width: 380px;
      height: 112px;
      background-color: #e88650;
      display: flex;
      align-items: center;
      line-height: 112px;
      text-align: center;
      border: 2px solid #ffffff;
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 48px;
      color: #ffffff;
      text-align: center;
      justify-content: center;
      border-radius: 64px;
    }
  }
  .bgImg {
    width: 100%;
    height: auto;
    margin-top: -200px;
  }
  .contentBoxBig {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    margin-top: -300px;
    z-index: 2;
    position: absolute;
    // position: fixed;
    // bottom: 60px;
    .contentBox {
      height: 700px;
      overflow-y: scroll;
      //   height: 970px;
      background: #fff9e4;
      border-radius: 40px 40px 40px 40px;
      border: 10px solid #ffdfc6;
      padding: 44px 16px 104px 16px;
      .contentBoxTop {
        display: flex;
        align-items: center;
        justify-content: center;
        .cutDownBgImg {
          width: 82px;
          height: 82px;
          background-image: url(./assets/Rectangle34625197@2x.webp);
          background-size: 100% 100%;
          // background-size: cover;
          background-repeat: no-repeat;
          margin-right: 22px;
          display: flex;
          align-items: center;
          justify-content: center;

          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 40px;
          color: #ffffff;
        }
        .cutDownFont {
          margin-right: 22px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 30px;
          color: #bc4700;
        }
      }
      .cutDownText {
        margin-top: 64px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 30px;
        color: #333333;
        text-align: center;
      }
      .btnBox {
        display: flex;
        align-items: center;
        justify-items: center;
        width: 100%;
        padding-left: 44px;
        padding-right: 44px;

        .btn {
          margin-top: 20px;
          margin-bottom: 30px;
          width: 100%;
          height: 100px;
          background: #ea8a55;
          border-radius: 64px;
          font-family: "Inter", sans-serif;
          font-weight: normal;
          font-size: 40px;
          color: #fefefe;
          line-height: 100px;
          text-align: center;
        }
      }
    }
  }
}
</style>
