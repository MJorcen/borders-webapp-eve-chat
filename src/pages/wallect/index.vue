<template>
  <div class="bigBox">
    <van-nav-bar title="My Coins" left-text="" fixed :border="false">
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#000000"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
      <template #right>
        <img
          src="./assets/zhangdan.png"
          class="rightImg"
          @click="router.push('/walletDetail')"
        />
      </template>
    </van-nav-bar>
    <div class="myWallet">
      <div class="myWalletFont">My Coins:</div>
      <img src="./assets/coin_20@2x.png" class="rightImg" />
      <div class="myWalletFont">{{ walletData?.wallet?.gold }}</div>
    </div>
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
  </div>
  <van-popup v-model:show="state.showPopup" position="bottom" round>
    <div class="popupBox">
      <div class="popupBoxTop">
        <img src="./assets/coin_20@2x.png" class="rightImg" />
        <div class="myWalletFont">{{ state.selectMoney }}</div>
      </div>
      <div class="itemBig">
        <div
          class="itemBox"
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
      <div class="btnBig" v-if="state.showLink">
        <a :href="state.payUrl" target="_blank" rel="noopener noreferrer">
          <div class="btnBox">Submit</div>
        </a>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, computed } from "vue";
import {
  rechargeV2priceList,
  rechargeV2pricesubmit,
  userwallet,
} from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";

const { fetchData, data } = rechargeV2priceList();

const { fetchData: wollectFetch, data: walletData } = userwallet();

const {
  fetchData: submitFetch,
  data: submitData,
  msg: submitMsg,
  success: submitSuccess,
} = rechargeV2pricesubmit();

onMounted(async () => {
  await fetchData();
  await wollectFetch();
});

const state = reactive<any>({
  showPopup: false,
  selectMoney: 0,
  payData: {},
  payUrl: "",
  channelData: [],
});

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

const router = useRouter();
</script>
<style lang="scss" scoped>
.bigBox {
  padding-top: 100px;
  // width: 750px;
  background: linear-gradient(180deg, #29191a 0%, #481816 100%);
  min-height: 100vh;
  .rightImg {
    width: 48px;
    height: 48px;
  }
  .myWallet {
    display: flex;
    align-items: center;
    padding-left: 32px;
    margin-bottom: 60px;
    .myWalletFont {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #fff;
    }
    .rightImg {
      width: 40px;
      height: 40px;
    }
  }
  .coinBox {
    width: 100%;
    padding-left: 62px;
    padding-right: 62px;
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
