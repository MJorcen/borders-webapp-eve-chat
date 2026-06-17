<template>
  <van-floating-bubble
    @click.stop="router.push('/gameCat')"
    axis="xy"
    icon="chat"
    magnetic="x"
    v-model:offset="offsetPover"
    style="
      z-index: 15;
      background-color: rgba(255, 255, 255, 0);
      width: 105px;
      height: 85px;
    "
  >
    <img src="./assets/Group1000004800@2x.webp" class="icon" />
  </van-floating-bubble>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const offsetPover = ref({
  x: -138,
  y: 500,
});
</script>
<style lang="scss" scoped>
::v-depp(.van-floating-bubble) {
  z-index: 15 !important;
}
.icon {
  width: 190px;
  height: 170px;
}
</style>
