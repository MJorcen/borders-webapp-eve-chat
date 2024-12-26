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
  >
    <div class="popupBox">
      <div class="popupTitleBox"></div>
      <div class="popupContentBox">
        <img src="./assets/image931@2x.webp" class="popupImg" />
        <div class="popupContentOne">
          {{ props?.tips }}
        </div>
        <!-- <div class="popupContentTwo">
          Your balance and VIP information will be automatically transferred
        </div> -->
        <div class="btnBox">
          <!-- <a :href="state.href" class="btn">Download</a> -->
          <div class="btn" @click="handleJump">Download</div>
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
import { getUrlSearchParams } from "@/common/utils";
const emit = defineEmits(["update:modelValue", "handleOpen", "handleClose"]);

interface Prop {
  modelValue: boolean;
  tips?: string;
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: false,
  tips: "Download the APP to chat with her for free",
});

const { fetchData: downConfig, data: downData } = webdownload();

const { user }: any = useUserStore();

const state = reactive({
  href: "",
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      handleShowPb();
    }
  }
);

onMounted(async () => {
  await downConfig({
    userId: user?.user.id,
  });
  const encodeURIStr = encodeURIComponent(downData.value);
  state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.global&referrer=${encodeURIStr}`;
  // state.href = `https://play.google.com/store/apps/details?id=app.duomevideochat.global&referrer=utm_source=pwa&utm_medium=cpc&utm_campaign=fall_sale&pwa_uid=${user?.user?.id}`;
});

const handleJump = async () => {
  const obj = getUrlSearchParams();

  // 拼接上报的 URL，添加必要的参数
  // const reportUrl = ``;

  // 打印上报的 URL，确认是否正确
  // console.log("上报的 URL:", reportUrl);

  // 发起上报请求
  // await fetch(reportUrl, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((response) => {
  //     // 处理响应
  //     if (response.ok) {
  //       console.log("上报成功");
  //       window.open(state.href, "_blank");
  //     } else {
  //       console.error("上报失败");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("上报时出错:", error);
  //   });
  const encodeURIStr = encodeURIComponent(downData.value);
  const url = `https://receive-us.solar-engine.com/receive/turl/EZzkk3a?attribution_type=ua&touchpoint_type=click&adgroup_name=${obj?.adgroup_name}&adgroup_id=${obj?.adgroup_id}&adplan_name=${obj?.adplan_name}&adplan_id=${obj?.adplan_id}&adcreative_name=${obj?.adcreative_name}&adcreative_id=${obj?.adcreative_id}&referrer=${encodeURIStr}`;

  window.open(url, "_blank");
};

// 目标服务器响应后调用这个函数
function handleResponse(response) {
  if (response.success) {
    console.log("上报成功");
    window.open(state.href, "_blank");
  } else {
    console.error("上报失败");
  }
}

const handleShowPb = async () => {
  const obj = getUrlSearchParams();
  // 拼接上报的 URL，添加必要的参数
  const reportUrl = `https://receive-us.solar-engine.com/receive/turl/EZzkk3a?attribution_type=ua&touchpoint_type=impression&adgroup_name=${obj?.adgroup_name}&adgroup_id=${obj?.adgroup_id}&adplan_name=${obj?.adplan_name}&adplan_id=${obj?.adplan_id}&adcreative_name=${obj?.adcreative_name}&adcreative_id=${obj?.adcreative_id}&custom_params_1=${obj?.fbpid}&custom_params_2=${obj?.fbclid}`;

  // 打印上报的 URL，确认是否正确
  console.log("上报的 URL:", reportUrl);

  // 发起上报请求
  await fetch(reportUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // 处理响应
      if (response.ok) {
        console.log("上报成功");
      } else {
        console.error("上报失败");
      }
    })
    .catch((error) => {
      console.error("上报时出错:", error);
    });
};
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
