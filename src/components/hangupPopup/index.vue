<template>
  <van-popup
    @click-overlay="emit('update:modelValue', false)"
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="9920"
  >
    <div class="popupBox">
      <div class="popupTitleBox">
        <img src="./assets/vidoo@2x.webp" class="topImg" />
      </div>
      <div class="popupContentBox">
        <div class="popupContentOne">Are you sure to hang up?</div>
        <!-- <img src="./assets/down.webp" class="downImg" /> -->

        <div class="btnBox">
          <div class="leftBtn" @click="emit('update:modelValue', false)">
            Cancel
          </div>
          <div
            class="rightBtn"
            @click="
              () => {
                emit('handleSure');
                emit('update:modelValue', false);
              }
            "
          >
            Hang up
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive, h, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
const emit = defineEmits(["update:modelValue", "handleSure"]);

interface Prop {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
});

const { user }: any = useUserStore();

const state = reactive({
  href: "",
});
</script>
<style lang="scss" scoped>
.van-popup {
  background: none;
}
.popupBox {
  height: 500px;
  background: #752e2e;

  .popupTitleBox {
    width: 600px;
    height: 138px;
    background: linear-gradient(90deg, #fcb73e 0%, #fc9b57 100%);
    border-radius: 20px 20px 0px 0px;
    display: flex;
    align-items: center;
    .topImg {
      width: 138px;
      height: 48px;
    }
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
      margin-bottom: 100px;
    }
    .downImg {
      margin-top: 20px;
      margin-bottom: 20px;
      width: 150px;
      height: 150px;
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
      justify-content: space-between;
      width: 100%;
      padding-left: 32px;
      padding-right: 32px;
      .leftBtn {
        width: 248px;
        height: 74px;
        background: #ffffff;
        border-radius: 24px;
        border: 5px solid #eb6300;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 40px;
        color: #eb6300;
        text-align: center;
        line-height: 74px;
      }
      .rightBtn {
        width: 248px;
        height: 74px;
        background: #eb6300;
        border-radius: 24px;
        font-family: "Inter", sans-serif;
        font-weight: 500;
        font-size: 40px;
        color: #fff;
        text-align: center;
        line-height: 74px;
      }
    }
  }
}
</style>
