<template>
  <div class="bigBox">
    <div class="title">Match</div>
    <div class="kongBox">
      <img src="./assets/Group 1000004710@2x.png" class="bigImg" />
      <div class="posBox">
        <SvgaShow
          :divId="'demoase'"
          :width="350"
          :height="350"
          :url="'https://fs.duome.live/app/match/match.svga'"
        ></SvgaShow>
      </div>
    </div>

    <div class="matchBig">
      <div class="matchBigLeft" @click="handleMatch(1)">
        <div class="matchBigLeftTop">Random</div>
        <div class="matchBigLeftBottom">
          <div class="matchBigLeftBottomOne">
            {{
              userDetail?.user?.vipLevel > 0
                ? matchPriceData.randomMatchVipPrice
                : matchPriceData.randomMatchPrice
            }}
          </div>
          <img src="./assets/coin_20@2x.png" class="matchBigLeftBottomTwo" />
          <div class="matchBigLeftBottomThree">/match</div>
        </div>
        <div class="posBox" v-if="matchPriceData.freeCouponCount > 0">
          <div class="posBoxOne">
            Free
            <div class="posBoxOneImgBox">
              {{ matchPriceData.freeCouponCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="matchBigRight" @click="handleMatch(3)">
        <div class="matchBigLeftTop">
          <img class="matchBigLeftTopOne" src="./assets/Vector@2x.png" />
          <div class="matchBigLeftTopTwo">Goddess</div>
        </div>
        <div class="matchBigLeftBottom">
          <div class="matchBigLeftBottomOne">
            {{
              userDetail?.user?.vipLevel > 0
                ? matchPriceData.goddessMatchVipPrice
                : matchPriceData.goddessMatchPrice
            }}
          </div>
          <img src="./assets/coin_20@2x.png" class="matchBigLeftBottomTwo" />
          <div class="matchBigLeftBottomThree">/match</div>
        </div>
      </div>
    </div>
    <div class="bottomFixedBox" v-if="state.showBottomFixedBox">
      <div class="bottomFixedBoxBtn" @click="handleStop">Stop match</div>
    </div>
  </div>
  <audio style="display: none" controls loop ref="audioMatchRef">
    <source src="./assets/match.mp3" />
  </audio>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  <!-- <FirstVipPromptPopup
    :video-url="configData.firstVipPromptVideo"
    v-model="state.showFirstVipPromptPopup"
  >
  </FirstVipPromptPopup> -->
  <Tabbar></Tabbar>
</template>

<script setup lang="ts" name="MatchHome">
import { ref, reactive, onMounted, nextTick, onActivated } from "vue";
import Tabbar from "@/components/Tabbar/index.vue";
import { useRoute } from "vue-router";
import {
  matchprice,
  matchstart,
  matchstop,
  vipconfig,
  userconfig,
} from "@/api/allApi";
import { showToast } from "vant";
import evenBus from "@/common/evenBus";
import { useUserDetailStore } from "@/stores/userDetail";
import RechargePopup from "@/components/rechargePopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";
import SvgaShow from "@/components/svgaShow/index.vue";
// import FirstVipPromptPopup from "@/components/firstVipPromptPopup/index.vue";

const route = useRoute();

const state = reactive({
  showBottomFixedBox: false,
  showRechargePopup: false,
  showVipPopup: false,
  showFirstVipPromptPopup: false,
});

const { vipConfigData } = useVipConfigStore();

const audioMatchRef: any = ref(null);

const { userDetail }: any = useUserDetailStore();

const { fetchData: fetchMatchPrice, data: matchPriceData } = matchprice();

const { fetchData: configFetch, data: configData } = userconfig();

const {
  fetchData: fetchMatchStart,
  success: matchStartSuccess,
  msg: matchStartMsg,
  code,
} = matchstart();
const {
  fetchData: fetchMatchStop,
  success: matchStopSuccess,
  msg: matchStopMsg,
} = matchstop();

onMounted(() => {
  nextTick(() => {
    // if (route.name === "MatchHome") {
    // document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    // }
  });
});

onActivated(() => {
  getPrice();
  window.scrollTo({ top: 0, behavior: "instant" });

  // document.body.style.overflow = "hidden";
});

const getPrice = async () => {
  await fetchMatchPrice();
};

const handleMatch = async (type: number) => {
  // await configFetch();
  await fetchMatchStart({
    type,
  });
  if (matchStartSuccess.value) {
    audioMatchRef.value.play();
    state.showBottomFixedBox = true;
  } else {
    if (code.value !== 402) {
      handleMatch(type);
    } else {
      state.showBottomFixedBox = false;
      showToast(matchStartMsg.value);

      if (userDetail?.user?.vipLevel === 0) {
        state.showVipPopup = true;
      } else {
        state.showRechargePopup = true;
      }
      if (configData?.value?.showFirstVipPrompt) {
        state.showFirstVipPromptPopup = true;
      }

      audioMatchRef.value.pause();
    }
  }
};

evenBus.on("matchDone", () => {
  state.showBottomFixedBox = false;
  audioMatchRef.value.pause();
  getPrice();
});

const handleStop = async () => {
  await fetchMatchStop();
  if (matchStopSuccess.value) {
    state.showBottomFixedBox = false;
    audioMatchRef.value.pause();
  } else {
    showToast(matchStopMsg.value);
  }
};
</script>
<style lang="scss" scoped>
body {
  background: linear-gradient(180deg, #29191a 0%, #481816 100%);
}
.bigBox {
  width: 100%;
  height: 100%;
  // max-height: 100vh;
  // height: 100vh;
  background: linear-gradient(180deg, #29191a 0%, #481816 100%);
  border-radius: 0px 0px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  .title {
    font-family: "Inter", sans-serif;
    position: absolute;
    top: 40px;
    left: 40px;
    font-weight: normal;
    font-size: 44px;
    color: #eb6300;
  }
  .kongBox {
    width: 100%;
    background: linear-gradient(180deg, #29191a 0%, #481816 100%);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    .bigImg {
      margin-left: 26px;
      margin-right: 26px;
      height: 696px;
    }
    .posBox {
      position: absolute;
      top: 550px;
    }
  }

  .matchBig {
    width: 100%;
    position: fixed;
    bottom: 150px;
    z-index: 10;
    padding-left: 40px;
    padding-right: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .matchBigLeft {
      width: 320px;
      height: 100px;
      background: #fe5e82;
      border-radius: 120px 120px 120px 120px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .matchBigLeftTop {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 24px;
        color: #4adeff;
        margin-bottom: 4px;
      }
      .matchBigLeftBottom {
        display: flex;
        align-items: center;
        .matchBigLeftBottomOne {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #4adeff;
        }
        .matchBigLeftBottomTwo {
          width: 30px;
          height: 30px;
        }
        .matchBigLeftBottomThree {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #fff;
        }
      }
      .posBox {
        position: absolute;
        top: -85px;
        background-image: url("./assets/Group 7636@2x.png");
        background-repeat: no-repeat;
        width: 226px;
        height: 100px;
        background-size: 100% 100%;
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
    .matchBigRight {
      width: 320px;
      height: 100px;
      background: #fe5e82;
      border-radius: 120px 120px 120px 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .matchBigLeftTop {
        display: flex;
        align-items: center;
        .matchBigLeftTopOne {
          width: 27px;
          height: 29px;
          margin-right: 4px;
        }
        .matchBigLeftTopTwo {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #fffa88;
        }
      }
      .matchBigLeftBottom {
        display: flex;
        align-items: center;
        .matchBigLeftBottomOne {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #4adeff;
        }
        .matchBigLeftBottomTwo {
          width: 30px;
          height: 30px;
        }
        .matchBigLeftBottomThree {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #fff;
        }
      }
    }
  }
  .bottomFixedBox {
    width: 100%;
    z-index: 21;
    height: 260px;
    background: #85001b;
    border-radius: 40px 40px 0px 0px;
    position: fixed;
    // bottom: 95px;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 36px;
    padding-right: 36px;
    .bottomFixedBoxBtn {
      width: 100%;
      height: 100px;
      background: #eb6300;
      border-radius: 20px 20px 20px 20px;
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 32px;
      color: #fefefe;
      line-height: 100px;
      text-align: center;
    }
  }
}
</style>
