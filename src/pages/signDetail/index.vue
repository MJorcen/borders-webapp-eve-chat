<template>
  <div class="bigBox">
    <van-nav-bar
      style="background-color: #2c1a1a; color: #fff"
      title="Daily sign in"
      left-text=""
      fixed
      :border="false"
    >
      <template #left>
        <van-icon
          name="arrow-left"
          size="18"
          color="#fff"
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
        <!-- <div class="signFont">Sign in</div> -->
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
              src="./assets/gold@2x.webp"
              class="itemImg"
            />
            <img v-else src="./assets/Slice182@2x.webp" class="itemImgTwo" />
            <div class="nums">x{{ item.amount }}</div>
          </div>
          <div class="day">Day{{ index + 1 }}</div>
        </div>
      </div>
    </div>
    <div class="btnBig">
      <div class="btn" @click="handleSign">Sign in</div>
    </div>
    <div class="btnBigTwo" style="margin-top: 20px">
      <div class="bottomTopBox">
        <img src="./assets/image411@2x.webp" class="gouImg" />
        <div class="bottomTopBoxFont">Cumulative sign-in rewards</div>
      </div>
      <div class="bottomTopBoxFontTwo">days of check-in：1</div>
      <div class="bottomTopBoxFontTwo" style="font-size: 12px">
        ({{ data?.startDate }}{{ "&nbsp;" }}{{ "~" }}{{ "&nbsp;"
        }}{{ data?.endDate }})
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
            src="./assets/gold@2x.webp"
            class="bottomItemImg"
          />
          <img v-else src="./assets/Slice182@2x.webp" class="bottomItemImg2" />
          <div class="nums">x{{ item.amount }}</div>
        </div>
      </div>
    </div>
    <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
  </div>
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
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
.bigBox {
  .rightBtn {
    width: 120px;
    height: 50px;
    background: #eb6300;
    border-radius: 90px 90px 90px 90px;
    font-family: "ABeeZee", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #ffffff;
    line-height: 50px;
    text-align: center;
  }
  .topBgBox {
    padding-top: 100px;
    // background-image: url("./assets/bg.png");
    background-size: 100% 100%;
    height: 750px;
    background-repeat: no-repeat;
    padding-left: 26px;
    padding-right: 26px;
    .topImg {
      height: 152px;
      // background-image: url("./assets/Union@2x.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      padding-left: 36px;
      padding-top: 23px;
      padding-right: 80px;
      .signFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #404040;
        margin-bottom: 22px;
      }
      .signRule {
        font-family: "ABeeZee", sans-serif;
        font-weight: 400;
        font-size: 40px;
        color: #ffffff;
        line-height: 44px;
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
      padding-top: 10px;
      padding-bottom: 40px;

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
      font-family: "Inter", sans-serif;
      font-weight: normal;
      font-size: 32px;
      color: #fefefe;
      line-height: 100px;
      text-align: center;
    }
  }
  .btnBigTwo {
    margin-left: 26px;
    margin-right: 26px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    .bottomTopBox {
      display: flex;
      align-items: center;
      .gouImg {
        width: 70px;
        height: 70px;
      }
      .bottomTopBoxFont {
        font-family: "ABeeZee", sans-serif;
        font-weight: 400;
        font-size: 40px;
        color: #eb6300;
      }
    }
    .bottomTopBoxFontTwo {
      font-family: "ABeeZee", sans-serif;
      font-weight: 400;
      font-size: 36px;
      color: #eb6300;
      padding-left: 90px;
    }
    .bottmFlex {
      margin-top: 32px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-bottom: 20px;
      .bottomItem {
        width: 128px;
        height: 144px;
        background: #f4f4f4;
        border-radius: 4px 4px 4px 4px;
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
</style>
