<template>
  <div class="bigBox">
    <van-nav-bar
      style="
        background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
        color: #fff;
      "
      title="Membership"
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
            @click="
              () => {
                state.showQuickPopup = true;
              }
            "
          />
        </div>
      </template>
    </van-nav-bar>
    <div class="kongbox"></div>
    <div class="swiperBox">
      <van-swipe class="myswipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip1.webp" class="icon" />
            <div class="title">
              Get {{ vipConfigData?.monthlyGoldBonus }} coins every month
            </div>
            <div class="font">Get coins immediately</div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip2.webp" class="icon" />
            <div class="title">VIP exclusive sign in</div>
            <div class="font">
              Worth
              {{ vipConfigData?.monthlyCheckInGoldValue }}
              coins
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip3.webp" class="icon" />
            <div class="title">Unlimited free text message</div>
            <div class="font">Chat with other users</div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip4.webp" class="icon" />
            <div class="title">Recharge 15% OFF</div>
            <div class="font">Special offer</div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip5.webp" class="icon" />
            <div class="title">Profiles are displayed at the top</div>
            <div class="font">Discovered by more people</div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip6.webp" class="icon" />
            <div class="title">Check who visited my profile</div>
            <div class="font">nerver miss the destiny with her</div>
          </div>
        </van-swipe-item>

        <van-swipe-item>
          <div class="swiperItem">
            <img src="./assets/vip7.webp" class="icon" />
            <div class="title">VIP badge</div>
            <div class="font">Shine brighter in a crowd</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="contentBox">
      <div class="itemBox">
        <div
          :class="item?.isActived ? 'itemactive' : 'item'"
          v-for="(item, index) in state.list"
          :key="index"
          @click="handleActive(item, index)"
        >
          <div class="topBoxBig" v-if="item.tag">
            <div class="topBox">{{ item.tag }}</div>
          </div>
          <div class="monthBox">
            <div class="monthnums">{{ item.month }}</div>
            <div class="monthfont">Months</div>
            <div
              class="font1"
              v-if="item?.channelList?.[0]?.price?.vipMonthlyMoney > 0"
            >
              {{ item?.channelList?.[0]?.price?.currency
              }}{{ item?.channelList?.[0]?.price?.vipMonthlyMoney }}/mo.
            </div>
            <div class="font2">{{ item?.discountInfo }}</div>
          </div>
          <div class="font3">
            {{ item?.channelList?.[0]?.price?.symbol
            }}{{ item?.channelList?.[0]?.price?.money }}
          </div>
        </div>
      </div>
      <div class="cundowmBox">
        <van-count-down :time="time">
          <template #default="timeData">
            <div class="cutdownFont">
              offer ends in {{ timeData.hours }}:{{ timeData.minutes }}:{{
                timeData.seconds
              }}
            </div>
          </template>
        </van-count-down>
      </div>
    </div>
    <div class="btnBox">
      <div
        class="btn"
        @click="
          () => {
            state.showLink = false;
            state.showPopup = true;
          }
        "
      >
        Continue
        <img src="./assets/image1085@2x.webp" class="btnIcon" />
      </div>
    </div>
    <!-- <div class="bottomFontBig">
      <div class="bottomFont">
        Recurring billing, cancel anytime. By tapping Continue, your payment
        will be charged to your
      </div>
    </div> -->
    <QuickPopup
      :tips="'Are you sure to quit?'"
      :showTopTips="true"
      @handleOpen="
        () => {
          state.showQuickPopup = false;
        }
      "
      :imgUrl="beforeAnchors?.list?.[0]?.avatar"
      @handleClose="router.go(-1)"
      v-model="state.showQuickPopup"
    ></QuickPopup>
    <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
    <van-popup v-model:show="state.showPopup" position="bottom" round>
      <div class="popupBox">
        <div class="popupBoxTop">VIP {{ state.month }} month</div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVipConfigStore } from "@/stores/vipConfig";
import QuickPopup from "@/components/quickPopup/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import {
  vipMultipriceList,
  matchbeforePaymentlistAnchors,
  vipMultisubmit,
} from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
const { vipConfigData } = useVipConfigStore();

const router = useRouter();

const state = reactive<any>({
  showVipPopup: false,
  showQuickPopup: false,
  list: [
    {
      isActived: false,
      nums: 3,
      topFont: "Bset value",
    },
    {
      isActived: true,
      nums: 1,
      topFont: "Most popular",
    },
    {
      isActived: false,
      nums: 6,
    },
  ],
  payUrl: "",
  channelData: [],
  payData: {},
  month: "",
});

const { fetchData, data } = vipMultipriceList();

const { fetchData: fetchMatchbeforePaymentlistAnchors, data: beforeAnchors } =
  matchbeforePaymentlistAnchors();

onMounted(async () => {
  await fetchMatchbeforePaymentlistAnchors({
    sence: "random_one",
  });
  await fetchData();
  state.list = data.value.list;
  //   state.list = data.value.list.sort((a, b) => {
  //     const order = { 3: 0, 1: 1, 6: 2 }; // 定义排序规则
  //     return order[a.month] - order[b.month];
  //   });
  state.list = state.list.map((item: any, index: number) => {
    if (index === 1) {
      item.isActived = true;
    }
    return item;
  });
  state.payData = state.list[1];
  state.channelData = state.list[1].channelList;
  state.month = state.list[1].month;
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

const time = computed(() => {
  return getRemainingMilliseconds();
});

const {
  fetchData: buyFetchedData,
  success: buySuccess,
  msg: buyMsg,
  data: buyData,
} = vipMultisubmit();

const handleActive = async (item: any, index: number) => {
  state.list = state.list.map((it: any, inx: number) => {
    if (inx === index) {
      it.isActived = true;
    } else {
      it.isActived = false;
    }
    return it;
  });
  state.channelData = item.channelList;
  state.payData = item;
  state.month = item.month;
};

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
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
::v-deep(.van-swipe__indicators) {
  bottom: 80px;
}
.bigBox {
  background-color: #fff;
  background: #fff;
  width: 100%;
  min-height: 100vh;
  .kongbox {
    width: 100%;
    height: 150px;
    background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
  }
  .swiperBox {
    width: 100%;
    height: 420px;
    background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
    .myswipe {
      width: 100%;
      height: 420px;
      background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
      .swiperItem {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .icon {
        width: 488px;
        height: 185px;
      }
      .title {
        font-family: "Inter", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #ffffff;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .font {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: rgba(240, 240, 240, 0.8);
      }
    }
  }
  .contentBox {
    margin-bottom: 86px;
    position: relative;
    margin-top: -20px;
    z-index: 10;
    width: 100%;
    background: #ffffff;
    border-radius: 40px 40px 0px 0px;
    border-top: 10px solid #ffdfc6;
    border-top-left-radius: 10px solid #ffdfc6;
    border-top-right-radius: 10px solid #ffdfc6;
    padding-top: 108px;
    .itemBox {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item {
        width: 200px;
        padding-bottom: 20px;
        padding-top: 20px;

        // padding: 20px;
        background: #f3f3f3;
        border-radius: 20px 20px 20px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        .topBoxBig {
          position: absolute;
          top: -20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          .topBox {
            padding: 6px;
            background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
            border-radius: 40px 40px 40px 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #ffffff;
          }
        }
        .monthBox {
          margin-top: -10px;
          width: 178px;
          height: 234px;
          //   background: #ffffff;
          border-radius: 20px 20px 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .monthnums {
            font-family: "Inter", sans-serif;
            font-weight: 900;
            font-size: 72px;
            color: #000000;
          }
          .monthfont {
            margin-top: -25px;
            font-family: "Inter", sans-serif;
            font-weight: bold;
            font-size: 32px;
            color: #000000;
            margin-bottom: 6px;
          }
          .font1 {
            margin-bottom: 6px;
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #929292;
          }
          .font2 {
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 28px;
            color: #ec6776;
          }
        }
        .font3 {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #929292;
        }
      }
      .itemactive {
        padding-top: 20px;
        padding-bottom: 20px;

        width: 200px;
        height: 300px;
        background: linear-gradient(315deg, #ff4d67 0%, #ff8a9b 100%);
        border-radius: 20px 20px 20px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        .topBoxBig {
          position: absolute;
          top: -20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          .topBox {
            padding: 6px;
            background: linear-gradient(90deg, #c20057 0%, #b100bb 100%);
            border-radius: 40px 40px 40px 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #ffffff;
          }
        }
        .monthBox {
          margin-top: -10px;
          width: 178px;
          height: 234px;
          background: #ffffff;
          border-radius: 20px 20px 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .monthnums {
            font-family: "Inter", sans-serif;
            font-weight: 900;
            font-size: 72px;
            color: #000000;
          }
          .monthfont {
            margin-top: -25px;
            font-family: "Inter", sans-serif;
            font-weight: bold;
            font-size: 32px;
            color: #000000;
            margin-bottom: 6px;
          }
          .font1 {
            margin-bottom: 6px;
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #929292;
          }
          .font2 {
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 28px;
            color: #ec6776;
          }
        }
        .font3 {
          margin-top: 8px;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #ffffff;
        }
      }
    }
    .cundowmBox {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 86px;
      .cutdownFont {
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 40px;
        color: #ee7987;
      }
    }
  }
  .bottomFontBig {
    position: fixed;
    padding-left: 118px;
    padding-right: 116px;
    text-align: center;
    width: 100%;
    bottom: 10px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 24px;
    color: #929292;
    line-height: 28px;
  }
  .btnBox {
    position: fixed;

    width: 100%;
    bottom: 90px;
    // z-index: 23;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn {
      position: relative;
      margin-top: 20px;
      margin-bottom: 30px;
      width: 380px;
      height: 112px;
      background: #e98853;
      border-radius: 64px;
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 40px;
      color: #fefefe;
      line-height: 100px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .btnIcon {
        width: 117px;
        height: 117px;
        position: absolute;
        top: -40px;
        right: -40px;
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
}
</style>
