<template>
  <transition name="slide-fade">
    <div v-if="props.modelValue" class="popup">
      <div class="videoBox" v-if="state.showVideo">
        <!-- ref="videoRef"
          width="100%"
          height="100%"
          :src="props.wsData.call?.videoPath"
          class="videoClass"
          @ended="onVideoEnded"
          autoplay
          muted -->
        <video
          width="100%"
          height="100%"
          x5-video-player-type="h5"
          :autoplay="true"
          :loop="true"
          :webkit-playsinline="true"
          :playsinline="true"
          :controls="false"
          @ended="onVideoEnded"
          :src="props.wsData.call?.videoPath"
          class="videoClass"
          ref="videoRef"
        >
          您的浏览器不支持视频标签。
        </video>
        <img
          src="./assets/ic_calling_quit@2x.png"
          class="closeImgMq"
          alt=""
          @click="handleCallHangUp"
        />
      </div>
      <div v-else class="freeBox">
        <!-- <img
          src="./assets/ic_calling_quit@2x.png"
          class="closeImg"
          alt=""
          @click="handleCallHangUp"
          v-if="state.showVideo"
        /> -->
        <van-image
          :src="props?.wsData?.fromUser?.avatar"
          class="hostImg"
          fit="fill"
        />
        <div class="bottomBoxConnect">
          <div class="bottomBoxInvite">
            <img
              src="./assets/ic_phone-hangup@2x.png"
              alt=""
              class="bottomBoxInviteGua"
              @click.stop="handleCallHangUp"
            />
            <div class="bottomBoxInviteRecive">
              <img
                src="./assets/ic_phone-answer_l@2x.png"
                alt=""
                class="bottomBoxInviteReciveImg"
                @click="handleCallPickUp"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted, nextTick, onMounted } from "vue";
import { showLoadingToast, showToast } from "vant";
import { freeCallpickUp, freeCallhangUp } from "@/api/allApi";

interface Prop {
  modelValue: boolean;
  wsData: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  wsData: {},
});

const state = reactive({
  src: `${import.meta.env.VITE_APP_BASE_APIW}/蝶梦恋人.mp4`,
  showVideo: false,
});

const toggleBodyScroll = (disable: boolean) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

onUnmounted(() => {
  toggleBodyScroll(false);
});

watch(
  () => props.modelValue,
  (newValue) => {
    state.showVideo = false;
    toggleBodyScroll(newValue);
  },
  { immediate: true }
);

const videoRef = ref<HTMLVideoElement>();

onMounted(() => {
  nextTick(() => {
    console.log(`output->`, videoRef.value);
    if (videoRef.value) {
      //   videoRef.value?.play();
    }
  });
});

const {
  fetchData: pickUpFetch,
  msg: pickUpMsg,
  success: pickUpSuccess,
} = freeCallpickUp();

const handleCallPickUp = async () => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await pickUpFetch({
    callId: props.wsData.call?.id,
  });
  if (pickUpSuccess.value) {
    state.showVideo = true;
    showToast("Success");
  } else {
    showToast(pickUpMsg.value);
  }
};

const {
  fetchData: hangUpFetch,
  msg: hangUpMsg,
  success: hangUpSuccess,
} = freeCallhangUp();

const handleCallHangUp = async () => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await hangUpFetch({
    callId: props.wsData.call?.id,
  });
  if (hangUpSuccess.value) {
    showToast("Success");
    emit("update:modelValue", false);
  } else {
    emit("update:modelValue", false);
    showToast(hangUpMsg.value);
  }
};

const onVideoEnded = () => {
  emit("update:modelValue", false);
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
  background-color: rgba(0, 0, 0, 1);
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

.videoBox {
  width: 100%;
  height: 100vh;
  position: relative;
  .videoClass {
    width: 100%;
    height: 100vh;
  }
  .closeImgMq {
    width: 96px;
    position: absolute;
    top: 20px;
    right: 20px;
    height: 96px;
    z-index: 20;
  }
}

.freeBox {
  width: 100%;
  height: 100vh;
  position: relative;
  .hostImg {
    width: 100%;
    height: 100vh;
  }
  .closeImg {
    width: 96px;
    position: absolute;
    top: 20px;
    right: 20px;
    height: 96px;
    z-index: 20;
  }
  .bottomBoxConnect {
    position: absolute;
    bottom: 120px;
    width: 100%;
    .bottomBoxConnectFont {
      width: 100%;
      text-align: center;
      font-family: "SF Pro Text", sans-serif;
      font-weight: 600;
      font-size: 28px;
      color: #ffffff;
      margin-bottom: 80px;
    }
    .bottomBoxConnectGua {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .bottomBoxConnectGua {
        width: 120px;
        height: 120px;
      }
    }
    .bottomBoxInvite {
      padding-left: 60px;
      padding-right: 60px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bottomBoxInviteGua {
        width: 120px;
        height: 120px;
      }
      .bottomBoxInviteRecive {
        position: relative;
        .bottomBoxInviteReciveImg {
          width: 440px;
          height: 120px;
        }
        .bottomBoxInviteReciveBox {
          position: absolute;
          display: flex;
          align-items: center;
          right: -5px;
          top: -40px;
          .isFreeFont {
            width: 166px;
            height: 58px;
            background: linear-gradient(270deg, #f58921 0%, #fee590 100%);
            border-radius: 20px 20px 20px 20px;
            font-family: "SF Pro Text", sans-serif;
            font-weight: 600;
            font-size: 32px;
            color: #1a1a1a;
            line-height: 58px;
            text-align: center;
            margin-right: 16px;
          }
          .isFreeFontNums {
            font-family: "SF Pro Text", sans-serif;
            font-weight: bold;
            font-size: 32px;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
