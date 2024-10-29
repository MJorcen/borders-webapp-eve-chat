<template>
  <div class="bigBox">
    <img class="bigImg" src="../assets/Group1000004748@2x.webp" />
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
    width: 527px;
    height: 269px;
  }
  .bigText {
    font-family: "SF Pro Text", sans-serif;
    font-weight: 400;
    font-size: 28px;
    color: #fff;
  }
}
</style>
