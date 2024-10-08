<template>
  <van-popup
    @click-overlay="emit('update:modelValue', false)"
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="20"
  >
    <div class="popupBox">
      <div class="topBox">
        <img src="./assets/topBg.png" class="topBg" alt="" />
      </div>
      <div class="contentBox">
        <div class="contontentTop">
          <img src="./assets/baoxiang.png" class="baoxiang" alt="" />
        </div>
        <div class="font">VIP daily sign-in</div>
        <div class="contontentTop" style="margin-bottom: 0px">
          <div class="btn" @click.stop="handleSign">sgin in</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive } from "vue";
import { checkInvip } from "@/api/allApi";

const emit = defineEmits(["update:modelValue", "update:wsData"]);

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const {
  fetchData: signFetch,
  msg: signMsg,
  success: signSuccess,
} = checkInvip();

const handleSign = async () => {
  showLoadingToast({
    message: "Please wait...",
    duration: 0,
    forbidClick: true,
  });
  await signFetch();
  if (signSuccess.value) {
    showToast("Success");
    emit("update:modelValue", false);
  } else {
    showToast(signMsg.value);
  }
};
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  background-color: none;
  .topBox {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .topBg {
      width: 424px;
      height: 138px;
    }
  }
  .contentBox {
    width: 620px;
    height: 554px;
    background: linear-gradient(180deg, #fff3de 0%, #ffffff 100%);
    border-radius: 40px 40px 40px 40px;
    padding-top: 80px;
    .contontentTop {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      .baoxiang {
        width: 200px;
        height: 200px;
      }
      .btn {
        width: 360px;
        height: 100px;
        background: linear-gradient(90deg, #ff834e 0%, #ff4d42 100%);
        border-radius: 16px 16px 16px 16px;
        font-family: "SF Pro Display", sans-serif;
        font-weight: 500;
        font-size: 40px;
        color: #ffffff;
        line-height: 100px;
        text-align: center;
      }
    }
    .font {
      margin-top: 10px;
      padding-left: 106px;
      padding-right: 106px;
      font-family: "SF Pro Display", sans-serif;
      font-weight: 400;
      font-size: 36px;
      color: #1a1a1a;
      line-height: 42px;
      text-align: center;
      margin-bottom: 40px;
    }
  }
}
</style>
