<template>
  <transition name="slide-fade">
    <div class="bigBox" v-if="props.modelValue">
      <van-nav-bar
        style="background-color: #0e1227; color: #fff"
        title=""
        left-text=""
        fixed
        :border="false"
      >
        <template #left>
          <div class="topLeftBox">
            <van-icon
              name="arrow-left"
              size="18"
              color="#fff"
              @click="emit('update:modelValue', false)"
            />
          </div>
        </template>
      </van-nav-bar>
      <img class="bgImg" src="./assets/bg.webp" />
      <div class="contentBoxBig">
        <div class="contentBox">
          <van-count-down :time="time">
            <template #default="timeData">
              <div class="contentBoxTop">
                <div class="cutDownBgImg">{{ timeData.hours }}</div>
                <div class="cutDownFont">H</div>
                <div class="cutDownBgImg">{{ timeData.minutes }}</div>
                <div class="cutDownFont">M</div>
                <div class="cutDownBgImg">{{ timeData.seconds }}</div>
                <div class="cutDownFont">S</div>
              </div>
            </template>
          </van-count-down>
          <div class="cutDownText">
            You cannot match any more users today. your free quota will be reset
            when the countdown timer has end .
          </div>
          <div class="cutDownText">VIP members can match unlimited times</div>
          <div class="btnBox">
            <div
              class="btn"
              @click="
                () => {
                  state.showVipPopup = true;
                }
              "
            >
              Get Vip
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <VipPopup
    :show-video="false"
    :vipConfg="vipConfigData"
    v-model="state.showVipPopup"
  ></VipPopup>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import VipPopup from "@/components/vipPopup/index.vue";
import { useVipConfigStore } from "@/stores/vipConfig";
import { useRouter } from "vue-router";

const { vipConfigData } = useVipConfigStore();

const router = useRouter();

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const state = reactive({
  showVipPopup: false,
});

const getRemainingMilliseconds = () => {
  // 获取当前时间
  const now: any = new Date();

  // 创建下一天零点的时间
  const nextDay: any = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 日期加1，表示下一天
    0,
    0,
    0,
    0 // 设置时间为零点
  );

  // 计算剩余时间（毫秒）
  const remainingMilliseconds = nextDay - now;

  return remainingMilliseconds;
};

const time = computed(() => {
  return getRemainingMilliseconds();
});

// console.log(`output->`, getRemainingMilliseconds());
// debugger;
const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="scss" scoped>
::v-deep(.van-nav-bar__title) {
  color: #fff !important;
  font-family: "ABeeZee", sans-serif !important;
  font-weight: 400 !important;
  font-size: 40px !important;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.bigBox {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  // background-image: url(./assets/bg.webp);
  // background-size: 100% 100%;
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.3s ease;
  background-color: #3a4466;
  z-index: 40;
  .bgImg {
    width: 100%;
    height: auto;
  }
  .contentBoxBig {
    padding-left: 40px;
    padding-right: 40px;
    width: 100%;
    position: fixed;
    bottom: 60px;
    .contentBox {
      //   height: 970px;
      background: #fff9e4;
      border-radius: 40px 40px 40px 40px;
      border: 10px solid #ffdfc6;
      padding: 44px 16px 44px 16px;
      .contentBoxTop {
        display: flex;
        align-items: center;
        justify-content: center;
        .cutDownBgImg {
          width: 82px;
          height: 82px;
          background-image: url(./assets/Rectangle34625197@2x.webp);
          background-size: 100% 100%;
          // background-size: cover;
          background-repeat: no-repeat;
          margin-right: 22px;
          display: flex;
          align-items: center;
          justify-content: center;

          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 40px;
          color: #ffffff;
        }
        .cutDownFont {
          margin-right: 22px;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 40px;
          color: #bc4700;
        }
      }
      .cutDownText {
        margin-top: 64px;
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 48px;
        color: #333333;
        text-align: center;
      }
      .btnBox {
        display: flex;
        align-items: center;
        justify-items: center;
        width: 100%;
        padding-left: 44px;
        padding-right: 44px;
        .btn {
          margin-top: 20px;
          margin-bottom: 30px;
          width: 100%;
          height: 100px;
          background: #ea8a55;
          border-radius: 64px;
          font-family: "Inter", sans-serif;
          font-weight: normal;
          font-size: 40px;
          color: #fefefe;
          line-height: 100px;
          text-align: center;
        }
      }
    }
  }
}
</style>
