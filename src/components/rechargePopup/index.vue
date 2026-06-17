<template>
  <van-popup
    v-model:show="props.modelValue"
    position="bottom"
    @click-overlay="emit('update:modelValue', false)"
    round
  >
    <div class="coinBox">
      <div class="vipBox">
        <div class="vipBoxItem">
          <div class="vipBoxItemLeft">
            Become VIP Get <span style="color: #fdff87">8000</span> coins for
            just %d!
          </div>
          <img
            @click.stop="state.showVipPopup = true"
            class="vipBoxItemRight"
            src="./assets/Group1000004643@2x.webp"
          />
        </div>
      </div>
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
            state.showMore = true;
            state.moreChannelParmas = item.money;
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
            <img src="./assets/gold@2x.webp" class="coinBoxItemLeftImg" />
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
        <img src="./assets/gold@2x.webp" class="rightImg" />
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
            <img
              src="./assets/ic_select@2x.png"
              v-if="item.selected"
              class="choseBoxImg"
            />
            <img
              src="./assets/ic_select@2x(1).png"
              v-else
              class="choseBoxImg"
            />
            <img :src="item.channel.icon" class="activeSelectImg" alt="" />
            <div class="activeSelectText">{{ item.channel.displayName }}</div>
            <div class="activeSelectText">{{ item.channel.discountText }}</div>
          </div>
          <div class="itemBoxRight">
            {{ item.price.symbol }}{{ item.price.money }}
          </div>
        </div>
        <div class="moreBox" @click="handleShowMore" v-if="state.showMore">
          <div>More</div>
          <van-icon name="arrow-down" size="30px" />
        </div>
      </div>
      <div class="possBig" v-if="state.showLink">
        <!-- <a
          v-if="state.linkType === 'h5'"
          :href="state.payUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="possBigBtn">Submit</div>
        </a>
        <a
          v-else
          :href="state.payUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="possBigBtn">Submit</div>
        </a> -->
        <div @click="handleDeepLink" class="possBigBtn">Submit</div>
      </div>
    </div>
  </van-popup>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import {
  rechargeV2priceList,
  rechargeV2pricesubmit,
  userwallet,
  paymentchannellistMore,
} from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
import { useRouter } from "vue-router";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";

const { fetchData, data } = rechargeV2priceList();

const { vipConfigData } = useVipConfigStore();

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
  showVipPopup: false,
  showMore: true,
  moreChannelParmas: 0,
  linkType: "",
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
  state.channelData = state.channelData.map((i: any) => {
    if (item.channel.id === i.channel.id) {
      i.selected = true;
    } else {
      i.selected = false;
    }
    return i;
  });
  buyShop.value = item;
  state.showLink = true;
};

const buyShop = ref("");

const handleDeepLink = async (e: any) => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await submitFetch({
    priceId: state.payData.id,
    specialPriceId: state.payData.specialPriceId,
    channelId: buyShop.value.channel.id,
    deeplink: true,
  });
  if (submitSuccess.value) {
    state.payUrl = submitData.value.data.payInfo;
    state.linkType = submitData.value?.type;
    const startTime = Date.now();

    document.addEventListener("visibilitychange", () => {
      closeToast();
    });

    window.location.href = state.payUrl;

    if (state.payUrl.indexOf("https") === -1) {
      setTimeout(() => {
        const endTime = Date.now();
        if (endTime - startTime < 2000) {
          showToast("Payment method not supported.");
          setTimeout(() => {
            closeToast();
          }, 1000);
        }
      }, 500); // 延迟检查的时间
    }
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

const { fetchData: moreChannelFetch, data: moreChannelData } =
  paymentchannellistMore();

const handleShowMore = async () => {
  state.showMore = false;
  await moreChannelFetch({
    scene: "recharge",
    money: state.moreChannelParmas,
  });
  state.channelData = [...state.channelData, ...moreChannelData.value?.list];
};
</script>
<style lang="scss" scoped>
.vipBox {
  width: 100%;
  // padding-left: 24px;
  // padding-right: 24px;
  margin-bottom: 20px;
  background-color: #2e1819;
  .vipBoxItem {
    height: 116px;
    background: #eb6300;
    border-radius: 20px 20px 20px 20px;
    border-image: linear-gradient(
        180deg,
        rgba(255, 181, 184, 1),
        rgba(255, 250, 229, 1),
        rgba(215, 121, 37, 1)
      )
      2 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: 22px;
    .vipBoxItemLeft {
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 32px;
      color: #ffffff;
      line-height: 40px;
    }
    .vipBoxItemRight {
      width: 114px;
      height: 48px;
    }
  }
}
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
        background-image: url("./assets/Union@2x(1).png");
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
        background-image: url("./assets/Union@2x(2).png");
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
        background-image: url("./assets/Union@2x(1).png");
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
        background-image: url("./assets/Union@2x(2).png");
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
        background-image: url("./assets/Union@2x(1).png");
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
        background-image: url("./assets/Union@2x(2).png");
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
    .moreBox {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
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
