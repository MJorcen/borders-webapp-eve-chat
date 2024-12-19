<template>
  <transition name="slide-fade">
    <div v-if="props.modelValue" class="popup">
      <div class="imgBox">
        <div class="bgImgbox">
          <van-image
            :src="
              userDetail?.user?.id !== props?.wsData?.fromUser?.id
                ? props?.wsData?.fromUser?.avatar
                : props?.wsData?.toUser?.avatar
            "
            fit="cover"
            lazy-load
            radius="50"
            class="userImg"
          />
        </div>
        <div class="time">
          {{ formatSecondsToTime(props?.wsData?.currentTime || 0) }}
        </div>
        <img class="fenge" src="./assets/分割线@2x.png" />
        <div class="callCost">
          Call cost:<img
            class="w-[16px] h-[16px]"
            src="./assets/gold@2x.webp"
          />{{ props?.wsData?.call?.callCost || 0 }}
        </div>
        <div class="callCost">
          Gift cost:<img
            class="w-[16px] h-[16px]"
            src="./assets/gold@2x.webp"
          />{{ props?.wsData?.call?.giftCost || 0 }}
        </div>
        <div class="vipBox">
          <div class="vipFont">
            Get VIP for
            <span style="color: #e405ff">{{
              configData?.monthlyGoldBonus
            }}</span>
            coins immediately, receive total
            <span style="color: #e405ff">{{
              configData?.monthlyCheckInGoldValue
            }}</span>
            coins!!!
          </div>
          <div class="getBtn" @click="state.showVipPopup = true">Get</div>
        </div>
      </div>
      <div class="closeBtnBox">
        <div class="closeBtn" @click="emit('update:modelValue', false)">
          Confirm
        </div>
      </div>
    </div>
  </transition>
  <van-popup v-model:show="showReasonPopup" position="center" round>
    <div class="reasonBox">
      <div class="reasonTitle">
        Please select the hang up reason to get coins rewards!
      </div>
      <div class="bxBox">
        <img src="./assets/ic_Chest-close@2x.png" class="bxImg" />
      </div>
      <div class="reasonListBox">
        <div
          class="reasonItem"
          v-for="(item, index) in reasonList"
          @click="handleReason(item, index)"
        >
          <div class="reasonItemLeft">
            {{ item.name }}
          </div>
          <img
            v-if="!item.active"
            src="./assets/ic_circle@2x.png"
            class="w-[40px] h-[40px]"
          />
          <img
            v-else
            src="./assets/ic_check-circle@2x.png"
            class="w-[40px] h-[40px]"
          />
        </div>
      </div>
      <div class="bottomReasonBox">
        <div class="bottomReasonItemLeft" @click="showReasonPopup = false">
          Skip
        </div>
        <div class="bottomReasonItemRight" @click="handleSubmit">Submit</div>
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="freeBackPopups" position="center" round>
    <div class="feedBackBox">
      <div class="reasonTitle">
        Thanks for the feedback, we will return you 0 coins
      </div>
      <div class="bxBox">
        <img src="./assets/ic_Chest-close@2x.png" class="bxImg" />
      </div>
      <div class="feedBackBtnBox">
        <div class="okBtn" @click="freeBackPopups = false">OK</div>
      </div>
    </div>
  </van-popup>
  <RechargePopup v-model="state.showRechargePopup"></RechargePopup>
  <VipPopup :vipConfg="configData" v-model="state.showVipPopup"></VipPopup>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from "vue";
import { callfeedback, vipconfig } from "@/api/allApi";
import { showToast } from "vant";
import { formatSecondsToTime, getLocalUserDetail } from "@/common/utils";
import { useUserDetailStore } from "@/stores/userDetail";
import VipPopup from "@/components/vipPopup/index.vue";
import RechargePopup from "@/components/rechargePopup/index.vue";

interface Prop {
  modelValue: boolean;
  wsData?: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  wsData: {},
});

const state = reactive({
  showVipPopup: false,
  showRechargePopup: false,
});

const showReasonPopup = ref(false);

const freeBackPopups = ref(false);

const { userDetail }: any = useUserDetailStore();

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      getDetail();
    }
  }
);

const toggleBodyScroll = (disable: boolean) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

onUnmounted(() => {
  toggleBodyScroll(false);
});

watch(
  () => props.modelValue,
  (newValue) => {
    state.showRechargePopup = false;
    if (newValue) {
      // state.showRechargePopup = true;
      const userInfo = getLocalUserDetail();
      // if (userInfo?.user?.vipLevel === 0) {
      //   state.showVipPopup = true;
      // } else {
      //   state.showRechargePopup = true;
      // }

      toggleBodyScroll(newValue);
    } else {
      toggleBodyScroll(newValue);
    }
  },
  { immediate: true }
);

const { fetchData: configFetch, data: configData } = vipconfig();

const getDetail = async () => {
  await configFetch();
};

const reasonList = ref<any>([
  { name: "Other", active: true, value: 199 },
  { name: "Black Screen", active: false, value: 1 },
  { name: "No Voice", active: false, value: 2 },
  { name: "Nobody There", active: false, value: 3 },
  { name: "Video Call Stuck", active: false, value: 4 },
  { name: "Ignore Me", active: false, value: 5 },
]);

const handleReason = (item: any, index: number) => {
  reasonList.value = reasonList.value.map((it: any, i: number) => {
    if (i === index) {
      it.active = true;
    } else {
      it.active = false;
    }
    return it;
  });
};

const { fetchData, msg, success, data } = callfeedback();

const handleSubmit = async () => {
  const reason = reasonList.value.filter((item: any) => {
    return item.active;
  });
  await fetchData({
    callId: props.callId,
    reason: reason[0].value,
  });
  if (success.value) {
    showToast("Submit successfully!");
    showReasonPopup.value = false;
    freeBackPopups.value = true;
  } else {
    showToast(msg.value);
  }
};

const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="scss" scoped>
.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  /* display: flex;
  justify-content: center;
  align-items: flex-end; */
  transition: all 0.3s ease;
  z-index: 40;
  // position: relative;
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

.imgBox {
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  padding-top: 100px;
  .bgImgbox {
    width: 463px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-image: url(./assets/bg@2x.png);
    background-size: 100% 100%;
    // background-size: cover;
    background-repeat: no-repeat;
    .userImg {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 4px solid #ffffff;
    }
  }
  .time {
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 40px;
    color: #ffffff;
  }
  .fenge {
    margin-top: 8px;
    width: 400px;
    height: 2px;
  }
  .callCost {
    margin-top: 32px;
    width: 480px;
    height: 48px;
    background: linear-gradient(
      90deg,
      rgba(255, 200, 117, 0) 0%,
      #ffc875 50%,
      rgba(255, 200, 117, 0) 100%
    );
    border-radius: 8px 8px 8px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "SF Pro Text", sans-serif;
    font-weight: bold;
    font-size: 28px;
    color: #ffffff;
  }
  .vipBox {
    margin-top: 50px;
    width: 628px;
    height: 364px;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
    background-image: url(./assets/vip@2x.png);
    background-size: 100% 100%;
    // background-size: cover;
    background-repeat: no-repeat;
    padding-top: 60px;
    .vipFont {
      //   width: 532px;
      //   height: 100px;
      padding-left: 48px;
      padding-right: 48px;
      height: 76px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #562b00;
      line-height: 38px;
      text-align: center;
      margin-bottom: 60px;
    }
    .getBtn {
      width: 320px;
      height: 88px;
      background: #ffffff;
      border-radius: 44px 44px 44px 44px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: bold;
      font-size: 40px;
      color: #562b00;
      line-height: 88px;
      text-align: center;
    }
  }
}
.closeBtnBox {
  position: fixed;
  bottom: 20px;
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
  .closeBtn {
    height: 100px;
    background: #eb6300;
    // background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
    border-radius: 16px 16px 16px 16px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    font-size: 40px;
    color: #ffffff;
    line-height: 100px;
    text-align: center;
  }
}
.reasonBox {
  width: 622px;
  height: 1028px;
  background: linear-gradient(180deg, #fff3de 0%, #ffffff 100%);
  border-radius: 40px 40px 40px 40px;
  padding-top: 80px;
  overflow-y: scroll;
  padding-bottom: 40px;
  .reasonTitle {
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 36px;
    color: #ff4d42;
    line-height: 42px;
    text-align: center;
    padding-left: 58px;
    padding-right: 58px;
    margin-bottom: 20px;
  }
  .bxBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 50px;
    .bxImg {
      width: 200px;
      height: 200px;
    }
  }
  .reasonListBox {
    padding-left: 88px;
    padding-right: 88px;
    .reasonItem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .reasonItemLeft {
        font-family: "SF Pro Text", sans-serif;
        font-weight: 400;
        font-size: 32px;
        color: #404040;
      }
    }
  }
  .bottomReasonBox {
    margin-top: 48px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 54px;
    padding-right: 54px;
    .bottomReasonItemLeft {
      width: 244px;
      height: 68px;
      background: #f2f2f2;
      border-radius: 12px 12px 12px 12px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 32px;
      color: #ff4d42;
      line-height: 68px;
      text-align: center;
    }
    .bottomReasonItemRight {
      width: 244px;
      height: 68px;
      background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
      border-radius: 12px 12px 12px 12px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 500;
      font-size: 32px;
      color: #ffffff;
      line-height: 68px;
      text-align: center;
    }
  }
}
.feedBackBox {
  width: 622px;
  height: 584px;
  background: linear-gradient(180deg, #fff3de 0%, #ffffff 100%);
  border-radius: 40px 40px 40px 40px;
  padding-top: 80px;
  .reasonTitle {
    font-family: "SF Pro Display", sans-serif;
    font-weight: bold;
    font-size: 36px;
    color: #ff4d42;
    line-height: 42px;
    text-align: center;
    padding-left: 58px;
    padding-right: 58px;
    margin-bottom: 20px;
  }
  .bxBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 50px;
    .bxImg {
      width: 200px;
      height: 200px;
    }
  }
  .feedBackBtnBox {
    width: 100%;
    padding-left: 62px;
    padding-right: 62px;
  }
  .okBtn {
    height: 80px;
    background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
    border-radius: 16px 16px 16px 16px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 500;
    font-size: 32px;
    color: #ffffff;
    line-height: 80px;
    text-align: center;
  }
}
</style>
