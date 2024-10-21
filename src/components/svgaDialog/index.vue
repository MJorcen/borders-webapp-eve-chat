<template>
  <transition name="modal-fade">
    <div
      v-if="state.showModal"
      class="modal-mask"
      :style="{ marginTop: `${props.top}px` }"
    >
      <div>
        <div @click.stop>
          <slot name="modalContent">
            <div id="demoCanvas" class="w-[200px] h-[200px]"></div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import SVGA from "svgaplayerweb";

import {
  defineEmits,
  reactive,
  onUnmounted,
  onMounted,
  watch,
  watchEffect,
  nextTick,
  ref,
} from "vue";

const emit = defineEmits(["closeModal"]);

const props = withDefaults(defineProps(), {
  top: 0,
  // svgaUrl: "",
});

const state = reactive({
  showModal: false,
  showClose: true,
  svgaUrl:
    "https://img.duome.live/alpha/img/240902/05662582e2690d4d219c4d6e80ca00b2.png-small",
});

const player = ref(null);
const parser = ref(null);

watch(
  () => state.showModal,
  () => {
    if (state.showModal) {
      nextTick(() => {
        handlePlay();
      });
    }
  },
  { immediate: true, deep: true }
);

const handlePlay = () => {
  // 获取id的dom元素
  player.value = new SVGA.Player("#demoCanvas");
  parser.value = new SVGA.Parser();
  parser.value.load(
    state.svgaUrl,
    function (videoItem) {
      // 你的svga文件路径
      player.value.loops = 1;
      player?.value?.setVideoItem?.(videoItem);
      player?.value?.startAnimation?.(); // 开始动画
      player?.value?.onFinished(() => {
        state.showModal = false;
      });
    },
    function (error) {
      console.log(error, "错误");
      // alert(error);
      state.showModal = false;
    }
  );
};

// 新增方法：控制body滚动
const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

// 当组件挂载后和卸载前分别处理滚动锁定
onMounted(() => {
  state.showModal && toggleBodyScroll(true); // 如果初始状态就是显示的，也要锁定滚动
});
onUnmounted(() => {
  toggleBodyScroll(false);
});

// 修改state.showModal时调用toggleBodyScroll
watch(
  () => state.showModal,
  (newValue) => {
    toggleBodyScroll(newValue);
  },
  { immediate: true }
);

defineExpose({
  state,
});
</script>

<style scoped lang="scss">
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(3px); /* 模糊效果，数值越大模糊程度越高 */
  //   -webkit-backdrop-filter: blur(10px); /* 对于Safari的支持 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 27;
}

.top {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  .giftShop13 {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  // transition: opacity 0.1s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
