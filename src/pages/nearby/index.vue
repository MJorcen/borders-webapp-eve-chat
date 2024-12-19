<template>
  <div class="bigBox">
    <div class="kongBox2">
      <div class="title">Nearby</div>
      <div class="mapBig">
        <div class="minePosition">
          <van-image
            round
            fit="cover"
            radius="50"
            lazy-load
            :src="userDetail?.user?.avatar"
            alt=""
            class="hostImg"
          ></van-image>
          <img src="./assets/Polygon22@2x.webp" class="sanjiao" />
          <img class="dian" src="./assets/Ellipse_1894@2x.webp" />
          <div class="mineFlex">
            <img src="./assets/Vector@2x.webp" class="icon" />
            <div class="name">
              {{ userDetail?.user?.nickname }}{{ userDetail?.user?.region }}
            </div>
          </div>
        </div>

        <div
          class="userPosition"
          v-for="(item, index) in state.list"
          :key="index"
          :style="item.positionStyle"
        >
          <van-image
            @click="handleClick()"
            round
            fit="cover"
            radius="50"
            lazy-load
            :src="item?.avatar"
            alt=""
            class="hostImg"
          ></van-image>
          <img src="./assets/Polygon222@2x.webp" class="sanjiao" />
          <img class="dian" src="./assets/Ellipse_1894@2x.webp" />
          <div class="mineFlex">
            <div class="name">{{ item?.nearbyDistance }}km</div>
          </div>
        </div>
      </div>
      <div class="fontBig">
        <div class="font">
          According to your current location, we recommend beautiful girls
          nearby
        </div>
      </div>
    </div>
  </div>
  <VipPopup :vipConfg="vipConfigData" v-model="state.showVipPopup"></VipPopup>
  <DownLoadPopup
    :tips="'Download the APP for free calls'"
    v-model="state.showDownLoadPopup"
  ></DownLoadPopup>
  <Tabbar></Tabbar>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import Tabbar from "@/components/Tabbar/index.vue";
import { getLocalUserDetail } from "@/common/utils";
import { distance10, distance20, distance30 } from "./utils";
const userDetail = getLocalUserDetail();
import { matchbeforePaymentlistAnchors } from "@/api/allApi";
import BigNumber from "bignumber.js";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import DownLoadPopup from "@/components/downLoadPopup/index.vue";

const { vipConfigData } = useVipConfigStore();

// 大于30公里的
//top left [20,20] 【500,40】 [100,10]  [160,10] [300,10]
//top right [20,20] 【500,40】 [100,10]  [160,10] [300,10]

// 20km 的
//top left  【60,60】  [120,100] [340,100]
//top right  【-21,300] [120,100]  [340,100]
//  bottom right [-61,300]

// 10km 的
// top left [240,150] [180,170]
// top right [240,150] [180,170]

const { fetchData: fetchMatchbeforePaymentlistAnchors, data: beforeAnchors } =
  matchbeforePaymentlistAnchors();

const state = reactive<any>({
  list: [],
  showDownLoadPopup: false,
});

const handleClick = () => {
  state.showDownLoadPopup = true;
};

let timer: any = ref(null);

onMounted(async () => {
  handleGetNearby();
});

const handleGetNearby = async () => {
  await fetchMatchbeforePaymentlistAnchors({
    scene: "nearby",
  });
  state.list = beforeAnchors.value?.list || [];
  state.list = state.list.map((item: any) => {
    if (
      Number(new BigNumber(item.nearbyDistance).div(1000)) >= 1 &&
      Number(new BigNumber(item.nearbyDistance).div(1000)) <= 3
    ) {
      item.nearbyDistance = new BigNumber(item.nearbyDistance)
        .div(1000)
        .toFixed(2);
      item.positionStyle = getRandomObject(distance10);
    } else if (
      Number(new BigNumber(item.nearbyDistance).div(1000)) > 3 &&
      Number(new BigNumber(item.nearbyDistance).div(1000)) <= 6
    ) {
      item.nearbyDistance = new BigNumber(item.nearbyDistance)
        .div(1000)
        .toFixed(2);
      item.positionStyle = getRandomObject(distance20);
    } else {
      item.nearbyDistance = new BigNumber(item.nearbyDistance)
        .div(1000)
        .toFixed(2);
      item.positionStyle = getRandomObject(distance30);
    }
    return item;
  });
};

timer.value = setInterval(() => {
  handleGetNearby();
}, 5000);

onUnmounted(() => {
  clearInterval(timer.value);
});

const getRandomObject = (arr: any) => {
  const randomIndex = Math.floor(Math.random() * arr.length); // 获取随机索引
  return arr[randomIndex];
};
</script>
<style lang="scss" scoped>
.bigBox {
  width: 100%;
  height: 100%;

  .kongBox2 {
    width: 100%;
    background: linear-gradient(180deg, #29191a 0%, #481816 100%);
    height: 100vh;
    .title {
      font-family: "Inter", sans-serif;
      display: flex;
      align-items: center;
      padding-left: 32px;
      font-weight: normal;
      font-size: 44px;
      color: #eb6300;
      height: 120px;
      border-bottom: 1px solid #575050;
      margin-bottom: 20px;
    }
    .mapBig {
      background-image: url(./assets/Group1171274968@2x.webp);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 100%;
      height: 800px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      position: relative;
      .minePosition {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .hostImg {
          width: 158px;
          height: 158px;
          border-radius: 50%;
          border: 4px solid #eb6300;
        }
        .sanjiao {
          margin-top: -35px;
          width: 65px;
          height: 47px;
          margin-bottom: 5px;
        }
        .dian {
          width: 18px;
          height: 18px;
        }
        .mineFlex {
          display: flex;
          align-items: center;
          .icon {
            width: 20px;
            height: 26px;
            margin-right: 7px;
          }
          .name {
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #ffffff;
          }
        }
      }
      .userPosition {
        position: absolute;

        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .hostImg {
          width: 158px;
          height: 158px;
          border-radius: 50%;
          border: 4px solid #f9dbdb;
        }
        .sanjiao {
          margin-top: -35px;
          width: 65px;
          height: 47px;
          margin-bottom: 5px;
        }
        .dian {
          width: 18px;
          height: 18px;
        }
        .mineFlex {
          display: flex;
          align-items: center;
          .icon {
            width: 20px;
            height: 26px;
            margin-right: 7px;
          }
          .name {
            font-family: "Inter", sans-serif;
            font-weight: 400;
            font-size: 32px;
            color: #ffffff;
          }
        }
      }
    }
    .fontBig {
      position: fixed;
      bottom: 200px;
      display: flex;
      align-items: center;
      text-align: center;
      font-family: "Inter", sans-serif;
      font-weight: 400;
      font-size: 36px;
      color: #ffffff;
    }
  }
}
</style>
