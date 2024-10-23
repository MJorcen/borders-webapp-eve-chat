<template>
  <div
    id="demoCanvas"
    class="bigBoxqq"
    :style="{
      width: props.width + 'px',
      height: props.height + 'px',
      backgroundColor: 'none',
    }"
  ></div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from "vue";
import SVGA from "svgaplayerweb";

interface Prop {
  url: string;
  width: number | string;
  height: number | string;
}

const props = withDefaults(defineProps<Prop>(), {
  url: "",
  width: 44,
  height: 44,
});

const player = ref<any>(null);
const parser = ref<any>(null);

onMounted(() => {
  nextTick(() => {
    player.value = new SVGA.Player("#demoCanvas");
    parser.value = new SVGA.Parser();
    parser.value.load(
      props.url,
      function (videoItem: any) {
        // 你的svga文件路径
        // player.value.loops = 1;
        player?.value?.setVideoItem?.(videoItem);
        player?.value?.startAnimation?.(); // 开始动画
      },
      function (error) {
        console.log(error, "错误");
      }
    );
  });
});
</script>
<style lang="scss" scoped>
.bigBoxqq {
  background-color: none !important;
}
</style>
