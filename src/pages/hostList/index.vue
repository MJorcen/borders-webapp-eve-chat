<template>
  <div class="bigBox">
    <div class="tabsBox">
      <div
        :class="item.active ? 'activeTabs' : 'tabs'"
        v-for="(item, index) in tabsList"
        :key="index"
        @click="handleClick(index)"
      >
        {{ item.title }}
        <div class="line" v-if="item.active"></div>
      </div>
    </div>
    <div v-if="active === 0">
      <van-pull-refresh
        v-model="loading"
        @refresh="
          () => {
            state.offset = 0;
            state.list = [];
            getList();
          }
        "
      >
        <template #pulling>
          <span>Loading...</span>
        </template>
        <template #loosing>
          <span>Loading...</span>
        </template>
        <template #loading>
          <span>Loading...</span>
        </template>
        <van-list
          v-model:loading="loading"
          :finished="state.finished"
          finished-text="Noting More"
          loading-text="Loading..."
          @load="onLoad"
          v-if="state.list.length"
        >
          <div class="flexBox">
            <div
              class="itemBox"
              v-for="(item, index) in state.list"
              :key="index"
              @click="
                () => {
                  router.push({
                    name: 'AnchorDetail',
                    query: { id: item?.user?.id },
                  });
                }
              "
            >
              <van-image
                fit="cover"
                radius="8"
                class="itemImg"
                :src="item?.user?.avatar"
                lazy-load
              ></van-image>
              <div
                v-if="item.user.inCall === 0 && item.user.active === 1"
                class="caozuo"
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      if (!res) {
                        if (userDetail?.user?.vipLevel === 0) {
                          state.showVipPopup = true;
                        } else {
                          state.showRechargePopup = true;
                        }
                      }
                    });
                  }
                "
              >
                <SvgaShow
                  :divId="`demo${item?.user?.id}${index}`"
                  :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
                ></SvgaShow>
              </div>
              <img
                v-else
                class="caozuo"
                src="./assets/Group1000004606@2x.webp"
                @click.stop="
                  () => {
                    router.push({
                      name: 'ChatRoom',
                      query: { user: JSON.stringify(item.user) },
                    });
                  }
                "
              />

              <div class="bottmBox2">
                <div class="yuan" v-if="item.user.onDuty"></div>
                <div class="yuan2" v-else></div>
                <div
                  class="online"
                  v-if="item.user.inCall === 0 && item.user.active === 1"
                >
                  onLine
                </div>
                <div class="online" v-else>offline</div>
              </div>
              <div class="hostName">{{ item.user.nickname }}</div>
              <div class="bottmBox3">
                <img class="contry" :src="getCountryImg(item.user)" alt="" />
                <div class="contryName">
                  {{ item?.user?.region }}·{{ item?.user?.age }}
                </div>
              </div>
            </div>
          </div>
        </van-list>
        <Empty v-else></Empty>
      </van-pull-refresh>
    </div>
    <div v-else>
      <van-pull-refresh
        v-model="loadingTwo"
        @refresh="
          () => {
            state.offsetTwo = 0;
            state.followList = [];
            getFolowList();
          }
        "
      >
        <template #pulling>
          <span>Loading...</span>
        </template>
        <template #loosing>
          <span>Loading...</span>
        </template>
        <template #loading>
          <span>Loading...</span>
        </template>
        <van-list
          v-if="state.followList.length"
          v-model:loading="loadingTwo"
          :finished="state.finishedTwo"
          finished-text="Noting More"
          loading-text="Loading..."
          @load="onLoad"
        >
          <div class="flexBox">
            <div
              class="itemBox"
              v-for="(item, index) in state.followList"
              :key="index"
              @click="
                () => {
                  router.push({
                    name: 'AnchorDetail',
                    query: { id: item?.id },
                  });
                }
              "
            >
              <van-image
                fit="cover"
                radius="12"
                class="itemImg"
                :src="item?.avatar"
                lazy-load
              ></van-image>
              <!-- <img
                class="caozuo"
                src="./assets/caozuo.png"
                v-if="item?.inCall === 0 && item?.active === 1"
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      if (!res) {
                        state.showRechargePopup = true;
                      }
                    });
                  }
                "
              /> -->
              <div
                v-if="item?.inCall === 0 && item?.active === 1"
                class="caozuo"
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      if (!res) {
                        if (userDetail?.user?.vipLevel === 0) {
                          state.showVipPopup = true;
                        } else {
                          state.showRechargePopup = true;
                        }
                      }
                    });
                  }
                "
              >
                <SvgaShow
                  :divId="`demo${item?.user?.id}${index}`"
                  :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
                ></SvgaShow>
              </div>
              <img
                v-else
                class="caozuo"
                src="./assets/Group1000004606@2x.webp"
                @click.stop="
                  () => {
                    router.push({
                      name: 'ChatRoom',
                      query: { user: JSON.stringify(item) },
                    });
                  }
                "
              />

              <div class="bottmBox2">
                <div class="yuan" v-if="item.onDuty"></div>
                <div class="yuan2" v-else></div>
                <div
                  class="online"
                  v-if="item.inCall === 0 && item.active === 1"
                >
                  onLine
                </div>
                <div class="online" v-else>offline</div>
              </div>
              <div class="hostName">{{ item.nickname }}</div>
              <div class="bottmBox3">
                <img class="contry" :src="getCountryImg(item)" alt="" />
                <div class="contryName">{{ item?.region }}·{{ item?.age }}</div>
              </div>
            </div>
          </div>
        </van-list>
        <Empty v-else></Empty>
      </van-pull-refresh>
    </div>

    <!-- <div class="fixedBox">
      <div class="btnBox">
        <div class="btnBoxFont">Random match</div>
        <div class="btnBoxBottom">
          <img src="./assets/coin@2x.png" class="coin" />
          <div class="coinText">400/min</div>
        </div> -->
    <!-- 会员显示 -->
    <!-- <img src="./assets/crown@2x.png" class="crown" /> -->
    <!-- 免费卡显示 -->
    <!-- <div class="matchBox">
          <img src="./assets/matchCard.png" class="matchCard" />
          <div class="matchBoxFont">x2</div>
        </div> -->
    <!-- </div>
    </div> -->
    <div class="w-[100%] h-[100px]"></div>
  </div>
  <!-- 签到弹窗 -->
  <SignPopup v-model="showSignPopup"></SignPopup>
  <!-- 首冲活动VIP弹窗 -->
  <FirstChargeVipPopup
    :money="configDataTwo?.monthlyCheckInGoldValue"
    v-model="showChargePopup"
    @handleOpen="state.showVipPopup = true"
  ></FirstChargeVipPopup>
  <VipPopup :vipConfg="configDataTwo" v-model="state.showVipPopup"></VipPopup>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <DownLoadPopup v-model="state.showDownLoadPopup"></DownLoadPopup>

  <Tabbar></Tabbar>
</template>

<script setup lang="ts" name="HostList">
import { ref, reactive, onMounted, onActivated, nextTick } from "vue";
import Empty from "@/components/Empty.vue";
import Tabbar from "@/components/Tabbar/index.vue";
import {
  userrecommendList,
  userfollowfollowingList,
  userconfig,
  vipconfig,
  webconfig,
  userwallet,
} from "@/api/allApi";
import { useRouter } from "vue-router";
import { handleGo } from "@/common/fetchCommon";
import { onDeactivated } from "vue";
import SignPopup from "@/components/signPopup/index.vue";
import FirstChargeVipPopup from "@/components/firstChargeVipPopup/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import Cookies from "js-cookie";
import RechargePopup from "@/components/rechargePopup/index.vue";
import DownLoadPopup from "@/components/downLoadPopup/index.vue";
import SvgaShow from "@/components/svgaShow/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import { useUserDetailStore } from "@/stores/userDetail";

const { userDetail }: any = useUserDetailStore();

const active = ref(0);

const showSignPopup = ref(false);
const showChargePopup = ref(false);

const state = reactive<any>({
  offset: 0,
  finished: true,
  list: [],
  finishedTwo: false,
  offsetTwo: 0,
  followList: [],
  showVipPopup: false,
  showRechargePopup: false,
  showDownLoadPopup: false,
});

const tabsList: any = reactive([
  { title: "Discover", active: true },
  //   { title: "Nearby", active: false },
  { title: "Followed", active: false },
]);

const router = useRouter();

const { fetchData: configFetch, data: configData } = userconfig();

const { fetchData: configFetchTwo, data: configDataTwo } = vipconfig();

const { fetchData: webConfigFetch, data: webConfigData } = webconfig();

const { fetchData: wollectFetch, data: walletData } = userwallet();

const scrollY = ref<any>(window.pageYOffset);

const handleScroll = () => {
  scrollY.value = window.pageYOffset;
};

const { setVipConfigData } = useVipConfigStore();

onActivated(async () => {
  document.body.style.overflow = "auto";
  window.addEventListener("scroll", handleScroll);
  const scrollY = localStorage.getItem("hostListScroll") || 0;
  window.scrollTo({
    top: scrollY,
    behavior: "instant",
  });
  await Promise.all([
    configFetch(),
    configFetchTwo(),
    webConfigFetch(),
    wollectFetch(),
  ]);
  setVipConfigData(configDataTwo.value);

  const localVersion = localStorage.getItem("version");
  if (localVersion !== webConfigData.value.version) {
    localStorage.setItem("version", webConfigData.value.version);
    // window.location.reload();
    // return true;
  }
  const canVipCheckIn = Cookies.get("canVipCheckIn");

  if (configData.value.canVipCheckIn && !canVipCheckIn) {
    showSignPopup.value = true;
    Cookies.set("canVipCheckIn", true, { expires: 1 });
  }
  const showFirstVipPrompt = Cookies.get("showFirstVipPrompt");

  if (configData.value.showFirstVipPrompt && !showFirstVipPrompt) {
    showChargePopup.value = true;
    Cookies.set("showFirstVipPrompt", true, { expires: 1 });
  }

  const showDownLoadPopups = Cookies.get("showDownLoadPopups");
  if (
    walletData.value.wallet?.gold < 750 &&
    !showDownLoadPopups &&
    configData.value?.hasPayment
  ) {
    state.showDownLoadPopup = true;
    Cookies.set("showDownLoadPopups", true, { expires: 1 });
  }
});

onDeactivated(() => {
  localStorage.setItem("hostListScroll", scrollY.value);
  window.removeEventListener("scroll", handleScroll);
});

const handleClick = (index: number) => {
  tabsList.forEach((item: any, i: number) => {
    if (i === index) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
  active.value = index;
};

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
    `../../../public/ic_contry_${item?.region.toLowerCase()}.webp`,
    import.meta.url
  );
  const defaultImg: any = new URL(
    `../../../public/ic_contry_ind.webp`,
    import.meta.url
  );

  if (regions.includes(item?.region.toLowerCase())) {
    return path;
  } else {
    return defaultImg;
  }
};

const { fetchData, data, loading } = userrecommendList();

const {
  fetchData: fetchFollowList,
  data: followList,
  loading: loadingTwo,
} = userfollowfollowingList();

onMounted(() => {
  getList();
  getFolowList();
});

const getFolowList = async () => {
  await fetchFollowList({
    offset: state.offsetTwo,
  });
  if (followList.value) {
    state.offsetTwo += followList.value.list.length;
    state.finishedTwo = !followList.value.hasMore;
    state.followList = [...state.followList, ...followList.value.list];
  }
};

const getList = async () => {
  await fetchData({
    offset: state.offset,
  });
  if (data.value) {
    state.offset += data.value.list.length;
    state.finished = !data.value.hasMore;
    state.list = [...state.list, ...data.value.list];
  }
};

const onLoad = () => {
  if (active.value === 0) {
    getList();
  } else {
    getFolowList();
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  min-height: 100%;
  // background-color: #2c1a1a;
  .tabsBox {
    display: flex;
    // justify-content: center;
    align-items: center;
    padding-top: 20px;
    margin-bottom: 42px;
    padding-left: 32px;
    position: sticky;
    top: 0;
    z-index: 19;
    background-color: #2c1a1a;
    .tabs {
      font-family: "Inter", sans-serif;
      font-weight: bold;
      font-size: 36px;
      color: #aaaaaa;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .activeTabs {
      font-family: "Inter", sans-serif;
      font-weight: bold;
      font-size: 44px;
      color: #eb6300;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .line {
        width: 100%;
        min-height: 4px;
        background: #eb6300;
        border-radius: 4px 4px 4px 4px;
        margin-top: 14px;
      }
    }
    .activeTabs:nth-child(2) {
      margin-left: 40px;
      margin-right: 40px;
    }
    .tabs:nth-child(2) {
      margin-left: 40px;
      margin-right: 40px;
    }
  }
  .flexBox {
    display: flex;
    flex-wrap: wrap;
    padding-left: 32px;
    padding-right: 32px;
    gap: 22px;
    .itemBox {
      width: 332px;
      height: 498px;
      border-radius: 10px 10px 10px 10px;
      position: relative;
      .itemImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px 10px 10px 10px;
      }
      .caozuo {
        width: 88px;
        height: 88px;
        position: absolute;
        right: 18px;
        bottom: 16px;
        border-radius: 50%;
        background-color: #f9577e;
      }
      .bottmBox1 {
        position: absolute;
        display: flex;
        align-items: center;
        left: 24px;
        bottom: 14px;
        .bottmBox1LeftBox {
          display: flex;
          align-items: center;
          width: 62px;
          height: 26px;
          background: #ff5473;
          border-radius: 20px 20px 20px 20px;
          justify-content: space-between;
          .sex {
            margin-left: 8px;
            width: 18px;
            height: 18px;
          }
          .age {
            font-family: "SF Pro Display", sans-serif;
            font-weight: 500;
            font-size: 20px;
            color: #ffffff;
            margin-right: 8px;
          }
        }
        .contry {
          margin-left: 8px;
          width: 40px;
          height: 40px;
        }
      }
      .bottmBox2 {
        position: absolute;
        display: flex;
        align-items: center;
        left: 20px;
        top: 20px;
        // width: 104px;
        height: 40px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 28px 28px 28px 28px;
        padding: 10px;
        .yuan {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #00e397;
        }
        .yuan2 {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #c7c4cc;
        }
        .online {
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 24px;
          color: #ffffff;
          margin-right: 8px;
        }
        .name {
          font-family: "SF Pro Display", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #ffffff;
          width: 100px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .hostName {
        position: absolute;
        bottom: 50px;
        left: 24px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
      }
      .bottmBox3 {
        position: absolute;
        bottom: 14px;
        left: 24px;
        display: flex;
        align-items: center;
        .contry {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
        .contryName {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 22px;
          color: #ffffff;
        }
      }
    }
  }
  .fixedBox {
    position: fixed;
    bottom: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .btnBox {
      //   width: 368px;
      //   height: 100px;
      padding: 10px 60px 10px 60px;
      background: linear-gradient(180deg, #ff7c4c 0%, #ff5443 100%);
      border-radius: 36px 36px 36px 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      .btnBoxFont {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 36px;
        color: #ffffff;
      }
      .btnBoxBottom {
        display: flex;
        align-items: center;
        .coin {
          width: 40px;
          height: 40px;
        }
        .coinText {
          font-family: "SF Pro Text", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #ffffff;
        }
      }
      .crown {
        position: absolute;
        top: -50px;
        right: 35px;
        width: 60px;
        height: 60px;
      }
      .matchBox {
        display: flex;
        align-items: center;
        position: absolute;
        right: -10px;
        top: -40px;
        .matchCard {
          width: 60px;
          height: 60px;
        }
        .matchBoxFont {
          margin-left: 8px;
          font-family: "SF Pro Text", sans-serif;
          font-weight: bold;
          font-size: 32px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
