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
                radius="12"
                class="itemImg"
                :src="item?.user?.avatar"
                lazy-load
              ></van-image>
              <img
                class="caozuo"
                src="./assets/caozuo.png"
                v-if="item.user.inCall === 0 && item.user.active === 1"
                @click.stop="
                  () => {
                    handleGo(item).then((res) => {
                      if (!res) {
                        state.showRechargePopup = true;
                      }
                    });
                  }
                "
              />
              <img
                v-else
                class="caozuo"
                src="./assets/op2.png"
                @click.stop="
                  () => {
                    router.push({
                      name: 'ChatRoom',
                      query: { user: JSON.stringify(item.user) },
                    });
                  }
                "
              />

              <div class="bottmBox1">
                <div class="bottmBox1LeftBox">
                  <img class="sex" src="./assets/sex.png" />
                  <div class="age">{{ item?.user?.age }}</div>
                </div>
                <!-- 国徽 -->
                <img class="contry" :src="getCountryImg(item.user)" alt="" />
              </div>
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
                <div class="name">{{ item.user.nickname }}</div>
              </div>
            </div>
          </div>
        </van-list>
        <Empty v-else></Empty>
      </van-pull-refresh>
    </div>
    <div v-else>
      <van-pull-refresh
        style="min-height: 700px"
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
              <img
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
              />
              <img
                v-else
                class="caozuo"
                src="./assets/op2.png"
                @click.stop="
                  () => {
                    router.push({
                      name: 'ChatRoom',
                      query: { user: JSON.stringify(item) },
                    });
                  }
                "
              />

              <div class="bottmBox1">
                <div class="bottmBox1LeftBox">
                  <img class="sex" src="./assets/sex.png" />
                  <div class="age">{{ item?.age }}</div>
                </div>
                <!-- 国徽 -->
                <img class="contry" :src="getCountryImg(item)" alt="" />
              </div>
              <div class="bottmBox2">
                <div class="yuan" v-if="item?.onDuty"></div>
                <div class="yuan2" v-else></div>

                <div class="name">{{ item?.nickname }}</div>
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
} from "@/api/allApi";
import { useRouter } from "vue-router";
import { handleGo } from "@/common/fetchCommon";
import { onDeactivated } from "vue";
import SignPopup from "@/components/signPopup/index.vue";
import FirstChargeVipPopup from "@/components/firstChargeVipPopup/index.vue";
import VipPopup from "@/components/vipPopup/index.vue";
import Cookies from "js-cookie";
import RechargePopup from "@/components/rechargePopup/index.vue";

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

const scrollY = ref<any>(window.pageYOffset);

const handleScroll = () => {
  scrollY.value = window.pageYOffset;
};

onActivated(async () => {
  document.body.style.overflow = "auto";
  window.addEventListener("scroll", handleScroll);
  const scrollY = localStorage.getItem("hostListScroll") || 0;
  window.scrollTo({
    top: scrollY,
    behavior: "instant",
  });
  await configFetch();
  await configFetchTwo();
  await webConfigFetch();
  const localVersion = localStorage.getItem("version");
  if (localVersion !== webConfigData.value.version) {
    localStorage.setItem("version", webConfigData.value.version);
    window.location.reload();
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
  background-color: #fff;
  .tabsBox {
    display: flex;
    // justify-content: center;
    align-items: center;
    padding-top: 20px;
    margin-bottom: 42px;
    padding-left: 32px;
    position: sticky;
    top: 0;
    z-index: 29;
    background-color: #ffffff;
    .tabs {
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 40px;
      color: #aaaaaa;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .activeTabs {
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 40px;
      color: #ff4d42;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
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
      border-radius: 32px 32px 32px 32px;
      position: relative;
      .itemImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 32px 32px 32px 32px;
      }
      .caozuo {
        width: 88px;
        height: 88px;
        position: absolute;
        right: 18px;
        bottom: 16px;
      }
      .bottmBox1 {
        position: absolute;
        display: flex;
        align-items: center;
        left: 16px;
        bottom: 62px;
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
        left: 16px;
        bottom: 20px;
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
          background-color: #ffb443;
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
