<template>
  <div
    v-if="props.modelValue && !state.inRoom"
    class="notification"
    :class="{ show: props.modelValue }"
  >
    <div
      class="notificationBox"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="notificationBoxLeft">
        <van-image
          round
          fit="cover"
          radius="50"
          lazy-load
          :src="props?.wsData?.avatar"
          alt=""
          class="hostImg"
        ></van-image>
        <div class="contentBox">
          <div class="name">{{ props?.wsData?.nick }}</div>
          <div class="contentBoxFlex">
            <!-- <div class="nums">
              {{
                !props?.wsData?.localCustom &&
                !JSON?.parse?.(props?.wsData?.localCustom || "{}")?.unread
                  ? `[${props?.wsData?.unread}]`
                  : `[${
                      JSON?.parse(props?.wsData?.localCustom || "{}")?.unread
                    }]`
              }}
            </div> -->
            <div
              class="text"
              v-if="
                (!props?.wsData?.localCustom &&
                  !JSON?.parse?.(props?.wsData?.localCustom || '{}')
                    ?.cusstomMsg) ||
                JSON?.parse(props?.wsData?.localCustom || '{}')?.cusstomMsg ===
                  ''
              "
            >
              {{
                props?.wsData?.lastMsg?.type === "image"
                  ? "[Picture]"
                  : props?.wsData?.lastMsg?.type === "audio"
                  ? "[Audio]"
                  : props?.wsData.lastMsg?.type === "custom" &&
                    JSON.parse(props?.wsData?.lastMsg?.content)?.type === 2
                  ? "[Video Call]"
                  : props?.wsData.lastMsg?.type === "custom" &&
                    JSON.parse(props?.wsData?.lastMsg?.content)?.type === 1
                  ? "[Gift]"
                  : props?.wsData?.lastMsg?.text
              }}
            </div>
            <div v-else class="text">
              {{
                props?.wsData?.localCustom?.includes?.("ext")
                  ? "[Picture]"
                  : JSON.parse(props?.wsData?.localCustom).cusstomMsg
              }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="notificationBoxRight"
        v-if="!state.inRoom"
        @click.stop="handleRoom"
      >
        Reply
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import evenBus from "@/common/evenBus";
import { removeSubstrings } from "@/common/utils";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

interface Prop {
  modelValue: boolean;
  wsData: any;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  wsData: {},
});

const state = reactive<any>({
  inRoom: false,
});

watch(
  () => props.modelValue,
  (newValue) => {
    let currentChatRoomObj: any;

    try {
      currentChatRoomObj = JSON.parse(
        localStorage.getItem("topNotification") || "{}"
      );
    } catch (e) {
      console.warn(e);
    }
    // currentChatRoomObj.userId ===
    // removeSubstrings(props?.wsData?.lastMsg?.from || "")
    if (currentChatRoomObj?.userId) {
      state.inRoom = true;
    } else {
      state.inRoom = false;
    }
    // debugger;

    if (newValue) {
      show();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

function show() {
  //   hide();
  //   emit("update:modelValue", true); // 关闭通知
  setTimeout(() => {
    hide();
  }, 3000); // 3秒后自动隐藏
}

function hide() {
  emit("update:modelValue", false); // 关闭通知
}

const router = useRouter();

let nim: any;

evenBus.on("setFunc", (data: any) => {
  nim = data;
});

const handleRoom = () => {
  if (props?.wsData?.localCustom) {
    nim.getLocalSession({
      sessionId: props?.wsData?.id,
      done: (error: any, session: any) => {
        console.log(error);
        console.log(session);
        console.log("获取本地会话" + (!error ? "成功" : "失败"));
        const obj = JSON.parse(session.localCustom);
        obj.unread = 0;
        nim.updateLocalSession({
          localCustom: JSON.stringify(obj),
          id: props?.wsData?.id,
          done: (err: any, obj: any) => {
            console.log(`output->错误`, err);
            console.log(`output->更新的会话结构`, obj);
          },
        });
      },
    });
  }

  const currentObj = {
    userId: removeSubstrings(props?.wsData?.lastMsg?.from),
    time: new Date().getTime(),
  };
  localStorage.setItem("currentChatRoomObj", JSON.stringify(currentObj));
  localStorage.setItem("topNotification", JSON.stringify(currentObj));

  const userObj = {
    id: removeSubstrings(props?.wsData?.lastMsg?.from),
  };

  router.push({
    name: "ChatRoom",
    query: {
      user: JSON.stringify(userObj),
    },
  });
  emit("update:modelValue", false);
};

const emit = defineEmits(["update:modelValue", "update:wsData"]);

const startX = ref(0);
const startY = ref(0);

const handleTouchStart = (event: any) => {
  startX.value = event.touches[0].clientX;
  startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event: any) => {
  event.preventDefault();
};

const handleTouchEnd = (event: any) => {
  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const swipeDistanceY = startY.value - endY;

  // 判断是否为左滑手势
  if (swipeDistanceY > 50 && Math.abs(endX - startX.value) < 50) {
    emit("update:modelValue", false);
  }
};
</script>

<style scoped lang="scss">
.notification {
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  //   background-color: #333;
  //   color: white;
  //   text-align: center;
  //   padding: 10px 0;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.5s ease;
  z-index: 20;
  padding-left: 32px;
  padding-right: 32px;
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
}
.notificationBox {
  padding: 22px 32px 32px 22px;
  // background-image: url(./assets/bg@2x.png);
  background-color: #eb6300;
  // background-size: 100% 100%;
  // background-size: cover;
  // background-repeat: no-repeat;
  border-radius: 16px;
  height: 152px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .notificationBoxLeft {
    display: flex;
    align-items: center;
    .hostImg {
      min-width: 108px;
      max-width: 108px;
      height: 108px;
    }
    .contentBox {
      margin-left: 20px;
      .name {
        font-family: "SF Pro Display", sans-serif;
        font-weight: bold;
        font-size: 32px;
        color: #fff;
        margin-bottom: 10px;
      }
      .contentBoxFlex {
        display: flex;
        align-items: center;
        .nums {
          margin-right: 4px;
          font-family: "SF Pro Text", sans-serif;
          font-weight: bold;
          font-size: 28px;
          color: #fff;
        }
        .text {
          width: 286px;
          font-family: "SF Pro Text", sans-serif;
          font-weight: 400;
          font-size: 28px;
          color: #fff;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
  .notificationBoxRight {
    width: 160px;
    height: 66px;
    background: #ffffff;
    border-radius: 198px 198px 198px 198px;
    font-family: "SF Pro Display", sans-serif;
    font-weight: 900;
    font-size: 28px;
    color: #ff834e;
    line-height: 33px;
    text-align: center;
    line-height: 66px;
  }
}
</style>
