<template>
  <div class="bigBox">
    <div class="editBox" @click="router.push('/EditProfile')">
      <img src="./assets/ic_edit-data@2x (2).png" class="editImg" />
      Edit
    </div>
    <div class="topBox">
      <div class="topBoxLeft">
        <van-image
          round
          fit="cover"
          :src="data?.user?.avatar"
          class="avatarImg"
          lazy-load
        ></van-image>
        <div class="topBoxLeftContent">
          <div class="topBoxLeftContentTop">
            <div class="name">{{ data?.user?.nickname }}</div>
            <!-- <img src="./assets/ic_edit-data@2x.png" class="guoImg" /> -->
            <img :src="getCountryImg(data?.user)" alt="" class="guoImg" />

            <div class="age">{{ data?.user?.age }}</div>
          </div>
          <div class="topBoxLeftContentBottom">
            <div class="id">ID:{{ data?.user?.id }}</div>
            <img
              src="./assets/ic_copy@2x.png"
              class="copyImg"
              @click="handleCopy(data?.user?.id)"
            />
          </div>
        </div>
      </div>
      <!-- <van-icon name="arrow" color="#ffffff" size="20px" /> -->
    </div>
    <div class="contentBox">
      <div
        class="contentBoxLeft"
        @click="
          router.push({
            name: 'FollowAndFans',
            query: {
              type: 1,
            },
          })
        "
      >
        <div class="contentBoxLeftNums">{{ data?.user?.likeCount }}</div>
        <div class="contentBoxLeftFont">Following</div>
      </div>
      <div class="shu"></div>
      <div
        class="contentBoxLeft"
        @click="
          router.push({
            name: 'FollowAndFans',
            query: {
              type: 2,
            },
          })
        "
      >
        <div class="contentBoxLeftNums">{{ data?.user?.fansCount }}</div>
        <div class="contentBoxLeftFont">Followers</div>
      </div>
    </div>
    <div class="coinsBox" @click="router.push('/wallect')">
      <div class="coinsBoxLeft">My coins:</div>
      <div class="coinsBoxRight">{{ walletData?.wallet?.gold }}</div>
    </div>

    <div
      class="vipBox"
      v-if="data?.user?.vipLevel === 0"
      @click="state.showVipPopup = true"
    >
      <div class="vipBoxLeft">
        Become <span style="color: #ffec40">VIP</span>
      </div>
      <div class="vipBoxRight">
        Get
        <span style="color: #ffec40">{{ configData?.monthlyGoldBonus }}</span>
        coins
      </div>
    </div>
    <div
      class="vipBoxTwo"
      v-if="data?.user?.vipLevel !== 0"
      @click="router.push('/signDetail')"
    >
      <div class="vipBoxTwoLeft">
        <div class="vipBoxTwoLeftOne">Valid until</div>
        <div class="vipBoxTwoLeftTwo">{{ data?.info?.vipValidEnd }}</div>
      </div>
      <div class="possBox" @click.stop="handleSign">Sign-in</div>
    </div>
    <div class="settingBox">
      <div
        class="itemBox"
        @click="
          () => {
            router.push(item.route);
          }
        "
        v-for="(item, index) in settingList"
        :key="index"
      >
        <div class="flex items-center">
          <img :src="item.icon" class="iconImg" />
          <div class="itemBoxLeft">{{ item.name }}</div>
        </div>
        <van-icon name="arrow" color="#cccccc" size="20" />
      </div>
    </div>
    <div class="w-[100%] h-[100px]"></div>
  </div>
  <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
  <Tabbar></Tabbar>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import Tabbar from "@/components/Tabbar/index.vue";
import img1 from "./assets/ic_block List@2x.png";
import img2 from "./assets/ic_feedback@2x.png";
import img3 from "./assets/ic_settings@2x.png";
import { userDetail, userwallet, vipconfig, checkInvip } from "@/api/allApi";
import { showLoadingToast, showToast } from "vant";
import { useUserDetailStore } from "@/stores/userDetail";
import VipPopup from "@/components/vipPopup/index.vue";

const state = reactive({
  showVipPopup: false,
});

const router = useRouter();

const { fetchData, data } = userDetail();
const { fetchData: wollectFetch, data: walletData } = userwallet();
const { fetchData: configFetch, data: configData } = vipconfig();
const {
  fetchData: signFetch,
  msg: signMsg,
  success: signSuccess,
} = checkInvip();

onMounted(() => {
  getUserDetail();
});

// onActivated(() => {
//   getUserDetail();
// });

const { setUser }: any = useUserDetailStore();

const getUserDetail = async () => {
  await fetchData();
  await wollectFetch();
  await configFetch();
  setUser(data.value);
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
  } else {
    showToast(signMsg.value);
  }
};

const handleCopy = async (str: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = str;

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand("copy");

  document.body.removeChild(textarea);
  showToast("Success");
};

const settingList = reactive<any>([
  {
    name: "Block List",
    icon: img1,
    route: "/BlockList",
  },
  {
    name: "Feedback",
    icon: img2,
    route: "/feedBack",
  },
  // {
  //   name: "Settings",
  //   icon: img3,
  // },
]);

const regions = [
  "bgd",
  "bra",
  "col",
  "egy",
  "esp",
  "fra",
  "idn",
  "ind",
  "mar",
  "nga",
  "pak",
  "phl",
  "usa",
  "ven",
  "vnm",
];

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `../../../public/ic_contry_${item?.region?.toLowerCase()}.webp`,
    import.meta.url
  );
  const defaultImg: any = new URL(
    `../../../public/ic_contry_ind.webp`,
    import.meta.url
  );

  if (regions.includes(item?.region?.toLowerCase())) {
    return path;
  } else {
    return defaultImg;
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  max-height: 100%;
  position: relative;
  background-color: #fff;
  .editBox {
    // background-size: 100% 100%;
    // background-size: contain;
    // background-repeat: no-repeat;
    // background-image: url("./assets/wode_edit@2x.png");
    // width: 148px;
    display: flex;
    align-items: center;
    height: 148px;
    position: absolute;
    top: 44px;
    right: 0px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    font-size: 28px;
    color: #ffffff;
    justify-content: flex-end;
    padding-right: 30px;

    .editImg {
      height: 48px;
      width: 48px;
      margin-right: 20px;
    }
  }
  .topBox {
    display: flex;
    align-items: center;
    // height: 100%;
    min-height: 438px;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 150px;
    background: linear-gradient(180deg, #ff4d42 0%, #ff834e 100%);
    .topBoxLeft {
      display: flex;
      align-items: center;
      .avatarImg {
        width: 160px;
        height: 160px;
        border: 4px solid #ffffff;
        border-radius: 50%;
        margin-right: 32px;
      }
      .topBoxLeftContent {
        .topBoxLeftContentTop {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          .name {
            font-family: "SF Pro Display", sans-serif;
            font-weight: bold;
            font-size: 40px;
            color: #ffffff;
            margin-right: 8px;
          }
          .guoImg {
            min-width: 48px;
            height: 48px;
            margin-right: 8px;
          }
          .age {
            width: 32px;
            height: 32px;
            background: linear-gradient(90deg, #8f48ff 0%, #e405ff 100%);
            border-radius: 0px 0px 0px 0px;
            font-family: "SF Pro Display", sans-serif;
            font-weight: 500;
            font-size: 20px;
            color: #ffffff;
            display: flex;
            align-items: center;
            border-radius: 50%;
            justify-content: center;
          }
        }
        .topBoxLeftContentBottom {
          display: flex;
          align-items: center;
          .id {
            font-family: "SF Pro Text", sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #ffffff;
            margin-right: 8px;
          }
          .copyImg {
            width: 32px;
            height: 32px;
          }
        }
      }
    }
  }
  .contentBox {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: -20px;
    padding-left: 146px;
    padding-right: 146px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding-top: 40px;
    .contentBoxLeft {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .contentBoxLeftNums {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 36px;
        color: #1a1a1a;
        margin-bottom: 10px;
      }
      .contentBoxLeftFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 26px;
        color: #aaaaaa;
      }
    }
    .shu {
      width: 4px;
      height: 60px;
      background-color: #ebebeb;
      border: 1px dashed #ebebeb;
    }
  }
  .coinsBox {
    background-size: 100% 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("./assets/me_coin_bg@2x.png");
    height: 176px;
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 40px;
    margin-bottom: 24px;
    padding-left: 60px;
    padding-top: 32px;
    .coinsBoxLeft {
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 28px;
      color: #ffffff;
      margin-right: 20px;
      //   margin-bottom: 16px;
    }
    .coinsBoxRight {
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 56px;
      color: #ffffff;
    }
  }
  .vipBoxTwo {
    background-size: 100% 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("./assets/banner-img@2x.png");
    height: 176px;
    margin-left: 24px;
    margin-right: 24px;
    overflow: hidden;
    padding-left: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 60px;
    padding-right: 40px;
    .vipBoxTwoLeft {
      .vipBoxTwoLeftOne {
        margin-top: 44px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #ffffff;
        margin-bottom: 20px;
      }
      .vipBoxTwoLeftTwo {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #ffffff;
      }
    }
    .possBox {
      background-size: 100% 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-image: url("./assets/fontBg.png");
      //   padding: 16px 24px 16px 24px;
      min-width: 158px;
      min-height: 70px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 32px;
      color: #a04d00;
    }
  }
  .vipBox {
    background-size: 100% 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("./assets/me_vip_bg@2x.png");
    height: 176px;
    margin-left: 24px;
    margin-right: 24px;
    overflow: hidden;
    padding-left: 60px;
    position: relative;
    margin-bottom: 24px;

    .vipBoxLeft {
      margin-top: 40px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 34px;
      color: #ffffff;
    }
    .vipBoxRight {
      margin-top: 8px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 29px;
      color: #ffffff;
    }
    .possBox {
      position: absolute;
      width: 118px;
      height: 58px;
      background: linear-gradient(149deg, #ffffff 0%, #aeadff 82%);
      border-radius: 40px 40px 40px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 28px;
      color: #624de4;
      line-height: 58px;
      right: 40px;
      top: 52px;
    }
  }
  .settingBox {
    margin-top: 40px;
    margin-left: 32px;
    margin-right: 32px;
    background-color: #fff;
    border-radius: 12px;
    padding-left: 40px;
    padding-right: 40px;
    .itemBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 120px;
      border-bottom: 1px solid #a1a1a1;
      .itemBoxLeft {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #1a1a1a;
      }
      .iconImg {
        width: 56px;
        height: 56px;
        margin-right: 20px;
      }
      .itemBoxRight {
        width: 40px;
        height: 40px;
      }
    }
    .itemBox:last-child {
      border-bottom: none;
    }
  }
}
</style>
