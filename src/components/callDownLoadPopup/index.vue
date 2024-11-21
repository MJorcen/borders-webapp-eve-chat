<template>
  <van-popup
    @click-overlay="emit('update:modelValue', false)"
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="20"
  >
    <div class="popupBox">
      <div class="popupTitleBox"></div>
      <div class="popupContentBox">
        <img src="./assets/image_930@2x.webp" class="popupImg" />
        <div class="popupContentOne">
          <!-- Aapka abhi ka network video chat ko support nahi karta he, krpaya
          <span style="color: #e54b6d">video call karne</span> ke liye App
          download kare, aur aap <span style="color: #e54b6d">5700</span> sikke
          bhi free me praapt kar sakte he. -->
          Abhi network unstable he. Plz call ke liye App ka upyog kare, aapka
          VIP status aur Balance ko nahi kata jayega.
        </div>
        <!-- <div class="popupContentTwo">
          Aapka balance aur VIP jaankari svachaalit roop se transfer kar di
          jayegi.
        </div> -->
        <div class="btnBox">
          <a :href="state.href" class="btn">Download</a>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive, h, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { webdownload } from "@/api/allApi";
const emit = defineEmits(["update:modelValue", "handleOpen"]);

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const { fetchData: downConfig, data: downData } = webdownload();

const { user }: any = useUserStore();

const state = reactive({
  href: "",
});

watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue) {
      await downConfig({
        userId: user?.user.id,
      });
      const encodeURIStr = encodeURIComponent(downData.value);
      state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.idn&referrer=${encodeURIStr}`;
    }
  }
);

onMounted(async () => {
  // state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.idn&referrer=utm_source=pwa&utm_medium=cpc&utm_campaign=fall_sale&pwa_uid=${user?.user?.id}`;
});
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  .popupTitleBox {
    width: 600px;
    height: 120px;
    background: linear-gradient(90deg, #fcb73e 0%, #fc9b57 100%);
    border-radius: 20px 20px 0px 0px;
  }
  .popupContentBox {
    width: 600px;
    background: #752e2e;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 36px;
    flex-direction: column;
    .popupImg {
      width: 180px;
      height: 175px;
    }
    .popupContentOne {
      //   padding-left: 42px;
      //   padding-right: 42px;
      padding-left: 24px;
      padding-right: 24px;
      font-family: "ABeeZee", sans-serif;
      font-weight: 400;
      font-size: 40px;
      color: #ffffff;
      text-align: center;
    }
    .popupContentTwo {
      text-align: center;
      margin-top: 20px;
      padding-left: 24px;
      padding-right: 24px;
      font-weight: 400;
      font-size: 40px;
      color: #ffffff;
    }
    .btnBox {
      display: flex;
      align-items: center;
      justify-items: center;
      width: 100%;
      padding-left: 44px;
      padding-right: 44px;
      .btn {
        margin-top: 20px;
        margin-bottom: 30px;
        width: 100%;
        height: 100px;
        background: #eb6300;
        border-radius: 20px 20px 20px 20px;
        font-family: "Inter", sans-serif;
        font-weight: normal;
        font-size: 40px;
        color: #fefefe;
        line-height: 100px;
        text-align: center;
      }
    }
  }
}
</style>
