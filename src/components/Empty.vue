<template>
  <div class="bigBox">
    <img class="bigImg" src="../assets/empty.png" />
    <div class="bigText">No Data</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
</script>
<style lang="scss" scoped>
.bigBox {
  height: 426px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .bigImg {
    width: 300px;
    height: 300px;
  }
  .bigText {
    font-family: "SF Pro Text", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #8c8c8c;
  }
}
</style>
