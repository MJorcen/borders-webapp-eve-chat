<template>
  <van-popup
    @click-overlay="emit('update:modelValue', false)"
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="20"
  >
    <div class="popupBox">
      <video
        class="videoPlayer"
        :src="props.videoUrl"
        autoplay
        muted
        :controls="false"
        loop
      ></video>
      <div class="mengceng"></div>
      <div class="closeBox" @click="emit('update:modelValue', false)">
        <van-icon name="close" size="36" color="#ffffff" />
      </div>
      <div class="topTitleBox">
        Video Call
        <span style="color: #ff0000; margin-left: 5px; margin-right: 5px"
          >15%</span
        >
        OFF
      </div>
      <div class="secondTitleBox">
        <img src="./assets/image926@2x.webp" class="vipIcon" />
        <div class="vipFont">VIP</div>
        <div class="moneyBox">
          {{ state.list[1]?.channelList?.[0]?.price?.money }}/month
        </div>
      </div>
      <div class="bottomBox1">
        <img class="gou" src="./assets/Group427320792@2x.webp" />
        Get {{ vipConfigData.monthlyGoldBonus }} coins every month
      </div>
      <div class="bottomBox2">
        <img class="gou" src="./assets/Group427320792@2x.webp" />
        Vip exclusive sign in,worth total of
        {{ vipConfigData.monthlyCheckInGoldValue }} coins
      </div>
      <div class="bottomBox3">
        <img class="gou" src="./assets/Group427320792@2x.webp" />
        Unlimited free text message
      </div>
      <div class="bottomBox4">
        <img class="gou" src="./assets/Group427320792@2x.webp" />
        Recharge 15% OFF
      </div>
      <div
        class="btn"
        @click="
          () => {
            state.showLink = false;
            state.showPopup = true;
            state.channelData = state.channelData.map((item) => {
              item.selected = false;
              return item;
            });
          }
        "
      >
        Continue
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="state.showPopup" position="bottom" round>
    <div class="popupBoxTwo">
      <div class="popupBoxTop">VIP 1 month</div>
      <div class="itemBig">
        <div
          class="itemBox"
          @click="handleSelect(item)"
          v-for="(item, index) in state.channelData"
          :key="index"
        >
          <div class="itemBoxLeft">
            <img
              src="./assets/ic_select@2x.png"
              v-if="item.selected"
              class="choseBoxImg"
            />
            <img
              src="./assets/ic_select@2x (1).png"
              v-else
              class="choseBoxImg"
            />
            <img :src="item.channel.icon" class="activeSelectImg" alt="" />
            <div class="activeSelectText">{{ item.channel.displayName }}</div>
            <div class="activeSelectText">
              {{ item.channel.discountText }}
            </div>
          </div>
          <div class="itemBoxRight">
            {{ item.price.symbol }}{{ item.price.money }}
          </div>
        </div>
      </div>
      <div class="btnBig" v-if="state.showLink">
        <a :href="state.payUrl" target="_blank" rel="noopener noreferrer">
          <div class="btnBox2">Submit</div>
        </a>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { closeToast, showLoadingToast, showToast } from "vant";
import { ref, reactive, watch } from "vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import { vipMultipriceList, vipMultisubmit } from "@/api/allApi";

const emit = defineEmits(["update:modelValue", "handleOpen"]);

const { vipConfigData }: any = useVipConfigStore();

interface Prop {
  modelValue: boolean;
  videoUrl: string;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  videoUrl:
    "http://fs.duome.live/alpha/img/240522/7730710ae1904a4e338b2fff5acfb9cd.mp4",
});

const { fetchData, data } = vipMultipriceList();

const state = reactive<any>({
  showVipPopup: false,
  showPopup: false,
  payData: {},
  channelData: [],
  list: [],
  showLink: false,
  payUrl: "",
});

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
      await fetchData();
      state.list = data.value.list;
      state.payData = state.list[1];
      state.channelData = state.list[1].channelList;
    }
  },
  { immediate: true }
);

const {
  fetchData: buyFetchedData,
  success: buySuccess,
  msg: buyMsg,
  data: buyData,
} = vipMultisubmit();

const handleSelect = async (item: any) => {
  state.channelData = state.channelData.map((i: any) => {
    if (item.channel.id === i.channel.id) {
      i.selected = true;
    } else {
      i.selected = false;
    }
    return i;
  });
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await buyFetchedData({
    priceId: state.payData.id,
    channelId: item.channel.id,
    deeplink: false,
  });
  if (buySuccess.value) {
    state.payUrl = buyData.value.data.payInfo;

    state.showLink = true;
    closeToast();
  } else {
    showToast(buyMsg.value);
  }
};
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  width: 594px;
  height: 886px;
  border-radius: 20px 20px 20px 20px;
  position: relative;
  background-color: #e3d1e6;
  .videoPlayer {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 100%;
    height: 684px;
    object-fit: cover;
  }
  .mengceng {
    width: 100%;
    height: 694px;
    border-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    background: rgba(109, 39, 122, 0.5);
    backdrop-filter: blur(10px); /* 模糊效果，数值越大模糊程度越高 */
    -webkit-backdrop-filter: blur(10px); /* 对于Safari的支持 */
  }
  .closeBox {
    // width: 76px;
    // height: 76px;
    // border-radius: 0px 0px 0px 0px;
    // border: 2px solid #c7c4cc;
    // border-radius: 50%;
    position: absolute;
    top: 18px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .topTitleBox {
    position: absolute;
    top: 100px;
    left: 0;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #eb6300;
    width: 300px;
    height: 90px;
    background: rgba(235, 241, 252, 0.8);
    border-radius: 0px 100px 100px 0px;
    display: flex;
    align-items: center;
    padding-left: 18px;
    z-index: 3;
  }
  .secondTitleBox {
    z-index: 3;
    position: absolute;
    top: 380px;
    right: 36px;
    display: flex;
    align-items: center;
    .vipIcon {
      width: 110px;
      height: 98px;
    }
    .vipFont {
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 30px;
      color: #ffffff;
      // margin-right: 20px;
    }
    .moneyBox {
      display: flex;
      align-items: center;
      justify-content: center;
      //   width: 180px;
      padding: 20px;
      height: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px 20px 20px 20px;
      border: 2px solid rgba(235, 99, 0, 0.9);
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 30px;
      color: #eb6300;
    }
  }
  .bottomBox1 {
    z-index: 3;

    position: absolute;
    top: 500px;
    left: 122px;
    display: flex;
    // align-items: center;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    .gou {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      margin-top: 12px;
    }
  }
  .bottomBox2 {
    z-index: 3;

    position: absolute;
    top: 540px;
    left: 122px;
    display: flex;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    line-height: 30px;
    width: 402px;
    .gou {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      margin-top: 12px;
    }
  }
  .bottomBox3 {
    z-index: 3;

    position: absolute;
    top: 600px;
    left: 122px;
    display: flex;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    width: 402px;
    .gou {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      margin-top: 12px;
    }
  }
  .bottomBox4 {
    z-index: 3;

    position: absolute;
    top: 640px;
    left: 122px;
    display: flex;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    width: 402px;
    .gou {
      width: 16px;
      height: 16px;
      margin-right: 10px;
      margin-top: 12px;
    }
  }
  .btn {
    position: absolute;
    bottom: 50px;
    left: 48px;
    width: 500px;
    height: 100px;
    background: #eb6300;
    border-radius: 20px 20px 20px 20px;
    font-family: "Inter", sans-serif;
    font-weight: normal;
    font-size: 40px;
    color: #fefefe;
    line-height: 100px;
    text-align: center;
  }
}
.popupBoxTwo {
  height: 928px;
  border-radius: 16px 16px 0px 0px;
  background-color: #f2f2f2;
  padding-top: 20px;
  .popupBoxTop {
    display: flex;
    align-items: center;
    padding-left: 32px;
    margin-bottom: 20px;
    .rightImg {
      width: 48px;
      height: 48px;
    }
    .myWalletFont {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #1a1a1a;
    }
  }
  .itemBig {
    padding-left: 32px;
    padding-right: 32px;
    background-color: #f2f2f2;
    padding-bottom: 150px;

    .itemBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 140px;
      background: #ffffff;
      border-radius: 24px 24px 24px 24px;
      padding-left: 32px;
      padding-right: 32px;
      margin-bottom: 20px;
      .itemBoxLeft {
        display: flex;
        align-items: center;
        .choseBoxImg {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        .activeSelectImg {
          min-width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        .activeSelectText {
          margin-right: 8px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #1a1a1a;
        }
      }
      .itemBoxRight {
        // width: 160px;
        // height: 64px;
        padding: 7px;
        background: #eb6300;
        // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
        border-radius: 40px 40px 40px 40px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #ffffff;
        line-height: 64px;
        text-align: center;
      }
    }
  }
  .btnBig {
    position: fixed;
    width: 100%;
    bottom: 10px;
    padding-left: 32px;
    padding-right: 32px;
    .btnBox2 {
      height: 100px;
      background: #eb6300;
      //background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 16px 16px 16px 16px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #ffffff;
      line-height: 100px;
      text-align: center;
    }
  }
}
</style>
