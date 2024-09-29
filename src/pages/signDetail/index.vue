<template>
  <div class="bigBox">
    <van-nav-bar title="Daily sign in" left-text="" fixed :border="false">
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
        <div class="rightBtn" @click="state.showVipPopup = true">Renew</div>
      </template>
    </van-nav-bar>
    <div class="topBgBox">
      <div class="topImg">
        <div class="signFont">Sign in</div>
        <div class="signRule">Rewards can only be claimed on the same day</div>
      </div>
      <div class="numsBig">
        <div
          :class="item.active ? 'itemBoxActive' : 'itemBox'"
          v-for="(item, index) in state.list"
          :key="index"
        >
          <div class="itemTop">
            <img
              v-if="item.type === 1"
              src="./assets/coin_24@2x.png"
              class="itemImg"
            />
            <img
              v-else
              src="./assets/qiandaojiangli@2x.png"
              class="itemImgTwo"
            />
            <div class="nums">x{{ item.amount }}</div>
          </div>
          <div class="day">Day{{ index + 1 }}</div>
        </div>
      </div>
    </div>
    <div class="btnBig">
      <div class="btn" @click="handleSign">Sign in</div>
    </div>
    <div class="btnBig" style="margin-top: 20px">
      <div class="bottomBox">
        <div class="bottomTitle">Cumulative sign-in rewards</div>
        <div class="bottomTitle">
          days of check-in:{{ state.signDays.length }}
        </div>
        <div class="timeBox">
          <div class="time"></div>
          <div class="vipTime">
            {{ data?.startDate }}{{ "&nbsp;" }}{{ "~" }}{{ "&nbsp;"
            }}{{ data?.endDate }}
          </div>
          <div class="time2"></div>
        </div>

        <div class="bottmFlex">
          <div
            :class="item.active ? 'bottomItemBoxActive' : 'bottomItem'"
            v-for="(item, index) in state.monSignList"
            :key="index"
          >
            <div class="bottomItemTitle">{{ item.day }} Days</div>
            <img
              v-if="item.type === 1"
              src="./assets/coin_24@2x.png"
              class="bottomItemImg"
            />
            <img
              v-else
              src="./assets/qiandaojiangli@2x.png"
              class="bottomItemImg2"
            />
            <div class="nums">x{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { checkInvipget, checkInvip, vipconfig } from "@/api/allApi";
import { showLoadingToast, showToast } from "vant";
import VipPopup from "@/components/vipPopup/index.vue";

const router = useRouter();

const { fetchData, data } = checkInvipget();
const {
  fetchData: signFetch,
  msg: signMsg,
  success: signSuccess,
} = checkInvip();

const { fetchData: configFetch, data: configData } = vipconfig();

const state = reactive<any>({
  list: [],
  showVipPopup: false,
  signDays: 0,
  monSignList: [],
});

onMounted(async () => {
  getList();
  await configFetch();
});

const getList = async () => {
  await fetchData();

  state.list = data.value.awardList.map((item: any, index: number) => {
    data.value.checkInList.forEach((it: any, inx: number) => {
      if (inx === index) {
        if (it === 1) {
          item.active = true;
        }
      }
    });
    return item;
  });
  state.signDays = data.value.checkInList.filter((item: any) => item === 1);
  state.monSignList = data.value.milestoneAwardList.map((item: any) => {
    if (state.signDays.length >= item.day) {
      item.active = true;
    }
    return item;
  });
};

const handleSign = async () => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await signFetch();
  if (signSuccess.value) {
    showToast("Success");
    getList();
  } else {
    showToast(signMsg.value);
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  .rightBtn {
    width: 120px;
    height: 50px;
    background: #ff7e7d;
    border-radius: 24px 24px 24px 24px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 28px;
    color: #fff;
    line-height: 50px;
    text-align: center;
  }
  .topBgBox {
    padding-top: 100px;
    background-image: url("./assets/bg.png");
    background-size: 100% 100%;
    height: 750px;
    background-repeat: no-repeat;
    padding-left: 20px;
    padding-right: 20px;
    .topImg {
      height: 152px;
      background-image: url("./assets/Union@2x.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      padding-left: 22px;
      padding-top: 23px;
      .signFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #404040;
        margin-bottom: 22px;
      }
      .signRule {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #8c8c8c;
      }
    }
    .numsBig {
      padding-left: 24px;
      //   padding-right: 24px;
      height: 768px;
      background: #ffffff;
      border-radius: 0px 0px 0px 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      .itemBox {
        width: 104px;
        height: 144px;
        border-radius: 0px 0px 0px 0px;
        .itemTop {
          width: 104px;
          height: 104px;
          background: #f7f7f7;
          border-radius: 8px 8px 8px 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .itemImg {
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
          }
          .itemImgTwo {
            width: 60px;
            height: 30px;
            margin-bottom: 16px;
          }
          .nums {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #cccccc;
          }
        }
        .day {
          text-align: center;
          margin-top: 6px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #8c8c8c;
        }
      }
      .itemBoxActive {
        width: 104px;
        height: 144px;
        border-radius: 0px 0px 0px 0px;
        .itemTop {
          width: 104px;
          height: 104px;
          background: #feaf14;
          border-radius: 8px 8px 8px 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .itemImg {
            width: 48px;
            height: 48px;
            margin-bottom: 8px;
          }
          .itemImgTwo {
            width: 60px;
            height: 30px;
            margin-bottom: 16px;
          }
          .nums {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #fff;
          }
        }
        .day {
          text-align: center;
          margin-top: 6px;
          font-family: "SF Pro Display", sans-serif;
          font-weight: 400;
          font-size: 24px;
          color: #ff8947;
        }
      }
    }
  }
  .btnBig {
    margin-top: 300px;
    width: 100%;
    padding-left: 32px;
    padding-right: 32px;
    .btn {
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
    .bottomBox {
      height: 392px;
      background: linear-gradient(180deg, #fff3dc 0%, #fff8f1 100%);
      border-radius: 24px 24px 24px 24px;
      padding-top: 40px;
      .bottomTitle {
        text-align: center;
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #404040;
      }
      .timeBox {
        margin-top: 32px;
        display: flex;
        align-items: center;
        padding-left: 32px;
        padding-right: 32px;
        .time {
          width: 118px;
          height: 2px;
          border-radius: 0px 0px 0px 0px;
          opacity: 0.3;
          background-color: #ffd5b6;
          margin-right: 36px;
        }
        .time2 {
          width: 118px;
          height: 2px;
          border-radius: 0px 0px 0px 0px;
          opacity: 0.3;
          background-color: #ffd5b6;
          margin-left: 36px;
        }
        .vipTime {
          font-family: "SF Pro Display", sans-serif;
          font-weight: 500;
          font-size: 24px;
          color: #ffc096;
        }
      }
      .bottmFlex {
        margin-top: 32px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .bottomItem {
          width: 128px;
          height: 144px;
          background: #ffffff;
          border-radius: 8px 8px 8px 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          .bottomItemTitle {
            font-family: "SF Pro Display", sans-serif;
            font-weight: bold;
            font-size: 24px;
            color: #ff8947;
          }
          .bottomItemImg {
            width: 68px;
            height: 68px;
            // margin-left: 28px;
            margin-bottom: 8px;
          }
          .bottomItemImg2 {
            width: 60px;
            height: 30px;
            margin-bottom: 16px;
          }
          .nums {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #ff8947;
          }
        }
        .bottomItemBoxActive {
          width: 128px;
          height: 144px;
          background: linear-gradient(180deg, #ff834e 0%, #febd02 100%);
          border-radius: 8px 8px 8px 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          .bottomItemTitle {
            font-family: "SF Pro Display", sans-serif;
            font-weight: bold;
            font-size: 24px;
            color: #fff;
          }
          .bottomItemImg {
            width: 68px;
            height: 68px;
            // margin-left: 28px;
            margin-bottom: 8px;
          }
          .bottomItemImg2 {
            width: 60px;
            height: 30px;
            margin-bottom: 16px;
          }
          .nums {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 400;
            font-size: 20px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
