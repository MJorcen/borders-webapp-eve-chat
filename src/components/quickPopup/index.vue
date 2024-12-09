<template>
  <van-popup
    @click-overlay="
      () => {
        emit('handleClose');
        emit('update:modelValue', false);
      }
    "
    v-model:show="props.modelValue"
    position="center"
    round
    z-index="20"
  >
    <div>
      <div class="popupBox">
        <div class="popupTitleBox">
          <img src="./assets/vidoo@2x.webp" class="topImg" />
        </div>
        <div class="popupContentBox">
          <img :src="props?.imgUrl" class="downImg" />
          <div class="popupContentOne" v-if="props?.showTopTips">
            The girls is waiting for you.
          </div>
          <div class="popupContentOne">{{ props?.tips }}</div>

          <div class="btnBox">
            <div
              class="btn"
              @click="
                () => {
                  emit('handleOpen');
                }
              "
            >
              Think again
            </div>
          </div>
        </div>
      </div>
      <div class="closeBtn">
        <van-icon
          @click="
            () => {
              emit('handleClose');
              emit('update:modelValue', false);
            }
          "
          color="#ffffff"
          name="close"
          :size="50"
          class="closeIcon"
        />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { showLoadingToast, showToast } from "vant";
import { ref, reactive, h, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { webdownload } from "@/api/allApi";
const emit = defineEmits(["update:modelValue", "handleOpen", "handleClose"]);

interface Prop {
  modelValue: boolean;
  imgUrl?: string;
  tips?: string;
  showTopTips?: boolean;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  imgUrl: "",
  tips: "She likes you Are you sure to quit?",
  showTopTips: false,
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
  .popupTitleBox {
    width: 600px;
    height: 120px;
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
    }
    .downImg {
      margin-top: 20px;
      margin-bottom: 20px;
      width: 176px;
      height: 186px;
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
.closeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
}
</style>
