<template>
  <div class="bigBox">
    <van-nav-bar
      title="My Coins"
      style="background-color: #2c1a1a; color: #ffffff"
      left-text=""
      fixed
      :border="false"
    >
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#ffffff"
          @click="
            () => {
              router.go(-1);
            }
          "
        />
      </template>
      <template #right>
        <img
          src="./assets/zhangdan.webp"
          class="rightImg"
          @click="router.push('/walletDetail')"
        />
      </template>
    </van-nav-bar>
    <div class="myWallet">
      <div class="myWalletFont">My Coins:</div>
      <img src="./assets/gold@2x.webp" class="rightImg" />
      <div class="myWalletFont">{{ walletData?.wallet?.gold }}</div>
    </div>
    <div class="swiperBox">
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
        @click="state.showVipPopup = true"
      >
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">
                Get {{ vipConfigData?.monthlyGoldBonus }} coins every month
              </div>
            </div>
            <div class="swiperItemBottom">
              <img class="swiperItemBottomLeft" src="./assets/Group@2x.webp" />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  Get coins immediately
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">VIP exclusive sign in</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(1).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  Worth
                  <span style="color: #ff0000">{{
                    vipConfigData?.monthlyCheckInGoldValue
                  }}</span>
                  coins
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">Unlimited free text message</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(2).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  Chat with other users
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">Recharge 15% OFF</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(3).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">Special offer</div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">Profiles are displayed at the top</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(4).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  Discovered by more people
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">Check who visited my profile</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(5).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  nerver miss the destiny with her
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="swiperItem">
            <div class="topSwiper">
              <div class="topSwiperItem">VIP badge</div>
            </div>
            <div class="swiperItemBottom">
              <img
                class="swiperItemBottomLeft"
                src="./assets/Group@2x(6).webp"
              />
              <div class="swiperItemBottomRight">
                <div class="swiperItemBottomRightTop">
                  Shine brighter in a crowd
                </div>
                <div class="btnBig">
                  <div class="btn">Get Vip</div>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
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
    <van-popup v-model:show="state.showPopup" position="bottom" round>
      <div class="popupBox">
        <div class="popupBoxTop">
          <img src="./assets/gold@2x.webp" class="rightImg" />
          <div class="myWalletFont">{{ state.selectMoney }}</div>
        </div>
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
          <div class="moreBox" @click="handleShowMore" v-if="state.showMore">
            <div>More</div>
            <van-icon name="arrow-down" size="30px" />
          </div>
        </div>
        <div class="btnBig" v-if="state.showLink">
          <a :href="state.payUrl" target="_blank" rel="noopener noreferrer">
            <div class="btnBox">Submit</div>
          </a>
        </div>
      </div>
    </van-popup>
    <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, computed } from "vue";
import {
  rechargeV2priceList,
  rechargeV2pricesubmit,
  userwallet,
  paymentchannellistMore,
} from "@/api/allApi";
import { closeToast, showLoadingToast, showToast } from "vant";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";

const { vipConfigData } = useVipConfigStore();

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
  showVipPopup: false,
  showMore: true,
  moreChannelParmas: 0,
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
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
.bigBox {
  padding-top: 100px;
  // width: 750px;
  // background: linear-gradient(180deg, #29191a 0%, #481816 100%);
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
  .swiperBox {
    padding-left: 16px;
    padding-right: 16px;
    margin-bottom: 30px;
    .swiperItem {
      background-image: url("./assets/Rectangle2282@2x.webp");
      width: 100%;
      height: 264px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .topSwiper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        .topSwiperItem {
          background-image: url("./assets/Rectangle34625260@2x.webp");
          width: 550px;
          height: 44px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-weight: normal;
          font-size: 32px;
          color: #ffffff;
          line-height: 44px;
        }
      }
      .swiperItemBottom {
        display: flex;
        justify-content: space-between;
        padding-left: 28px;
        padding-right: 28px;
        .swiperItemBottomLeft {
          width: 160px;
          height: 160px;
        }
        .swiperItemBottomRight {
          .swiperItemBottomRightTop {
            font-family: "Inter", sans-serif;
            font-weight: 500;
            font-size: 32px;
            text-align: right;
            color: #ffffff;
            margin-bottom: 52px;
          }
          .btnBig {
            display: flex;
            justify-content: flex-end;
            .btn {
              width: 160px;
              height: 60px;
              background: #eb6300;
              border-radius: 20px 20px 20px 20px;
              border: 2px solid #ffffff;
              font-family: "Inter", sans-serif;
              font-weight: normal;
              font-size: 32px;
              color: #ffffff;
              line-height: 60px;
              text-align: center;
            }
          }
        }
      }
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
  .btnBig {
    position: fixed;
    width: 100%;
    bottom: 10px;
    padding-left: 32px;
    padding-right: 32px;
    .btnBox {
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
