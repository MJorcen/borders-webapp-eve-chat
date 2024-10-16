<template>
  <van-popup
    v-model:show="props.modelValue"
    position="bottom"
    @click-overlay="emit('update:modelValue', false)"
    round
  >
    <div class="coinBox">
      <div
        :class="
          item.type === 1
            ? 'coinBoxItem'
            : item.type === 2
            ? 'coinBoxItemOff'
            : 'coinBoxItemNew'
        "
        v-for="(item, index) in data?.list"
        :key="index"
        @click="
          () => {
            state.showPopup = true;
            state.selectMoney = item.goldResult;
            state.payData = item;
            state.showLink = false;
            state.channelData = item.channelList;
          }
        "
      >
        <div class="coinBoxItemTop" v-if="item.type === 3">
          <div class="coinBoxItemTopImg">New users only!</div>
        </div>
        <div class="coinBoxItemTopTwo" v-if="item.type === 2">
          <div class="coinBoxItemTopImgTwo">
            <van-count-down :time="time" style="color: #fff; font-size: 16px" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="coinBoxItemLeft">
            <img src="./assets/coin_20@2x.png" class="coinBoxItemLeftImg" />
            <div class="coinBoxItemLeftNums">{{ item.goldResult }}</div>
            <div class="coinBoxItemLeftNumsOff" v-if="item.type === 2">
              {{ item.discountInfo }}
            </div>
          </div>
          <div class="coinBoxItemRight">
            {{ item?.channelList?.[0]?.price?.symbol }}
            {{ item?.channelList?.[0]?.price?.money }}
          </div>
        </div>
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="state.showPopup" position="bottom" round>
    <div class="popupBox">
      <div class="popupBoxTop">
        <img src="./assets/coin_20@2x.png" class="rightImg" />
        <div class="myWalletFont">{{ state.selectMoney }}</div>
      </div>
      <div class="itemBig">
        <div
          :class="item.active ? 'itemBoxActive' : 'itemBox'"
          v-for="(item, index) in state.channelData"
          :key="index"
          @click="handleSelect(item)"
        >
          <div class="itemBoxLeft">
            <img :src="item.channel.icon" class="activeSelectImg" alt="" />
            <div class="activeSelectText">{{ item.channel.displayName }}</div>
            <div class="activeSelectText">{{ item.channel.discountText }}</div>
          </div>
          <div class="itemBoxRight">
            {{ item.price.symbol }}{{ item.price.money }}
          </div>
        </div>
      </div>
      <div class="possBig" v-if="state.showLink">
        <a :href="state.payUrl" target="_blank" rel="noopener noreferrer">
          <div class="possBigBtn">Submit</div>
        </a>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import {
  rechargeV2priceList,
  rechargeV2pricesubmit,
  userwallet,
} from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
import { useRouter } from "vue-router";

const { fetchData, data } = rechargeV2priceList();

const { fetchData: wollectFetch, data: walletData } = userwallet();

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const emit = defineEmits(["update:modelValue"]);

const {
  fetchData: submitFetch,
  data: submitData,
  msg: submitMsg,
  success: submitSuccess,
} = rechargeV2pricesubmit();

// onMounted(async () => {
//   await fetchData();
//   await wollectFetch();
// });

const state = reactive<any>({
  showPopup: false,
  selectMoney: 0,
  payData: {},
  channelList: [],
  payUrl: "",
  showLink: false,
  channelData: [],
});

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
      await fetchData();
      state.channelList = data?.value?.list?.[0]?.channelList;
      await wollectFetch();
    }
  },
  { immediate: true }
);

watch(
  () => state.showPopup,
  () => {
    if (state.showPopup) {
      state.showLink = false;
    }
  },
  { immediate: true }
);

const getRemainingMilliseconds = () => {
  // 获取当前时间
  const now: any = new Date();

  // 创建下一个小时的时间
  const nextHour: any = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() + 1
  );

  // 计算剩余时间（毫秒）
  const remainingMilliseconds = nextHour - now;

  return remainingMilliseconds;
};

const time = computed(() => {
  return getRemainingMilliseconds();
});

const handleSelect = async (item: any) => {
  //   state.channelList = state.channelList.map((channel: any) => {
  //     if (item.channel.id === channel.channel.id) {
  //       channel.active = true;
  //     } else {
  //       channel.active = false;
  //     }
  //     return channel;
  //   });
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await submitFetch({
    priceId: state.payData.id,
    specialPriceId: state.payData.specialPriceId,
    channelId: item.channel.id,
    deeplink: false,
  });
  if (submitSuccess.value) {
    state.payUrl = submitData.value.data.payInfo;
    state.showLink = true;
    closeToast();
  } else {
    showToast(submitMsg.value);
  }
};

const handleSubmit = async () => {
  let arr: any = [];
  arr = state.channelList.filter((item: any) => {
    return item.active;
  });
  if (!arr.length) return;
};

const router = useRouter();
</script>
<style lang="scss" scoped>
.coinBox {
  width: 100%;
  padding-left: 62px;
  padding-right: 62px;
  background: linear-gradient(180deg, #29191a 0%, #481816 100%);
  height: 900px;
  overflow-y: auto;
  padding-top: 20px;
  .coinBoxItem {
    height: 120px;
    background: #f1f0f3;
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 40px;
    padding-top: 30px;
    .coinBoxItemTop {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImg {
        background-image: url("./assets/Union@2x (1).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 24px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
    }
    .coinBoxItemTopTwo {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImgTwo {
        background-image: url("./assets/Union@2x (2).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 24px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
        z-index: 10;
      }
    }
    .coinBoxItemLeft {
      display: flex;
      align-items: center;
      padding-left: 30px;
      .coinBoxItemLeftImg {
        min-width: 60px;
        height: 60px;
        margin-right: 30px;
      }
      .coinBoxItemLeftNums {
        font-family: "Roboto", sans-serif;
        font-weight: 900;
        font-size: 40px;
        color: #554c5f;
        margin-right: 38px;
      }
      .coinBoxItemLeftNumsOff {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #ff1f1f;
      }
    }
    .coinBoxItemRight {
      padding-right: 32px;
      font-family: "Roboto", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #554c5f;
    }
  }
  .coinBoxItemOff {
    height: 120px;
    background: #f1f0f3;
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 40px;
    border: 4px solid #11d700;
    .coinBoxItemTop {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImg {
        background-image: url("./assets/Union@2x (1).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 24px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
    }
    .coinBoxItemTopTwo {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImgTwo {
        background-image: url("./assets/Union@2x (2).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 28px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .coinBoxItemLeft {
      display: flex;
      align-items: center;
      padding-left: 30px;
      .coinBoxItemLeftImg {
        min-width: 60px;
        height: 60px;
        margin-right: 30px;
      }
      .coinBoxItemLeftNums {
        font-family: "Roboto", sans-serif;
        font-weight: 900;
        font-size: 40px;
        color: #554c5f;
        margin-right: 38px;
      }
      .coinBoxItemLeftNumsOff {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #ff1f1f;
      }
    }
    .coinBoxItemRight {
      padding-right: 32px;
      font-family: "Roboto", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #554c5f;
    }
  }
  .coinBoxItemNew {
    height: 120px;
    background: #fea862;
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 40px;
    border: 4px solid #e00000;
    .coinBoxItemTop {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImg {
        background-image: url("./assets/Union@2x (1).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 24px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
    }
    .coinBoxItemTopTwo {
      display: flex;
      align-items: center;
      justify-content: center;
      .coinBoxItemTopImgTwo {
        background-image: url("./assets/Union@2x (2).png");
        width: 280px;
        height: 40px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 24px;
        color: #ffffff;
        line-height: 40px;
        text-align: center;
      }
    }
    .coinBoxItemLeft {
      display: flex;
      align-items: center;
      padding-left: 30px;
      .coinBoxItemLeftImg {
        min-width: 60px;
        height: 60px;
        margin-right: 30px;
      }
      .coinBoxItemLeftNums {
        font-family: "Roboto", sans-serif;
        font-weight: 900;
        font-size: 40px;
        color: #554c5f;
        margin-right: 38px;
      }
      .coinBoxItemLeftNumsOff {
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #ff1f1f;
      }
    }
    .coinBoxItemRight {
      padding-right: 32px;
      font-family: "Roboto", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #fff;
    }
  }
}
.popupBox {
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

    .itemBoxActive {
      border: 1px solid #ff6748;
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
  .possBig {
    position: fixed;
    bottom: 20px;
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
    .possBigBtn {
      width: 100%;
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
