<template>
  <div class="bigBox">
    <van-nav-bar
      title=""
      left-text=""
      fixed
      :border="true"
      style="background-color: #2c1a1a; color: #fff"
    >
      <template #title>
        <div class="titleName">Live streaming</div>
      </template>
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
    </van-nav-bar>
    <div class="topBox">Start Video chat with them</div>
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
        finished-text="Nothing More"
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
                  name: 'LiveRoom',
                  query: { index: Number(index) },
                });
              }
            "
          >
            <van-image
              fit="cover"
              radius="8"
              class="itemImg"
              :src="item?.portrait"
              lazy-load
            ></van-image>
            <div
              class="caozuo"
              @click.stop="
                () => {
                  handleGo({
                    user: {
                      inCall: 0,
                      active: 1,
                      id: item?.id,
                    },
                  }).then((res) => {
                    if (!res) {
                      if (userDetail?.user?.vipLevel === 0) {
                        state.showVipPopup = true;
                      } else {
                        // state.showRechargePopup = true;
                        state.showCallDownLoadPopup = true;
                      }
                    } else {
                      state.showCallDownLoadPopup = true;
                    }
                  });
                }
              "
            >
              <SvgaShow
                :divId="`demo${item?.id}${index}`"
                :url="'https://fs.duome.live/app/animation/call_animation_nobg.svga'"
              ></SvgaShow>
            </div>

            <div class="bottmBox2">
              <!-- <SvgaShow
                :divId="`demos${item?.id}${index}`"
                :width="30"
                :height="20"
                :url="'https://fs.duome.live/app/live/live.svga'"
              ></SvgaShow> -->
              <img class="liveImg" src="./assets/Group14669@2x.webp" />
              <div class="online">Live</div>
            </div>
            <div class="hostName">{{ item?.nickname }}</div>
            <div class="bottmBox3">
              <img class="contry" :src="getCountryImg(item)" alt="" />
              <div class="contryName">{{ item?.region }}·{{ item?.age }}</div>
            </div>
          </div>
        </div>
      </van-list>
      <Empty v-else></Empty>
    </van-pull-refresh>
    <CallDownLoadPopup
      v-model="state.showCallDownLoadPopup"
    ></CallDownLoadPopup>
    <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Empty from "@/components/Empty.vue";
import { handleGo } from "@/common/fetchCommon";
import { useUserDetailStore } from "@/stores/userDetail";
import { livelistPage } from "@/api/allApi";
import SvgaShow from "@/components/svgaShow/index.vue";
import CallDownLoadPopup from "@/components/callDownLoadPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import VipPopup from "@/components/vipPopup/index.vue";

const router = useRouter();

const { userDetail }: any = useUserDetailStore();
const { vipConfigData } = useVipConfigStore();

const state = reactive<any>({
  offset: 0,
  finished: true,
  list: [],
  showCallDownLoadPopup: false,
  showVipPopup: false,
});

onMounted(() => {
  getList();
});

const { fetchData, data, loading } = livelistPage();

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
  getList();
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
    `/public/ic_contry_${item?.region.toLowerCase()}.webp`,
    import.meta.url
  );
  const defaultImg: any = new URL(
    `/public/ic_contry_ind.webp`,
    import.meta.url
  );

  if (regions.includes(item?.region.toLowerCase())) {
    return path;
  } else {
    return defaultImg;
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  padding-top: 100px;
  .titleName {
    font-family: "Inter", sans-serif;
    font-weight: normal;
    font-size: 44px;
    color: #eb6300;
  }
  .topBox {
    width: 100%;
    font-family: "Inter", sans-serif;
    font-weight: 500;
    font-size: 36px;
    color: #ffffff;
    text-align: center;
    padding-top: 28px;
    padding-bottom: 28px;
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
      .disBox {
        position: absolute;
        display: flex;
        align-items: center;
        left: 20px;
        bottom: 98px;
        // width: 100px;
        padding: 10px;
        height: 32px;
        background: linear-gradient(180deg, #29191a 0%, #481816 100%);
        border-radius: 28px 28px 28px 28px;
        display: flex;
        align-items: center;
        padding-left: 10px;
        .disImg {
          width: 20px;
          height: 20px;
          margin-right: 4px;
        }
        .disText {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 20px;
          color: #ffffff;
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
        .liveImg {
          width: 15px;
          height: 20px;
          margin-right: 5px;
        }
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
        width: 200px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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
}
</style>
