<template>
  <div class="bigBox">
    <div class="flexTopBox">
      <div class="flexTopBoxLeft">Current round: 500000</div>
      <div class="flexTopBoxRight">
        <img src="./assets/Group22688@2x.webp" class="zhangdanImg" />
        <img src="./assets/Group22687@2x.webp" class="musicImg" />
      </div>
    </div>
    <van-image
      round
      fit="cover"
      radius="50"
      lazy-load
      src="https://img1.baidu.com/it/u=1653751609,236581088&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1730480400&t=72d85d8af78c6c6c4cbe6f76c8d719f8"
      alt=""
      class="userImg"
    ></van-image>
    <div class="topBox">
      <div class="posBox">
        <img src="./assets/Group_22717@2x.webp" class="zhuanImg" />
        <div
          :class="item.isActive ? 'itemBgBoxActive' : 'itemBgBox'"
          :style="item.style"
          v-for="(item, index) in state.iconList"
          :key="index"
        >
          <img :src="item.icon" class="itemIconClass" />
        </div>
      </div>
    </div>
    <div class="goldBig">
      <div class="goldBox">
        <div class="goldBoxTopFontBig">
          <div class="goldBoxTopFont">
            Choose the amount of wager> then choose food
          </div>
        </div>

        <div class="goldFlex">
          <div
            :class="item.active ? 'goldItemActive' : 'goldItem'"
            v-for="(item, index) in state.goldList"
            :key="index"
            @click="handleChoseGold(index)"
          >
            <img :src="item.img" class="goldImg" />
            <div class="nums">{{ item.nums }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBox">
      <div class="bottomBoxTop1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import icon1 from "./assets/Slice359@2x1.webp";
import icon2 from "./assets/Slice359@2x2.webp";
import icon3 from "./assets/Slice359@2x3.webp";
import icon4 from "./assets/Slice359@2x4.webp";
import icon5 from "./assets/Slice359@2x5.webp";
import icon6 from "./assets/Slice359@2x6.webp";
import icon7 from "./assets/Slice359@2x7.webp";
import icon8 from "./assets/Slice359@2x8.webp";
import gold1 from "./assets/100_chip2@2x.webp";
import gold2 from "./assets/500_chip1@2x.webp";
import gold3 from "./assets/1K_chip2@2x.webp";
import gold4 from "./assets/10K_chip3@2x.webp";
import gold5 from "./assets/50K_chip1@2x.webp";

const state: any = reactive({
  iconList: [
    {
      icon: icon1,
      style: { top: "-75px", left: "60px" },
    },
    {
      icon: icon2,
      style: { top: "-40px", left: "-45px" },
    },
    {
      icon: icon3,
      style: { top: "70px", left: "-85px" },
    },
    {
      icon: icon4,
      style: { bottom: "40px", left: "-55px" },
    },
    {
      icon: icon5,
      style: { bottom: "0px", left: "60px" },
    },
    {
      icon: icon6,
      style: { bottom: "40px", right: "-45px" },
    },
    {
      icon: icon7,
      style: { top: "70px", right: "-85px" },
    },
    {
      icon: icon8,
      style: { top: "-33px", right: "-47px" },
    },
  ],
  goldList: [
    {
      img: gold1,
      nums: 10,
      active: true,
    },
    {
      img: gold2,
      nums: 100,
    },
    {
      img: gold3,
      nums: 1000,
    },
    {
      img: gold4,
      nums: 10000,
    },
    {
      img: gold5,
      nums: 50000,
    },
  ],
});

const targetIndex = ref(5); // 传入的目标索引
const duration = 800; // 总持续时间（毫秒）

const activateIndex = (index: number, duration: number) => {
  let currentIndex = 0;
  let interval: any = 0;
  let timerEnded = false;
  interval = setInterval(() => {
    state.iconList[currentIndex].isActive = false;
    currentIndex =
      (currentIndex - 1 + state.iconList.length) % state.iconList.length; // 逆时针
    // currentIndex = (currentIndex + 1) % state.iconList.length; // 顺时针
    state.iconList[currentIndex].isActive = true;

    if (currentIndex === index && timerEnded) {
      clearInterval(interval);
      // state.iconList.forEach((item, idx) => {
      //   item.isActive = idx === index;
      // });
    }
  }, duration / state.iconList.length);

  // 确保最后停留在指定的索引
  setTimeout(() => {
    timerEnded = true;
  }, 3000);
};

const handleChoseGold = (index: number): void => {
  state.goldList.forEach((item: any, idx: number) => {
    item.active = idx === index;
  });
};

onMounted(() => {
  activateIndex(targetIndex.value, duration);
});
</script>
<style lang="scss" scoped>
.bigBox {
  min-height: 100vh;
  padding-top: 300px;
  background-image: url("./assets/image@2x.webp");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100vw;
  overflow-x: hidden;
  position: relative;
  .flexTopBox {
    position: absolute;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    width: 100%;
    .flexTopBoxLeft {
      font-family: "PingFang SC", sans-serif;
      font-weight: 500;
      font-size: 24px;
      color: #fdfdfd;
      line-height: 28px;
      text-stroke: 2px #423e48;
      padding-right: 26px;
    }
    .flexTopBoxRight {
      display: flex;
      align-items: center;
      .zhangdanImg {
        width: 70px;
        height: 66px;
        margin-right: 22px;
      }
      .musicImg {
        width: 70px;
        height: 66px;
      }
    }
  }
  .userImg {
    position: absolute;
    top: 84px;
    left: 12px;
    width: 120px;
    height: 120px;
  }
  .topBox {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .posBox {
      position: relative;
      .zhuanImg {
        width: 438px;
        height: 624px;
      }
      .itemBgBox {
        background-image: url("./assets/Group22683@2x.webp");
        background-repeat: no-repeat;
        background-size: cover;
        width: 205px;
        height: 174px;
        position: absolute;
        //top: -150px;
        //left: 123px;
        display: flex;
        align-items: center;
        justify-content: center;
        .itemIconClass {
          width: 110px;
          height: 110px;
        }
      }
      .itemBgBoxActive {
        background-image: url("./assets/Property1=Variant4@2x.webp");
        background-repeat: no-repeat;
        background-size: cover;
        width: 205px;
        height: 174px;
        position: absolute;
        //top: -150px;
        //left: 123px;
        display: flex;
        align-items: center;
        justify-content: center;
        .itemIconClass {
          width: 110px;
          height: 110px;
        }
      }
    }
  }
  .goldBig {
    padding-left: 26px;
    padding-right: 26px;
    .goldBox {
      background-image: url("./assets/Group22705@2x.webp");
      background-repeat: no-repeat;
      background-size: cover;
      width: 100%;
      height: 184px;

      // flex-direction: column;
      .goldBoxTopFontBig {
        width: 100%;
        text-align: center;
        // margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        // padding-top: 10px;
        .goldBoxTopFont {
          width: 356px;
          height: 56px;
          font-family: "PingFang SC", sans-serif;
          font-weight: 500;
          font-size: 20px;
          color: #fdfdfd;
          line-height: 23px;
          text-align: center;
          text-stroke: 2px #423e48;
          -webkit-text-stroke: 2px #fdfdfd;
        }
      }

      .goldFlex {
        margin-top: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding-left: 55px;
        padding-right: 55px;
        .goldItem {
          background-image: url("./assets/Group22701@2x.webp");
          background-repeat: no-repeat;
          background-size: cover;
          width: 104px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .goldImg {
            margin-top: 15px;
            width: 40px;
            height: 40px;
          }
          .nums {
            font-family: "PingFang SC", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #ffffff;
          }
        }
        .goldItemActive {
          background-image: url("./assets/Group22700@2x.webp");
          background-repeat: no-repeat;
          background-size: cover;
          width: 104px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .goldImg {
            margin-top: 15px;
            width: 40px;
            height: 40px;
          }
          .nums {
            font-family: "PingFang SC", sans-serif;
            font-weight: 500;
            font-size: 24px;
            color: #b8610b;
          }
        }
      }
    }
  }
  .bottomBox {
    .bottomBoxTop1 {
      height: 502px;
      background: linear-gradient(135deg, #e2cfc4 0%, #957b6c 100%);
      box-shadow: inset 0px 8px 8px 0px #ffffef;
      border-radius: 40px 40px 40px 40px;
    }
  }
}
</style>
