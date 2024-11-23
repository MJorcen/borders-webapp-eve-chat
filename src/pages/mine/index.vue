<template>
  <div class="bigBox">
    <img
      src="./assets/editImg.webp"
      class="editImg"
      @click="router.push('/editProfile')"
    />
    <div class="topBox">
      <div class="topBoxLeft">
        <div class="avatarBox">
          <van-image
            round
            fit="cover"
            :src="data?.user?.avatar"
            class="avatarImg"
            lazy-load
          ></van-image>
          <img :src="getCountryImg(data?.user)" alt="" class="guoImg" />
        </div>

        <div class="topBoxLeftContent">
          <div class="topBoxLeftContentTop">
            <div class="name">{{ data?.user?.nickname }}</div>
            <img src="./assets/Group4414@2x.webp" class="sex" />
          </div>
          <div class="topBoxLeftContentBottom">
            <div class="id">ID:{{ data?.user?.id }}</div>
            <img
              src="./assets/copy-template1@2x.webp"
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
        <div class="contentBoxLeftNums">{{ data?.user?.likeCount || 0 }}</div>
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
        <div class="contentBoxLeftNums">{{ data?.user?.fansCount || 0 }}</div>
        <div class="contentBoxLeftFont">Follow</div>
      </div>
      <div class="shu"></div>

      <div
        class="contentBoxLeft"
        @click="
          router.push({
            name: 'UserDynamicList',
            query: { id: data?.user?.id },
          })
        "
      >
        <div class="contentBoxLeftNums">{{ data?.user?.postCount || 0 }}</div>
        <div class="contentBoxLeftFont">Moments</div>
      </div>
      <div class="shu"></div>
      <div
        class="contentBoxLeft"
        @click="
          router.push({
            name: 'Visitor',
          })
        "
      >
        <div class="contentBoxLeftNums">{{ data?.user?.viewedCount || 0 }}</div>
        <div class="contentBoxLeftFont">Visitor</div>
      </div>
    </div>

    <div
      class="vipBox"
      v-if="data?.user?.vipLevel !== 0"
      @click="router.push('/signDetail')"
    >
      <img class="vipBoxLeft" src="./assets/image922@2x.webp" />
      <div class="becomeVipBoxFont1" v-if="data?.user?.vipLevel === 0">
        Become <span style="color: #ffec93">VIP</span>
      </div>
      <div class="becomeVipBoxFont2" v-if="data?.user?.vipLevel === 0">
        Get <span style="color: #ffec93">8000</span> coins
      </div>
      <div class="vipBoxRight">
        <div v-if="data?.user?.vipLevel !== 0" class="vipBoxRightOne">
          Valid until {{ data?.info?.vipValidEnd }}
        </div>
        <img
          @click="router.push('/signDetail')"
          v-if="data?.user?.vipLevel !== 0"
          class="youjiantou"
          src="./assets/Polygon18@2x.webp"
        />
        <img
          v-if="data?.user?.vipLevel === 0"
          @click="state.showVipPopup = true"
          class="signImg"
          src="./assets/Group1000004485@2x.webp"
        />
      </div>
    </div>
    <div class="vipBox" v-else @click="state.showVipPopup = true">
      <img class="vipBoxLeft" src="./assets/image922@2x.webp" />
      <div class="becomeVipBoxFont1" v-if="data?.user?.vipLevel === 0">
        Become <span style="color: #ffec93">VIP</span>
      </div>
      <div class="becomeVipBoxFont2" v-if="data?.user?.vipLevel === 0">
        Get <span style="color: #ffec93">8000</span> coins
      </div>
      <div class="vipBoxRight">
        <div v-if="data?.user?.vipLevel !== 0" class="vipBoxRightOne">
          Valid until {{ data?.info?.vipValidEnd }}
        </div>
        <img
          @click="router.push('/signDetail')"
          v-if="data?.user?.vipLevel !== 0"
          class="youjiantou"
          src="./assets/Polygon18@2x.webp"
        />
        <img
          v-if="data?.user?.vipLevel === 0"
          @click="state.showVipPopup = true"
          class="signImg"
          src="./assets/Group1000004485@2x.webp"
        />
      </div>
    </div>
    <div class="coinsBox" @click="router.push('/wallect')">
      <img src="./assets/gold-8@2x.webp" class="coinImg" />
      <div>
        <div class="coinsBoxLeft">My coins:</div>
        <div class="coinsBoxRight">{{ walletData?.wallet?.gold || 0 }}</div>
      </div>
      <img src="./assets/Group1000004825@2x.webp" class="coinImgBg" />
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
          <img
            :src="item.icon"
            :class="item.name === 'Feedback' ? 'iconImgSmall' : 'iconImg'"
          />
          <div class="itemBoxLeft">{{ item.name }}</div>
        </div>
        <van-icon name="arrow" color="#cccccc" size="20" />
      </div>
    </div>
    <!-- v-if="environmentVariable !== 'prod'" -->
    <!-- <div class="settingBox" v-if="environmentVariable !== 'prod'">
      <div class="itemBox" @click="(event) => handleClearStoranage(event)">
        <div class="flex items-center">
          <img :src="img3" class="iconImg" />
          <div class="itemBoxLeft">{{ "清缓存" }}</div>
        </div>
        <van-icon name="arrow" color="#cccccc" size="20" />
      </div>
    </div> -->
  </div>
  <!-- v-if="environmentVariable === 'development'" -->
  <!-- <a
    v-if="environmentVariable === 'development'"
    style="color: #fff"
    :href="state.href"
    >跳转</a
  > -->
  <div class="w-[100%] h-[100px]"></div>

  <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
  <Tabbar></Tabbar>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import Tabbar from "@/components/Tabbar/index.vue";
import img1 from "./assets/blocklist.webp";
import img2 from "./assets/Group1000004827@2x.webp";
import img3 from "./assets//blocklist.webp";
import {
  userDetail,
  userwallet,
  vipconfig,
  checkInvip,
  webdownload,
} from "@/api/allApi";
import { showLoadingToast, showToast } from "vant";
import { useUserDetailStore } from "@/stores/userDetail";
import VipPopup from "@/components/vipPopup/index.vue";
import Cookies from "js-cookie";

const router = useRouter();

const { fetchData, data } = userDetail();
const { fetchData: wollectFetch, data: walletData } = userwallet();
const { fetchData: configFetch, data: configData } = vipconfig();
const { fetchData: downConfig, data: downData } = webdownload();

const {
  fetchData: signFetch,
  msg: signMsg,
  success: signSuccess,
} = checkInvip();

onMounted(() => {
  getUserDetail();
});

const environmentVariable = import.meta.env.VITE_NODE_ENV;

const state = reactive({
  showVipPopup: false,
  href: "",
});

// onActivated(() => {
//   getUserDetail();
// });

const { setUser }: any = useUserDetailStore();

const getUserDetail = async () => {
  await Promise.all([fetchData(), wollectFetch(), configFetch()]);

  // await downConfig({
  //   userId: data.value.user.id,
  // });
  setUser(data.value);
  // const encodeURIStr = encodeURIComponent(downData.value);
  // state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.global&referrer=${encodeURIStr}`;
  // alert(state.href);
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
]);

const getCountryImg = (item: any) => {
  const path: any = new URL(
    `/public/contryIcon/icon_counties_rectangle_${item?.region.toLowerCase()}.png`,
    import.meta.url
  );
  return path || "";
};

const handleClearStoranage = (e) => {
  // e.preventDefault();
  // window.location.href = state.href;
  // window.open(state.href);

  localStorage.clear();
  Cookies.remove("deviceId");
};
</script>
<style lang="scss" scoped>
.bigBox {
  max-height: 100%;
  position: relative;
  background-color: #241213;
  .editImg {
    position: absolute;
    top: 30px;
    right: 48px;
    width: 60px;
    height: 60px;
  }
  .topBox {
    display: flex;
    align-items: center;
    // height: 100%;
    // min-height: 438px;
    justify-content: space-between;
    padding-left: 40px;
    padding-right: 32px;
    padding-top: 50px;
    .topBoxLeft {
      display: flex;
      align-items: center;
      .avatarBox {
        margin-right: 32px;
        position: relative;
        .avatarImg {
          width: 160px;
          height: 160px;
          border: 4px solid #ffffff;
          border-radius: 50%;
        }
        .guoImg {
          position: absolute;
          bottom: 20px;
          right: 10px;
          z-index: 10;
          width: 48px;
          height: 48px;
          // border-radius: 50%;
        }
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
          .sex {
            width: 42px;
            height: 24px;
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
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #c7c4cc;
            margin-right: 8px;
          }
          .copyImg {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
  .contentBox {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 26px;
    padding-left: 22px;
    padding-right: 22px;
    padding-top: 40px;
    .contentBoxLeft {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .contentBoxLeftNums {
        font-family: "Inter", sans-serif;
        font-weight: bold;
        font-size: 40px;
        color: #ffffff;
        margin-bottom: 6px;
      }
      .contentBoxLeftFont {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #c7c4cc;
      }
    }
    .shu {
      width: 4px;
      height: 60px;
      background-color: #51657c;
      border: 1px solid #51657c;
    }
  }
  .coinsBox {
    height: 238px;
    background: #601e1e;
    border-radius: 20px 20px 20px 20px;
    margin-left: 24px;
    margin-right: 24px;
    margin-bottom: 24px;
    padding-left: 38px;
    position: relative;
    display: flex;
    align-items: center;
    .coinImg {
      width: 90px;
      height: 90px;
      margin-right: 46px;
    }
    .coinsBoxLeft {
      font-family: "Inter", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #fef6ca;
      margin-bottom: 10px;
    }
    .coinsBoxRight {
      font-family: "Inter", sans-serif;
      font-weight: 500;
      font-size: 32px;
      color: #fef6ca;
    }
    .coinImgBg {
      width: 230px;
      height: 236px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .vipBox {
    margin-top: 30px;
    height: 148px;
    background: linear-gradient(90deg, #fcb73e 0%, #fc9b57 100%);
    border-radius: 20px 20px 20px 20px;
    margin-left: 24px;
    margin-right: 24px;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .becomeVipBoxFont1 {
      position: absolute;
      font-family: "Arial", sans-serif;
      font-weight: normal;
      font-size: 28px;
      color: #ffffff;
      top: 20px;
      right: 154px;
    }
    .becomeVipBoxFont2 {
      position: absolute;
      font-family: "Arial", sans-serif;
      font-weight: normal;
      font-size: 28px;
      color: #ffffff;
      bottom: 18px;
      right: 162px;
    }
    .vipBoxLeft {
      width: 214px;
      height: 70px;
    }
    .vipBoxRight {
      display: flex;
      align-items: center;
      .signImg {
        width: 132px;
        height: 40px;
      }
      .vipBoxRightOne {
        width: 122px;
        height: 72px;
        font-family: "ABeeZee", sans-serif;
        font-weight: 400;
        font-size: 20px;
        color: #ffffff;
        line-height: 23px;
        margin-right: 88px;
      }
      .youjiantou {
        width: 40px;
        height: 40px;
      }
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
    // background-color: #fff;
    border-radius: 12px;
    padding-left: 40px;
    padding-right: 40px;
    .itemBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 120px;
      // border-bottom: 1px solid #a1a1a1;
      .itemBoxLeft {
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 28px;
        color: #fff;
      }
      .iconImg {
        width: 56px;
        height: 56px;
        margin-right: 20px;
      }
      .iconImgSmall {
        margin-left: 5px;
        width: 45px;
        height: 45px;
        margin-right: 25px;
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
