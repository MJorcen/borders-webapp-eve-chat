<template>
  <van-popup
    @click-overlay="
      props.goldNums !== 8000 ? emit('update:modelValue', false) : ''
    "
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
      <!-- <div class="siginImg">
        <div class="fontBox">
          You must download the app to sign-in and get
          <span style="color: #f30102">{{ props.goldNums }}</span> coins for
          free
        </div>
        <div class="btnBox">
          <a :href="state.href" class="btn">Download</a>
        </div>
      </div> -->
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive, onMounted } from "vue";
import { checkInvip, webdownload } from "@/api/allApi";
import { useUserStore } from "@/stores/user";

const emit = defineEmits(["update:modelValue", "update:wsData"]);

interface Prop {
  modelValue: boolean;
  goldNums: number;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  goldNums: 5700,
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
const state = reactive({
  href: "",
});

const { fetchData: downConfig, data: downData } = webdownload();

const { user }: any = useUserStore();

onMounted(async () => {
  await downConfig({
    userId: user?.user.id,
  });
  const encodeURIStr = encodeURIComponent(downData.value);
  state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.global&referrer=${encodeURIStr}`;
});
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  background-color: none;
  min-width: 100%;
  max-width: 100%;

  // .siginImg {
  //   width: 680px;
  //   height: 848px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   flex-direction: column;
  //   background-image: url(./assets/Group1000004833@2x.webp);
  //   background-size: 680px 848px;
  //   // background-size: contain;
  //   background-repeat: no-repeat;
  //   padding-left: 62px;
  //   padding-right: 62px;
  //   .fontBox {
  //     margin-top: 400px;
  //     font-family: "Inter", sans-serif;
  //     font-weight: 500;
  //     font-size: 32px;
  //     color: #ffffff;
  //     line-height: 38px;
  //     text-align: center;
  //   }
  //   .btnBox {
  //     display: flex;
  //     align-items: center;
  //     justify-items: center;
  //     width: 100%;
  //     padding-left: 44px;
  //     padding-right: 44px;
  //     .btn {
  //       margin-top: 20px;
  //       margin-bottom: 30px;
  //       width: 100%;
  //       height: 100px;
  //       background: #eb6300;
  //       border-radius: 20px 20px 20px 20px;
  //       font-family: "Inter", sans-serif;
  //       font-weight: normal;
  //       font-size: 40px;
  //       color: #fefefe;
  //       line-height: 100px;
  //       text-align: center;
  //     }
  //   }
  // }
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
        background-color: #ec6101;
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
