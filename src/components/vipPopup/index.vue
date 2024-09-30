<template>
  <van-popup
    v-model:show="props.modelValue"
    position="bottom"
    @click-overlay="emit('update:modelValue', false)"
    round
  >
    <div class="popupBox">
      <div class="topBox">
        <div class="topBoxLeft">
          <img src="./assets/vip@2x.png" class="vipImg" />
          <div class="title">VIP for 30days</div>
        </div>
        <div class="topBoxRight">
          {{ channelData?.list?.[0]?.channelList?.[0]?.price.symbol }}
          {{ channelData?.list?.[0]?.channelList?.[0]?.price.money }}
        </div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>
          Get
          <span style="color: #ff5768">{{
            props.vipConfg.monthlyGoldBonus
          }}</span>
          coins every month
        </div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>
          VIP exclusive sign in, Worth
          <span style="color: #ff5768">{{
            props.vipConfg.monthlyCheckInGoldValue
          }}</span>
          coins
        </div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>Unlimited free text message</div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>Recharge <span style="color: #ff5768">15%</span> OFF</div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>Check who visited my profile</div>
      </div>
      <div class="ruleBox">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>Profiles are displayed at the top</div>
      </div>
      <div class="ruleBox" style="margin-bottom: 40px">
        <img src="./assets/ic_select@2x.png" class="getImg" />
        <div>VIP badge</div>
      </div>
      <div class="itemBig">
        <div
          class="itemBox"
          v-for="(item, index) in state.channelData"
          :key="index"
          @click="handleSelect(item, index)"
        >
          <div class="itemBoxLeft">
            <img
              v-if="item.active"
              src="./assets/ic_select@2x (1).png"
              class="activeSelectImg"
            />
            <img
              v-else
              src="./assets/ic_select@2x (2).png"
              class="activeSelectImg"
            />
            <div class="activeSelectText">{{ item.channel.displayName }}</div>
          </div>
          <div class="itemBoxRight">
            {{ item.price.symbol }}{{ item.price.money }}
          </div>
        </div>
      </div>
      <div class="btnBig" v-if="state.showLink">
        <a :href="state.payUrl" target="_blank" rel="noopener noreferrer">
          <div class="btnBox">Continue</div>
        </a>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { vippriceList, vipbuy } from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
import router from "@/router";

interface Prop {
  modelValue: boolean;
  vipConfg: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  vipConfg: {},
});

const emit = defineEmits(["update:modelValue"]);

const state = reactive<any>({
  channelData: [],
  payUrl: "",
  showLink: false,
});

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
      await channelFetchData();
      state.channelData = channelData.value?.list?.[0]?.channelList;
      state.showLink = false;
    }
  },
  { immediate: true }
);

const { fetchData: channelFetchData, data: channelData } = vippriceList();

const handleSelect = async (item: any, index: number) => {
  state.channelData = state.channelData.map((it: any, inx: number) => {
    if (inx === index) {
      it.active = true;
    } else {
      it.active = false;
    }
    return it;
  });
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });

  await buyFetchedData({
    priceId: channelData.value?.list?.[0]?.id,
    channelId: item?.channel.id,
    deeplink: false,
  });
  if (buySuccess.value) {
    state.payUrl = buyData.value.data.payInfo;
    state.showLink = true;
    closeToast();
    // emit("update:modelValue", false);
  } else {
    showToast(buyMsg.value);
  }
};

const {
  fetchData: buyFetchedData,
  success: buySuccess,
  msg: buyMsg,
  data: buyData,
} = vipbuy();

// const handleBuy = async () => {
//   const arr = state.channelData.filter((item: any) => item.active);
//   if (arr.length === 0) {
//     return;
//   }
//   showLoadingToast({
//     message: "Please wait...",
//     duration: 0,
//     forbidClick: true,
//   });

//   await buyFetchedData({
//     priceId: channelData.value?.list?.[0]?.id,
//     channelId: arr[0]?.channel.id,
//     deeplink: false,
//   });
//   if (buySuccess.value) {
//     let system = navigator.userAgent;
//     let isAndroid =
//       system.indexOf("Android") > -1 || system.indexOf("Adr") > -1; // android终端
//     let isiOS = !!system.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//     // 使用
//     if (isAndroid) {
//       //android终端
//       console.log("我是安卓");
//       window.open(buyData.value.data.payInfo);
//     } else if (isiOS) {
//       //ios终端
//       console.log("我是ios");
//       window.location.href = buyData.value.data.payInfo;
//     }

//     emit("update:modelValue", false);
//   } else {
//     showToast(buyMsg.value);
//   }
//   //   let link = document.createElement("a"); // 创建a元素
//   //   link.href = 'https://www.google.com/policies/privacy/'; // 设置href属性
//   //   link.target = "_blank"; // 设置target属性
//   //   document.body.appendChild(link); // 添加到页面
//   //   link.click();
// };

// onMounted(async () => {
//   await channelFetchData();
//   state.channelData = channelData.value?.list?.[0]?.channelList;
// });
</script>
<style lang="scss" scoped>
.popupBox {
  height: 928px;
  border-radius: 16px 16px 0px 0px;
  background-color: #f2f2f2;
  padding-top: 20px;
  .topBox {
    padding-left: 32px;
    padding-right: 32px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
    .topBoxLeft {
      display: flex;
      align-items: center;
      .vipImg {
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }
      .title {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 44px;
        color: #1a1a1a;
      }
    }
    .topBoxRight {
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 40px;
      color: #ff4d42;
    }
  }
  .ruleBox {
    padding-left: 32px;

    display: flex;
    align-items: center;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #1a1a1a;
    margin-bottom: 20px;
    .getImg {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }
  .itemBig {
    padding-left: 32px;
    padding-right: 32px;
    background-color: #f2f2f2;
    padding-bottom: 150px;

    .itemBox {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 140px;
      background: #ffffff;
      border-radius: 24px 24px 24px 24px;
      padding-left: 32px;
      padding-right: 32px;
      .itemBoxLeft {
        display: flex;
        align-items: center;
        .activeSelectImg {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        .activeSelectText {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 40px;
          color: #1a1a1a;
        }
      }
      .itemBoxRight {
        width: 160px;
        height: 64px;
        background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
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
    .btnBox {
      height: 100px;
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
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
