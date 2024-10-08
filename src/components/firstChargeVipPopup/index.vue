<template>
  <van-popup
    @click-overlay="emit('update:modelValue', false)"
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="20"
  >
    <div class="popupBox">
      <div class="popupTitle">
        Open VIP now and get (<span style="color: #ff0000">{{
          props.money
        }}</span
        >) coins and 7 privileges immediately
      </div>
      <div class="contentBox">
        <div class="contentItem">
          <img src="./assets/image 994@2x.png" class="contentImg" />
          <div class="contentText">VIP sign in</div>
        </div>
        <div class="contentItem">
          <img src="./assets/Group 1000004701@2x.png" class="contentImg" />
          <div class="contentText">Free message</div>
        </div>
        <div class="contentItem">
          <img src="./assets/Group 14623@2x.png" class="contentImg" />
          <div class="contentText">50% off</div>
        </div>
      </div>
      <div class="btnBox">
        <div class="btn" @click="emit('handleOpen')">Open VIP</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive } from "vue";

const emit = defineEmits(["update:modelValue", "handleOpen"]);

interface Prop {
  modelValue: boolean;
  money: number;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  money: 0,
});
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  background-image: url("./assets/20241008-132128.png");
  background-repeat: no-repeat;
  background-size: cover;
  margin-left: 34px;
  //   margin-right: 74px;
  min-width: 640px;
  max-width: 640px;
  height: 568px;
  .popupTitle {
    padding-top: 80px;
    width: 420px;
    font-family: "Inter", sans-serif;
    font-weight: bold;
    font-size: 36px;
    color: #ffffff;
    line-height: 42px;
    padding-left: 30px;
  }
  .contentBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 80px;
    padding-right: 20px;
    .contentItem {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .contentImg {
        width: 93px;
        height: 93px;
        margin-bottom: 14px;
      }
      .contentText {
        font-family: "Inter", sans-serif;
        font-weight: 400;
        font-size: 28px;
        color: #ffffff;
        line-height: 33px;
      }
    }
  }
  .btnBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    padding-right: 30px;
    .btn {
      width: 400px;
      height: 76px;
      background: #eb6300;
      border-radius: 20px 20px 20px 20px;
      font-family: "Inter", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #ffffff;
      line-height: 76px;
      text-align: center;
    }
  }
}
</style>
