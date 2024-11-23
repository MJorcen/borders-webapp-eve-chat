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
        <div class="moneyBox">{{ vipConfigData.firstMonthPrice }}/month</div>
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
      <div class="btn" @click="emit('handleOpen')">Continue</div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive } from "vue";
import { useVipConfigStore } from "@/stores/vipConfig";

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

const state = reactive({
  showVipPopup: false,
});
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
    left: 36px;
    display: flex;
    align-items: center;
    .vipIcon {
      width: 110px;
      height: 98px;
    }
    .vipFont {
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 100px;
      color: #ffffff;
      margin-right: 20px;
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
</style>
